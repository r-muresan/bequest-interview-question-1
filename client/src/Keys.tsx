import React, {Dispatch, SetStateAction, useEffect } from "react";
import { downloadObjectAsJson} from "./utils.ts";
import {FileUploader} from "./FileUploader.tsx";

// This class is used to abstract the access to the browser indexed database that will be used as the persisted store
// for the signing keys used in the digital signature solution.
class KeyStore {
    db ?: IDBDatabase;            // Filled in when the open method succeeds
    dbName = "KeyStore";          // Arbitrarily selected
    objectStoreName = "keys";     // Arbitrarily selected

    // Method definitions go here
    open() {
        return new Promise((fulfill, reject) => {
            var req = indexedDB.open(this.dbName, 1);
            req.onsuccess = function(evt) {
                // Work with the database in evt.target.result
            };
            req.onblocked = function(evt) {
                // Create an Error describing the problem.
            };
            req.onupgradeneeded = function(evt) {
                // "Upgrade" or initialize the database in evt.target.result
            };

            req.onerror = function(evt) {
                reject(new Error("Error loading database"));
            };
            req.onblocked = function(evt) {
                reject(new Error("Database already open."));
            };

            req.onsuccess = (event) => {
                this.db = req.result
                fulfill(this);
            };

            req.onupgradeneeded = (event) => {
                this.db = req.result;
                if (!this.db.objectStoreNames.contains(this.objectStoreName)) {
                    var objectStore = this.db.createObjectStore(this.objectStoreName, {autoIncrement: true});
                    objectStore.createIndex("name", "name", {unique: false});
                }
            };
        });
    };

    close() {
        return new Promise((fulfill, reject) => {
            this.db.close();
            this.db = null;
            fulfill(this);
        });
    };

    saveKey(key: CryptoKeyPair, name: string) {
        return new Promise((fulfill, reject) => {
            if (!this.db) {  // No operation can be performed.
                reject(new Error("KeyStore is not open."));
            }

            if( key == null) {
                reject(new Error("Cannot store empty key."));
            }
            var transaction = this.db.transaction([this.objectStoreName], "readwrite");
            transaction.onerror = function(evt) {reject(transaction.error);};
            transaction.onabort = function(evt) {reject(transaction.error);};
            transaction.oncomplete = function(evt) {fulfill(key);};

            var objectStore = transaction.objectStore(this.objectStoreName);
            objectStore.put(key, name);
        });
    }

    getKey(name: string) {
        return new Promise((fulfill, reject) => {
            if (!this.db) { // No operation can be performed.
                reject(new Error("KeyStore is not open."));
            }

            var transaction = this.db.transaction([this.objectStoreName], "readonly");
            var objectStore = transaction.objectStore(this.objectStoreName);
            const request = objectStore.get(name);

            request.onsuccess = function(evt) {
                fulfill(request.result);
            };
            request.onerror = function(evt) {
                reject(request.error);
            };
        });
    };

    deleteKeys() {
        return new Promise((fulfill, reject) => {
            const objectStore = this.db.transaction(this.objectStoreName, "readwrite").objectStore(this.objectStoreName);
            const objectStoreClearRequest = objectStore.clear();

            objectStoreClearRequest.onsuccess = function (event) {
                fulfill(objectStoreClearRequest.result);
            };
            objectStoreClearRequest.onerror = function(evt) {
                reject(objectStoreClearRequest.error);
            };
        });
    }
}


const keyStore = new KeyStore()
type SigningKey = CryptoKeyPair | null
let currentSigningKey: SigningKey = null
let latestSigningKey: SigningKey = null

const signingKeyName = 'signature'

type KeyExists = boolean | undefined

interface KeysPanelProps {
    keyExists: KeyExists
    setKeyExists: Dispatch<SetStateAction<KeyExists>>
    keyCreatedCallback: (string) => void
    keyDisposedCallback: () => void
    keyUpdateFailed: boolean
}

// This component is panel containing all the keys management functionality.
// Uses the key store to implement the signing keys persistence.
function KeysPanel({keyExists, setKeyExists, keyCreatedCallback, keyDisposedCallback, keyUpdateFailed}: KeysPanelProps) {

    const createKey = async (): Promise<SigningKey> => {
        try {
            const key = await window.crypto.subtle.generateKey(
                {
                    name: "RSASSA-PKCS1-v1_5",
                    modulusLength: 2048, //can be 1024, 2048, or 4096
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
                },
                true, // This only applies to the private key as there would be no reason to make the public key non extractable.
                ["sign", "verify"] // Sign applies to the private key and verify to the public key.
            );
            return key
        } catch (err) {
            console.error(err);
        }
    }

    // Imports the private key from a json, which is defined in the JWK format (Json Web Key).
    // Protocol details on: https://openid.net/specs/draft-jones-json-web-key-03.html
    const importPrivateKey = async (jwk: object): Promise<CryptoKey> => {
        return await window.crypto.subtle.importKey(
            "jwk",
            jwk,
            {
                name: "RSASSA-PKCS1-v1_5",
                hash: "SHA-256",
            },
            true,
            ["sign"],
        )
    }

    // Imports the public key from a json, which is defined in the JWK format (Json Web Key).
    // Protocol details on: https://openid.net/specs/draft-jones-json-web-key-03.html
    const importPublicKey = async (jwk: object): Promise<CryptoKey> => {
        return await window.crypto.subtle.importKey(
            "jwk",
            jwk,
            {
                name: "RSASSA-PKCS1-v1_5",
                hash: "SHA-256",
            },
            true,
            ["verify"],
        )
    }

    // Imports the rsa key pair from a bequest-signing-key.json file exported previously.
    const importKeys =  async (keysJson: object): Promise<CryptoKeyPair> => {
        return {
            privateKey: await importPrivateKey(keysJson["privateKey"]),
            publicKey: await importPublicKey(keysJson["publicKey"]),
        }
    }

    // Exports the private key to a JWK.
    const exportPrivateKey = async (): Promise<JsonWebKey> => {
        const privateKeyJson = await window.crypto.subtle.exportKey('jwk', currentSigningKey.privateKey)
        return privateKeyJson
    }

    // Exports the public key to a JWK.
    const exportPublicKey = async (): Promise<JsonWebKey> => {
        const publicKeyJson = await window.crypto.subtle.exportKey('jwk', currentSigningKey.publicKey)
        return publicKeyJson
    }

    // Exports the rsa key pair to a JSON file that can be used to recover the client state or setup the same
    // client instance in another machine.
    const onExportKeys = async () => {
        downloadObjectAsJson({
            privateKey: await exportPrivateKey(),
            publicKey: await exportPublicKey(),
        },'bequest-signing-key')
    }

    // Creates a new key, the previous key will be erased.
    // They keyCreatedCallback function is used to update the server with the new key.
    const onCreateNewKey = () => {
        createKey().then((newKey) => {
            setKey(newKey, true).then(() => {
                exportPublicKey().then((publicKey) => {
                    keyCreatedCallback(publicKey)
                })
            })
        })
    };

    // Receives the signing key file and call downstream functions to store the key in the indexed db.
    const onImportKeys = (file: File) => {
        const reader = new FileReader()
        reader.onload = () => {
            const fileString = (reader.result) as string
            const fileJson = JSON.parse(fileString)
            importKeys(fileJson).then((importedKey) => {
                setKey(importedKey, true).then(() => {return})
            })
        }
        reader.readAsText(file)
    };

    // Disposes the current signing keys when the user requests.
    // We have to store the latest signing key disposed in order to do the key rotation in the server.
    const onDisposeKey = async () => {
        const latestKey = currentSigningKey
        await keyStore.deleteKeys()
        currentSigningKey = null
        setKeyExists(false)
        latestSigningKey = latestKey
        keyDisposedCallback()
    }

    // Forcefully sets the key received as the new signing key.
    const setKey = async (newKey: SigningKey, saveKey: boolean) => {
        if (saveKey) {
            await keyStore.saveKey(newKey, signingKeyName)
        }
        currentSigningKey = newKey
        setKeyExists(!!newKey)
    }

    // Loads existing keys from the indexed DB.
    // This is just a convenience to allow users to re-use the client in the same browser without re-importing the keys.
    useEffect(() => {
        keyStore.open().then(() => {
            keyStore.getKey(signingKeyName).then((currentKey: CryptoKeyPair) => {
                setKey(currentKey, false).then(() => {
                    // Here we are doing nothing for simplicity.
                    // But double checking the signatures are in sync with the server would be a good idea.
                })
            })
        })
    }, [])

    return <div
        style={{
            width: "100vw",
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
        }}
    >
        {
            (keyExists !== undefined && !keyExists) && <div style={{color: "blue", paddingBottom: 20}}>
                In order to use the client and update the data.<br />
                A new signing key needs to be created or imported.<br />
                <br />
            </div>
        }
        {
            (keyExists && <div  style={{
                fontSize: 20,
                display: "flex",
                textAlign: "left",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}>
                Observation: If the signing keys needs to be updated, you have to:
                <ul>
                    <li>Import the previous signing key if not imported already.</li>
                    <li>Click the 'Dispose key' button.</li>
                    <li>Click the 'Create key' button.</li>
                </ul>
            </div>)
        }
        {
            keyUpdateFailed && <div style={{
                color: 'red'
            }}>
                Key update failed to be received in the server.< br/>
                <div  style={{
                    fontSize: 20,
                    paddingTop: 20,
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}>
                    This means the server has a signing key that was previously generated.< br/>
                    You need that key in order to proceed with the update. <br /><br />
                    If you lost your previous key you have to reset everything by:
                    <ul style={{textAlign: 'left'}}>
                        <li>Clicking the 'Dispose key' button if enabled.</li>
                        <li>Restarting both the client and server to start fresh.</li>
                    </ul>
                </div>
                <br />
            </div>
        }
        <div style={{display: "flex", gap: "10px"}}>
            <button style={{fontSize: "20px"}} onClick={onCreateNewKey} disabled={keyExists}>
                Create Key
            </button>
            <FileUploader handleFile={onImportKeys} disabled={keyExists}>
                Import Key
            </FileUploader>
            <button style={{fontSize: "20px"}} onClick={onExportKeys} disabled={!keyExists}>
                Export Key
            </button>
            <button style={{fontSize: "20px"}} onClick={onDisposeKey} disabled={!keyExists}>
                Dispose Key
            </button>
        </div>
    </div>
}

export {
    SigningKey,
    currentSigningKey,
    latestSigningKey,
    KeysPanel,
    KeyExists,
}
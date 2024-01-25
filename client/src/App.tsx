import React, {useEffect, useState} from "react";
import { Verification, VerificationResult } from "./Verification.tsx";
import {KeyExists, KeysPanel, currentSigningKey, latestSigningKey} from "./Keys.tsx";
import { arrayBufferToBase64 } from "./utils.ts";

const API_URL = "http://localhost:8080";

// Common headers used in all requests.
const STANDARD_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
}

function App() {
    const [data, setData] = useState<string>('');
    // Current signature for the data in the server.
    const [signature, setSignature] = useState<string>('');
    // Result of the latest verification check.
    const [matches, setMatches] = useState<VerificationResult>(undefined);
    // If the signing keys are currently loaded in the client or not.
    const [keyExists, setKeyExists] = useState<KeyExists>(undefined);

    // Flag to allow showing errors in the ui.
    // This flag signals that the data has been tampered.
    const [dataTampered, setDataTampered] = useState<boolean>(false);
    // This flag signals update failed because the server rejected an update. Most likely because it contains an incorrect signature.
    const [dataUpdateFailed, setDataUpdateFailed] = useState<string>('');
    // This flag signals that the server rejected a key update. Most likely because it contains incorrect verification signature.
    const [keyUpdateFailed, setKeyUpdateFailed] = useState<boolean>(false);

    useEffect(() => {
        if (!window.crypto || !window.crypto.subtle) {
            alert("Your current browser does not support the Web Cryptography API! This page will not work.");
            return;
        }

        if (!window.indexedDB) {
            alert("Your current browser does not support IndexedDB. This page will not work.");
            return;
        }

        getData();
    }, []);

    // Loads the data from the server.
    const getData = async () => {
        const response = await fetch(API_URL);
        const {data, signature} = await response.json();
        setData(data);
        setSignature(signature)
    };

    // Signs a piece of text with the current private key.
    const signText = async (text: string, key: CryptoKey): Promise<string> => {
        if (!currentSigningKey) {
            throw new Error('Missing signing key')
        }

        const enc = new TextEncoder();
        const encodedData = enc.encode(text);
        const signature = await window.crypto.subtle.sign(
            "RSASSA-PKCS1-v1_5",
            key,
            encodedData,
        );

        return arrayBufferToBase64(signature)
    }

    const verifyTextMatchesSignature = async (text: string): Promise<boolean> => {
        return signature === await signText(text, currentSigningKey.privateKey)
    };

    // Updates the data in the server.
    const updateData = async () => {
        if (!!currentSigningKey) {
            // The signature is an array buffer, so it needs to be converted first.
            STANDARD_HEADERS["X-Bequest-Signature"] = await signText(data, currentSigningKey.privateKey)
        }

        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({data}),
            headers: STANDARD_HEADERS,
        });

        if (response.status !== 200) {
            switch (response.status) {
                case 409:
                    setDataTampered(true)
            }
            setDataUpdateFailed(data)
        }

        await getData();
    };

    // Verifies that the signature in the server matches the signature generated using the current private key in the client.
    const verifyData = async () => {
        const matches = await verifyTextMatchesSignature(data)
        setMatches(matches)
    };

    // Syncs the server with the most recent key from the client.
    const onKeyCreated = async (newKeyJwk) => {
        if (!!latestSigningKey) {
            // Sign the verification header for the keys end-point with the previous key if it exists.
            STANDARD_HEADERS["X-Bequest-Verification-Signature"] = await signText('/keys', latestSigningKey.privateKey)
        }

        const response = await fetch(API_URL + "/keys", {
            method: "POST",
            body: JSON.stringify(newKeyJwk),
            headers: STANDARD_HEADERS,
        });

        if (response.status !== 200) {
            setKeyUpdateFailed(true)
        }
    }


    const onKeyDisposed = async () => {
        setDataTampered(false)
    }

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                position: "absolute",
                padding: 0,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "20px",
                fontSize: "30px",
            }}
        >
            <KeysPanel keyUpdateFailed={keyUpdateFailed} keyExists={keyExists} setKeyExists={setKeyExists} keyCreatedCallback={onKeyCreated} keyDisposedCallback={onKeyDisposed} />

            {
                dataUpdateFailed != '' && <div style={{
                    color: 'red'
                }}>
                    Data update for '{dataUpdateFailed}' failed to be received in the server.< br/>
                </div>
            }
            {
                dataTampered && <div style={{
                    color: 'red'
                }}>
                    SECURITY WARNING: The data sent in your last update was probably tampered before it reached bequest's servers.< br/>
                    Please do not proceed using this client, contact bequest support right now.
                </div>
            }
            <div>Saved Data</div>
            <input
                style={{fontSize: "30px"}}
                type="text"
                value={data}
                onChange={(e) => setData(e.target.value)}
                disabled={!keyExists}
            />

            <div style={{display: "flex", gap: "10px"}}>
                <button style={{fontSize: "20px"}} onClick={updateData} disabled={!keyExists || dataTampered}>
                    Update Data
                </button>
                <button style={{fontSize: "20px"}} onClick={verifyData} disabled={!keyExists || data == '' || dataTampered}>
                    Verify Data
                </button>
            </div>

            <Verification matches={matches} />
        </div>
    );
}

export default App;

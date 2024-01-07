import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [backupData, setBackupData] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, hash } = await response.json();
    const isDataValid = await verifyDataIntegrity(data, hash);

    setData(isDataValid ? data : backupData);

    if(!isDataValid && backupData) {
      await updateData(backupData);
    }

    setBackupData(data);
  };

  const updateData = async (data: string) => {
    const hash = await generateHash(data);
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data, hash }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error('Error updating data:', error);
    }

    await getData();
  };

  const verifyData = async (newData: string) => {
    const response = await fetch(API_URL);
    const {_, hash} = await response.json();
    const isDataIntegrityValid = await verifyDataIntegrity(newData, hash);
    console.log("Data integrity verified:", isDataIntegrityValid);
  };

  const generateHash = async (data: string) => {
    //with Web Crypto API
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", encodedData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((_) => _.toString(16).padStart(2, "0")).join("");
    return hashHex;
  };

  const verifyDataIntegrity = async (data: string, receivedHash: string) => {
    const computedHash = await generateHash(data);
    return computedHash === receivedHash;
  };

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
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={() => {
          if (typeof data === 'string') {
            updateData(data);
          }
        }}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={() => {
          if (typeof data === 'string') {
            verifyData(data);
          }
        }}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;

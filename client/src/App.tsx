import React, { useEffect, useState } from "react";
import { SHA256, enc } from "crypto-js";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [checksum, setChecksum] = useState<string>();
  const [verified, setVerified] = useState<boolean>(false);
  const [displayVerified, setDisplayVerified] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const localChecksum = localStorage.getItem('checksum');
    if (localChecksum && localChecksum !== 'undefined') {
      setChecksum(localChecksum);
    }
  }, []);

  useEffect(() => {
    if (checksum !== undefined) {
      localStorage.setItem('checksum', checksum);
    }
  }, [checksum]);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  const updateData = async () => {
    await _updateData(data);
    await getData();
  };

  const _updateData = async (data) => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    saveChecksum(data);
    saveDataLocalStorage(data);
  };

  const saveChecksum = (data) => {
    const hash = SHA256(data).toString(enc.Hex);
    setChecksum(hash);
    setVerified(true);
    console.log("data", data);
    console.log("checksum", hash);
  };

  const saveDataLocalStorage = (data) => {
      localStorage.setItem('data', data);
  };

  const verifyData = () => {
    const hash = SHA256(data).toString(enc.Hex);
    setDisplayVerified(true);
    setVerified(hash == checksum);
    console.log("hash", hash);
    console.log("checksum", checksum);
  };

  const recoverData = async () => {
    const localData = localStorage.getItem('data');
    console.log("localData", localData);
    await _updateData(localData);
    await getData();
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
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
      { displayVerified && (
        <div>
          { verified ? (
            <div style={{ color: "green" }}>
              Verified
            </div>
          ) : (
            <>
              <div style={{ color: "red" }}>
                Tampered!
              </div>
              <button style={{ fontSize: "20px" }} onClick={recoverData}>
                Recover Data
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import SHA256 from "crypto-js/sha256";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [integrityLost, setIntegrityLost] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
    setIntegrityLost(false);
  };

  const updateData = async () => {
    if (!data) return;

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data, checksum: SHA256(data).toString() }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    const response = await fetch(API_URL);
    const { data: remoteData } = await response.json();
    setIntegrityLost(data !== remoteData);
    if (data === remoteData) {
      alert("Data is valid");
    }
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
        style={{ fontSize: "30px", backgroundColor: integrityLost ? "red" : "white" }}
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
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px", visibility: integrityLost ? "visible" : "hidden" }} onClick={getData}>
          Recovery Data
        </button>
      </div>
    </div>
  );
}

export default App;

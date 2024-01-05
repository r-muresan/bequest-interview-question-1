import React, { useEffect, useState } from "react";
import crypto from "crypto";

const API_URL = "http://localhost:8080";

const SECRET = "6c7e8f1d2a4b9e0a3f5c2d8b1a0e7b88";

function App() {
  const [data, setData] = useState<string>();
  const [hash, setHash] = useState<string>();
  
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, hash } = await response.json();

    if (hash === dataHash(data)) {
      setData(data);
      setHash(hash);
    } else {
      console.error("Data has no integrity");
    }
  };

  const updateData = async () => {
    const currentData = data;
    const currentHash = dataHash(currentData);
    
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data: currentData, hash: currentHash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    const newHash = dataHash(data);

    if (newHash === hash) {
      console.log("No change in data");
    } else {
      console.error("Data has no integrity")
    }
  };

  const dataHash = (data: string) => {
    const hash = crypto.createHmac("sha256", SECRET_KEY).update(data).digest("hex");
    return hash;
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
    </div>
  );
}

export default App;

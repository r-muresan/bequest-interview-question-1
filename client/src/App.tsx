import React, { useEffect, useState } from "react";
import { createHash } from 'crypto';

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();

  useEffect(() => {
    getData();
  }, []);
  
  const generateHash = async(data: string) =>{
    return await createHash('sha256').update(data).digest('hex');
  }

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  const updateData = async () => {
    const hash = await generateHash(data || '' )
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data, hash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    throw new Error("Not implemented");
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

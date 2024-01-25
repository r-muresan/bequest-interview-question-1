import React, { useEffect, useState } from "react";
import { signData, verifySignature } from "./util/cryptography.ts";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [dataTampered, setDataTampered] = useState(false)

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);

    const { data, signature } = await response.json();

    const isSignatureValid = verifySignature(data, signature);

    if(!isSignatureValid){
      alert('Data integrity compromised!');
      setDataTampered(true)
    }

    setData(data);
  };

  const updateData = async () => {
    const signature = signData(data!)

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data, signature }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    alert('Data updated!')
    await getData();
  };

  const recoverData = async () => {
    const response = await fetch(`${API_URL}/recover`);

    const { data, signature } = await response.json();

    const isSignatureValid = verifySignature(data, signature);

    if(!isSignatureValid){
      alert('Data integrity compromised!');
    }else {
      setDataTampered(false)
    }

    setData(data);

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
        style={{ fontSize: "30px", borderColor: dataTampered ? 'red' : '' }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData} disabled={dataTampered}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={recoverData} disabled={!dataTampered}>
          Recover Data
        </button>
      </div>
    </div>
  );
}

export default App;

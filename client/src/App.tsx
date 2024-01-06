import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  // PublicKey state variable
  const [pk, setPk] = useState<string>();
  //Signature state variable for verification
  const [signature, setSignature] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, publicKey } = await response.json();
    setData(data);
    setPk(publicKey);
  };

  const updateData = async () => {
    let response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    // Receiving digital signature from valiadating data
    let { sign } = await response.json();
    setSignature(sign);
    await getData();
  };

  const verifyData = async () => {
    let response = await fetch(API_URL + "/verifySignature", {
      method: "POST",
      body: JSON.stringify({ data, publicKey: pk, signature }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    // Alerting users if there data is being tampared or not
    if ((await response.json()) === false) {
      alert("Data has been tampered!!!!!!!");
    } else {
      alert("Data is the same");
    }
  };

  const RecoverData = async () => {
    let response = await fetch(API_URL + "/recover", {
      method: "GET",
    });
    let recoveredData = await response.json();
    setData(recoveredData.data);
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
        <button style={{ fontSize: "20px" }} onClick={RecoverData}>
          Recover Data
        </button>
      </div>
    </div>
  );
}

export default App;

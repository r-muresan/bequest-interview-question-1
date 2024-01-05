import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [hash, setHash] = useState<string>();
  const [status, setStatus] = useState<string>();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, hash } = await response.json();

    setData(data);
    setHash(hash);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    const hashGenerated = await generateHash(data);
    console.log(data);
    console.log(hashGenerated);
    console.log(hash);
    if (hashGenerated === hash) {
      setStatus("Data is not tampered");
    } else {
      setStatus("Data is tampered");
      await recoverData();
    }
  };
  const recoverData = async () => {
    const recoverResp = await fetch(API_URL + "/recover", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (recoverResp.status === 200) {
      const recoveredData = await recoverResp.json();
      console.log(recoveredData);
      setData(recoveredData.data);
      setHash(recoveredData.hash);
    }
  };
  const generateHash = async (data: string | undefined) => {
    if (data) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);

      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
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
      <div>{status}</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        data-testid="data-input"
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

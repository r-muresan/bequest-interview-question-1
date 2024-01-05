import React, { useEffect, useState } from "react";
import { SHA256, enc } from 'crypto-js';
const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [hash, setHash] = useState<string>();
  const [verified, setVerified] = useState<boolean>(true);

  useEffect(() => {
    getData();
  }, []);
    const createHash = (data:string|undefined)=> {
        if(data){
            return SHA256(data).toString(enc.Hex);
        }
        return  "";
    }
  const getData = async () => {
    const response = await fetch(API_URL);
    const { data,hash } = await response.json();
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

      const calcHash = createHash(data);
      if(calcHash!==hash) {
          setVerified(false);
      }else {
          setVerified(true);
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
          {verified && <div style={{color: 'green'}}>Verified</div>}
            {!verified && <div style={{color: 'red'}}>Not Verified</div>}
      </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
//import {SHA256, enc} from 'crypto-ts'
const crypto = require('crypto-browserify');

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>('');

  useEffect(() => {
    getData();
  }, []);
  
  const generateHash = async(data: string) =>{
//    const hashWorld = await SHA256(data).toString(enc.Hex);
    const hashWorld = await crypto.createHash('sha256').update(data).digest('hex');
    console.log('data to hash ', data, hashWorld)

    return hashWorld
  }

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  const updateData = async () => {
    const hash = await generateHash(data)
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data, hash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log('res', res)

    if(res.status === 200)
      getData();
    else{
      console.log('data tampered0');
      alert('Your data was tampered!' );
    }

  };

  const verifyData = async () => {
    const res = await fetch(`${API_URL}/recover`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if(res.status === 200)
      var { data } = await res.json();
      setData(data);
    };

  return (
    <div    >
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
          Recover Last Data
        </button>
      </div>
    </div>
  );
}

export default App;

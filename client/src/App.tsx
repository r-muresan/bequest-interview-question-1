import React, { useEffect, useState } from "react";
const crypto = require('crypto-js');

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<any>();
  const [SECRET_KEY, setSecretKey] = useState<any>();
  const [asset, setAsset] = useState<any>("");
  const [CLIENT_KEY,setClientKey] = useState<any>();

  useEffect(() => {
    verifyKey();
    getData();
  }, []);

  //Function to force user to have CLIENT_KEY (which can be shared in a secure method via mail or inperson)
  //Please copy the CLIENT_KEY from backend server log on to the frontend alert box
  const verifyKey = ()=>{
    if (checkClientKey()){
       const CLIENT_KEY : any = prompt("Please provide CLIENT_KEY, ask admin!")
       localStorage.setItem("clientKey",CLIENT_KEY)
      }
      else{
        setClientKey(localStorage.getItem('clientKey'))
      }
  }

  //TO store key in localstorage of browser
  const checkClientKey = ()=>{
    return localStorage.getItem('clientKey') == null
  }

  const getData = async () => {
    const response = await fetch(API_URL);
    const body = await response.json();

    setAsset(body.asset)
    setSecretKey(body.secret)
    setData(body.data)
  };

//Fucntion to decrypt and validate the data
 const decryptData = (ciphertext:string, key:string) => {
    const bytes = crypto.AES.decrypt(ciphertext, key);
    const decryptedText = bytes.toString(crypto.enc.Utf8);
    return decryptedText;
  }

  const updateData = async () => {
    const stamp = {
      key: CLIENT_KEY,
      data : data
    }
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(stamp),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    });

    await getData();
  };

  const verifyData = async () => {
    const decryptedData = decryptData(asset,SECRET_KEY+CLIENT_KEY)
    if (decryptedData === data){
      alert("DATA INTACT!!")
    }
    else{
      const action = window.confirm("The Data is tampered, do you want to proceed with recovery??")
      if(action){
        const response = await fetch(API_URL+"/recover");
        getData();
      }
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
      </div>
    </div>
  );
}

export default App;

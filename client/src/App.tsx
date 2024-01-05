import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8080";

async function hashString(string: string) {
    // Convert the string to an ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(string);

    // Hash the ArrayBuffer
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the ArrayBuffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}



function App() {
  const [data, setData] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  const updateData = async () => {
    // store hash of data in local storage.
    const hash = await hashString(data!);
    localStorage.setItem("dataHash",hash);
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
  const [tamperStatus,setTamperStatus] = useState(""); // state variables to indicate whether data has been tampered with
  const verifyData = async () => {
    // check that hash matches the one stored in localStorage
    const storedHash = localStorage.getItem("dataHash");
    const serverHash = await hashString(data!);
    console.log("stored hash: " + storedHash);
    console.log("server hash: " + serverHash);
    if (!storedHash || (serverHash === storedHash))
    {
      // data not tampered with
      setTamperStatus("Data has NOT been tampered with.");
    }
    else
    {
      // data tampered with
      setTamperStatus("Data HAS been tampered with.");
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
      <div>
          {tamperStatus}
        </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import CryptoJS from 'crypto-js';

const API_URL = "http://localhost:8080";

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
    // compute hash of data
    const hash = CryptoJS.SHA256(JSON.stringify(data)).toString();

    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data, hash }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
  
      alert(`Data updated successfully to: ${data}`);
      await getData();
    } catch (error) {
      console.error('Error updating data:', error);
      alert("Error updating data, check console.");
    }
  };

  const verifyData = async () => {
    try {
      const response = await fetch(`${API_URL}/verify-data`);
      const result = await response.json();

      // use alerts to notify data verification status
      if (result.verified) {
        alert("Data is verified and intact.");
      } else {
        alert("Data verification failed. Possible tampering detected.");
      }

    } catch (error) {
      console.error('Error verifying data:', error);
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

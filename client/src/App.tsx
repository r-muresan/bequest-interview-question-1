import React, { useEffect, useState } from "react";
import CryptoJS from 'crypto-js';

const API_URL = "http://localhost:8080";

type dataVersionsType = {
  [key: string]: {
    data: string,
    hash: string,
  }
};

function App() {
  const [data, setData] = useState<string>();
  const [backupData, setBackupData] = useState<dataVersionsType>({});

  useEffect(() => {
    getData();
    getDataVersions();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  // get all data versions to show on a list
  const getDataVersions = async () => {
    try {
      const response = await fetch(`${API_URL}/backup-data`);
      const result: dataVersionsType = await response.json();

      // reverse data versions object to show newest versions first
      const objectEntries = Object.entries(result);
      const reversedKeys = objectEntries.reverse();
      const reversedData = Object.fromEntries(reversedKeys);

      setBackupData(reversedData);
    } catch (error) {
      console.error('Network error:', error);
    }
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
      await getDataVersions();
    } catch (error) {
      console.error('Error updating data:', error);
      alert("Error updating data, check console.");
    }
  };

  // Alerts the user if the data has been tampered with or not
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

      <div style={{ height: "40vh", marginTop: "5vh", overflow: "scroll" }}>
        <div>Data Versions</div>
        <ul>
          {Object.entries(backupData).map(([key, value]) => (
            <li key={key} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}>
              <p>{value.data}</p>
              <p style={{ fontSize: "20px" }}>({new Date(key).toLocaleString()})</p>
              <button onClick={() => setData(value.data)}>Restore</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

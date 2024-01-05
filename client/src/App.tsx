import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  const calculateHash = async (data) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const updateData = async (newData = data) => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data: newData }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const newHash = await calculateHash(newData);
    localStorage.setItem('dataHash', newHash);
    await getData();
  };

  const verifyData = async () => {
    const currentHash = await calculateHash(data);
    const storedHash = localStorage.getItem('dataHash');
    if (currentHash !== storedHash) {
      alert('Data has been tampered with!');
      recoverData(); 
    } else {
      alert('Data is intact');
    }
  };

  const recoverData = async () => {
    try {
      const historyResponse = await fetch(`${API_URL}/history`);
      const history = await historyResponse.json();

      if (!history || history.length <= 1) {
        alert('No previous versions to recover from.');
        return;
      }

      const previousData = history[history.length - 2].data;
      setData(previousData);

      await updateData(previousData);
    } catch (error) {
      console.error('Recovery failed:', error);
      alert('Failed to recover data.');
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
        <button style={{ fontSize: "20px" }} onClick={() => updateData()}>
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

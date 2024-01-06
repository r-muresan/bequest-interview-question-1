import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [backup, setBackup] = useState<any>(null);
  const [isTampered, setIsTampered] = useState<boolean>();

  useEffect(() => {
    getData();
  }, []);

  const updateData = async () => {
    // Verify the hash before updating
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      body: JSON.stringify({ data, hash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Data updated successfully.");
      // Save backup after successful update
      await backupData();
      await getData();
    } else {
      setIsTampered(true);
      console.error("Failed to update data. Data may be tampered.");
    }
  };

  const verifyData = async () => {
    // Verify the hash
    const response = await fetch(`${API_URL}/verify`, {
      method: "POST",
      body: JSON.stringify({ data, hash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setIsTampered(false);
      console.log("Data is valid.");
    } else {
      setIsTampered(true);
      console.error("Data tampered!");
    }
  };

  const backupData = async () => {
    // Make a backup of the current data
    const response = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const backupData = await response.json();
      setBackup(backupData);
      console.log("Backup created successfully.");
    } else {
      console.error("Failed to create a backup.");
    }
  };

  const recoverData = async () => {
    // Restore data from the backup
    if (backup) {
      const response = await fetch(`${API_URL}/recover`, {
        method: "POST",
        body: JSON.stringify({ backup }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Data recovered successfully.");
        await getData();
      } else {
        alert("Failed to recover data.");
      }
    } else {
      alert("No backup available.");
    }
  };

  const getData = async () => {
    // Fetch and display the current data
    const response = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const { data, hash } = await response.json();
      setData(data);
      setHash(hash);
    } else {
      console.error("Failed to fetch data.");
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

      {/* Confirmation message based on isTampered state */}
      {isTampered !== undefined && (
        <div style={{ color: isTampered ? "red" : "green", fontSize: "20px" }}>
          {isTampered ? "Data tampered!" : "Data is valid."}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={recoverData}>
          Recover Data
        </button>
      </div>
    </div>
  );
}

export default App;

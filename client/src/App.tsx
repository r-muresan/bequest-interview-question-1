// App.tsx

import React, { useEffect, useState } from "react";
import { SHA256 } from "crypto-js";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [version, setVersion] = useState<number>(1);
  const [shouldFetchData, setShouldFetchData] = useState<boolean>(false);


  useEffect(() => {
    if (shouldFetchData) {
      getData();
      setShouldFetchData(false); // Reset to avoid fetching again
    }
  }, [shouldFetchData]);

  const getData = async () => {
    try {
      const response = await fetch(`${API_URL}?version=${version}`);
      const { data, version: newVersion } = await response.json();
      setData(data);
      setVersion(newVersion);
      console.log("Current state after setVersion:", { data, version });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateData = async () => {
    const newData = data || "";
    const checksum = SHA256(newData).toString();
     // Log the payload being sent to the server
    console.log("Request Payload:", { data: newData, checksum });

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data: newData, checksum }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    setVersion((prevVersion) => prevVersion + 1);

    setShouldFetchData(true);
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
      </div>
    </div>
  );
}

export default App;

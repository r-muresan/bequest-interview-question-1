import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [inputValue, setInputValue] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(API_URL);
      const { data } = await response.json();
      setData(data);
      setNotification(null); // Clear any previous notifications
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification("Error fetching data");
    }
  };

  const updateData = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data: inputValue }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setInputValue(""); // Clear the input after updating data
      await getData();
      setNotification("Data updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
      setNotification("Error updating data");
    }
  };

  const verifyData = async () => {
    try {
      const response = await fetch("http://localhost:8080/verify");
      const { data } = await response.json();
      setNotification(data);
    } catch (error) {
      console.error("Error verifying data:", error);
      setNotification("Error verifying data");
    }
  };

  const recoverData = async () => {
    try {
      await fetch("http://localhost:8080/recover");
      setNotification("Data recovered successfully");
    } catch (error) {
      console.error("Error recovering data:", error);
      setNotification("Error recovering data");
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "10px" }}>
        <div>Saved Data: {data}</div>
        <input
          style={{ fontSize: "30px" }}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div style={{ fontSize: "20px" }}>Status: {notification}</div>
      </div>
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

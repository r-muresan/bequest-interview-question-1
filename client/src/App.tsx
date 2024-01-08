import React, { useEffect, useState } from "react";
import "./app.css";

const API_URL = "http://localhost:8080";

interface dataObj {
  data: string;
  hash: string;
}

interface msgObj {
  message?: string;
  type?: boolean; // type will be true for success and false for failure
}

function App() {
  const [data, setData] = useState<string>();
  const [history, setHistory] = useState<dataObj[]>([]);
  const [verifyMsg, setVerifyMsg] = useState<msgObj>();

  useEffect(() => {
    getData();
    getHistory();
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => setVerifyMsg({}), 2000);
    return () => clearTimeout(timeout);
  });

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, hash } = await response.json();

    // Validate data integrity using Web Crypto API
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const computedHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (computedHash === hash) {
      setData(data);
      setVerifyMsg({ message: "Data fetched successfully", type: true });
    } else {
      console.error("Data integrity check failed");
      setVerifyMsg({ message: "Data integrity check failed", type: false });
    }
  };

  const updateData = async () => {
    // Hash the data before sending it to the server using Web Crypto API
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const dataHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data, hash: dataHash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
    await getHistory();
  };

  const getHistory = async () => {
    const response = await fetch(`${API_URL}/history`);
    const history = await response.json();
    setHistory(history);
  };

  const verifyData = async (version: dataObj) => {
    const { data: historicalData, hash: historicalHash } = version;

    // Validate data integrity using Web Crypto API
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(historicalData);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const computedHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (computedHash === historicalHash) {
      console.log("Data integrity verified for selected version");
      setVerifyMsg({
        message: "Data integrity verified for selected version",
        type: true,
      });
    } else {
      console.error("Data integrity check failed for selected version");
      setVerifyMsg({
        message: "Data integrity check failed for selected version",
        type: false,
      });
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
      {verifyMsg?.message ? (
        <div
          className={
            verifyMsg?.type ? "msg-wrapper success" : "msg-wrapper failure"
          }
        >
          {verifyMsg.message}
        </div>
      ) : (
        ""
      )}
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type='text'
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button
          style={{ fontSize: "20px" }}
          onClick={() => {
            let currentVersion =
              history.length &&
              history.find((version) => version.data === data);
            currentVersion && verifyData(currentVersion);
          }}
        >
          Verify Data
        </button>
      </div>

      <div>
        <h3>Data History:</h3>
        <ul>
          {history.map((version, index) => (
            <li key={index}>
              <button onClick={() => verifyData(version)}>
                Verify Version {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

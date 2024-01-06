import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const API_URL = "http://localhost:8080";
const secretKey = "user_secret_key";

function App() {
  const [data, setData] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  const decryptData = (encryptedData: string, key: string) => {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(
      CryptoJS.enc.Utf8
    );

    return decryptedData;
  };

  const getData = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(decryptData(result.data, secretKey));
    } catch (error) {
      console.error(error);
      alert("Failure fetching data!");
    }
  };

  const updateData = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const result = await response.json();
      setData(decryptData(result.data, secretKey));
      alert("Success updating data!");
    } catch (error) {
      console.error(error);
      alert("Failure updating data!");
    }
  };

  const verifyData = async () => {
    const response = await fetch(`${API_URL}/verify`, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result.data) alert("This data is verified!");
    else alert("This data is unverified!");
  };

  const rollbackData = async () => {
    try {
      const response = await fetch(`${API_URL}/rollback`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to rollback data");
      }

      const result = await response.json();
      setData(decryptData(result.data, secretKey));
      alert("Success Rollback Data!");
    } catch (error) {
      console.error(error);
      alert("Failure Rollback Data!");
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
        <button style={{ fontSize: "20px" }} onClick={rollbackData}>
          Rollback Data
        </button>
      </div>
    </div>
  );
}

export default App;

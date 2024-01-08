import React, { useEffect, useState, useRef } from "react";
import Message from "./Message";

const API_URL = "http://localhost:8080";

const bcrypt = require('bcryptjs');
const saltRounds = 10;

function App() {
  const previousDataRef = useRef();
  const [data, setData] = useState<string>();
  const [hash, setHash] = useState<string>();
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, hash } = await response.json();
    setData(data);
    previousDataRef.current = data; // save data for change long in case of update
    setHash(hash);
  };

  const updateData = async () => {
    setShowMessage(false);
    const hash = bcrypt.hashSync(data, saltRounds); // hash data to record authorized change
    const changeLog = {
      date: new Date(),
      oldData: previousDataRef.current,
      newData: data,
    }
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data, hash, changeLog }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {    
    // Compare hashes and determine if data has been tampered with or not
    if (bcrypt.compareSync(data, hash)) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
    setShowMessage(true);
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
      { showMessage ? <Message verified={isVerified} /> : null }
    </div>
  );
}

export default App;

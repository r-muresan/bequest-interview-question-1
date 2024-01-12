import React, { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { API_ENDPOINTS } from "./routes.js"

function App() {
  const [data, setData] = useState<string>();
  const [cookies, setCookie] = useCookies<string>(["localData", "localDataTimestamp"])
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_ENDPOINTS.DATA, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const { data, timestamp } = await response.json();
    setData(data);
    if (cookies["localData"] == null) {
      setCookie("localData", data);
      setCookie("localDataTimestamp", timestamp);
    }
  };

  const updateData = async () => {
    const submissionTime = Date.now();
    setCookie("localData", data);
    setCookie("localDataTimestamp", submissionTime);
    await fetch(API_ENDPOINTS.DATA, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, timestamp: submissionTime }),
    });

    await getData();
  };

  const verifyData = async () => {
    await fetch(API_ENDPOINTS.DATA)
      .then(res => res.json())
      .then(res => verifyDataHelper(res.data, res.timestamp));
  };

  const verifyDataHelper = async (fetchedData, fetchedDataTimestamp) => {
    const dataComparisonStr = (
      `Local Data: ${cookies.localData}\n`+
      `Fetched Data: ${fetchedData}\n\n` +
      `Local Data Timestamp: ${new Date(cookies.localDataTimestamp)}\n` +
      `Fetched Data Timestamp: ${new Date(fetchedDataTimestamp)}`
    );
    if (
        cookies.localData === fetchedData && 
        cookies.localDataTimestamp === fetchedDataTimestamp) {
      alert(
        `Fetched data matches locally stored submitted data\n\n${dataComparisonStr}`
      );
    } else if (cookies.localData == null || cookies.localData == "") {
      alert(
        `Locally stored submitted data not set\n\n${dataComparisonStr}`
      );
    } else {
      alert(
        `DATA MISMATCH\n` + 
        `Fetched data does not match last local copy of data submission\n\n${dataComparisonStr}`
      )
    }
    console.log(dataComparisonStr)
  }

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
        style={{ fontSize: "30px"}}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px"}} onClick={updateData}>
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
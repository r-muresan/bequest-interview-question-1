import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    const apiUrl: string = `${API_URL}/verify`;
    const response: Response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      toast.success("Data verified successfully");
    } else {
      toast.error("Data not verified!");
    }
  };

  const recoverData = async () => {
    const apiUrl: string = `${API_URL}/recover`;
    const response: Response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      toast.success("Database recovered successfully!");
    } else {
      toast.error("Database recovery failed!");
    }
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <ToastContainer />
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
          <button style={{ fontSize: "20px" }} onClick={verifyData} disabled={data==""}>
            Verify Data
          </button>
        </div>
        <div>
          <button style={{ fontSize: "20px" }} onClick={recoverData} disabled={data==""}>
            Recover Data
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

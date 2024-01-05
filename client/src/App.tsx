import React, { useEffect, useState } from "react";
import { sendRequest } from "./utils/sendRequest";
const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [isSignin, setIsSignin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await sendRequest(API_URL);
    if (response === null || response.status === 401) {
      setIsSignin(false);
      return;
    }

    setIsSignin(true);
    const { data } = await response.json();
    setData(data);
  };

  const updateData = async () => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    await sendRequest(API_URL, requestOptions);

    await getData();
  };

  //verify data in the database
  const verifyData = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await sendRequest(`${API_URL}/verify`, requestOptions);
      if (!response || response.status === 401) {
        setIsSignin(false);
        return;
      }

      const { message } = await response.json();
      window.alert(message);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  //resotre data to its previous value through history version control
  const restoreData = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await sendRequest(`${API_URL}/restore`, requestOptions);
      if (!response || response.status === 401) {
        setIsSignin(false);
        return;
      }

      const { message, data } = await response.json();
      setData(data);
      window.alert(message);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };
  //ask users login first to secure their data information and accessbilities
  const onLogin = async () => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(`${API_URL}/auth/login`, requestOptions);
      if (!response.ok) {
        setIsSignin(false);
        window.alert("login fail");
        return;
      }

      const { accessToken } = await response.json();
      //storing token on the localhost
      localStorage.setItem("jwt", accessToken);
      setUsername("");
      await getData();
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };
  //logout and clear token
  const onLogout = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      await sendRequest(`${API_URL}/auth/logout`, requestOptions);

      setIsSignin(false);

      localStorage.removeItem("jwt");
    } catch (error) {}
  };

  if (!isSignin) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          fontSize: "30px",
        }}
      >
        <div>
          <label>Username: </label>
          <input
            style={{ fontSize: "30px" }}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <button
          style={{
            padding: "15px 30px",
            fontSize: "20px",
            minWidth: "150px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
          onClick={onLogin}
        >
          login
        </button>
      </div>
    );
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
        <button style={{ fontSize: "20px" }} onClick={restoreData}>
          Restore Data
        </button>
      </div>
      <div>
        <button
          style={{
            padding: "15px 30px",
            fontSize: "20px",
            minWidth: "150px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;

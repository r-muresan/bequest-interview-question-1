import React, { useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        alert("Registration successful. Please log in.");
      } else {
        alert("Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const { accessToken } = await response.json();
        localStorage.setItem("token", accessToken);
        setIsLoggedIn(true);
        alert("Login successful.");
      } else {
        alert("Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setData("");
  };

  const updateData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
    });
    if (response.ok) {
      alert("Data updated successfully.");
    } else {
      alert("Failed to update data.");
    }
  };

  const verifyData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/data/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const { isVerified } = await response.json();
      alert(
        isVerified ? "Data integrity is verified." : "Data has been tampered!"
      );
    } else {
      alert("Failed to verify data integrity.");
    }
  };

  const recoverData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/data/backup`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const { data: recoveredData } = await response.json();
      setData(recoveredData);
      alert("Data recovered successfully from backup.");
    } else {
      alert("Failed to recover data.");
    }
  };

  const fetchMainDatabase = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/data/maindb`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const mainDbData = await response.json();
      console.log("Main Database:", mainDbData);
      alert("Main Database fetched. Check console for details.");
    } else {
      alert("Failed to fetch main database.");
    }
  };

  const fetchBackupDatabase = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/data/backupdb`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const backupDbData = await response.json();
      console.log("Backup Database:", backupDbData);
      alert("Backup Database fetched. Check console for details.");
    } else {
      alert("Failed to fetch backup database.");
    }
  };

  const tamperData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/data/tamperData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newData: "This is tampered data." }),
    });
    if (response.ok) {
      alert("Data has been tampered.");
    } else {
      alert("Failed to tamper data.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!isLoggedIn ? (
        <div>
          <h2>Register / Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>User Data</h2>
          <textarea
            rows={10}
            cols={30}
            value={data}
            onChange={(e) => setData(e.target.value)}
          ></textarea>
          <div>
            <button onClick={updateData}>Update Data</button>
            <button onClick={verifyData}>Verify Data</button>
            <button onClick={recoverData}>Recover Data</button>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={fetchMainDatabase}>Fetch Main Database</button>
            <button onClick={fetchBackupDatabase}>Fetch Backup Database</button>
            <button onClick={tamperData}>Tamper Data</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

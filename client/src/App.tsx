import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [verify, setVerify] = useState<any>(<div></div>);
  const [restore, setRestore] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [historyCount, setHistoryCount] = useState<number>(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
    restoreData();
  };

  const updateData = async () => {
    if (data && data.length) {
      await fetch(API_URL, {
        method: "PATCH",
        body: JSON.stringify({ data }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setVerify(<div></div>);
      await getData();
      
    } else {
      setVerify(
          <div style={{ color: 'red' }}>
            <p>need additional data</p>
          </div>
        )
    }
  };

  const restoreData = async () => {
    const res = await fetch(`${API_URL}/restore`, {
      method: "get",
    })
    const historyData = await res.json();
    setHistory(historyData);
    setHistoryCount(historyData.length - 1);
  }

  const forward = () => {
    if (historyCount < history.length - 1) setHistoryCount(historyCount + 1);
  }
  const back = () => {
    if (historyCount >= 1) setHistoryCount(historyCount - 1);
  }
  const save = async () => {
    // if (restore) setData(history[historyCount].name);
    await fetch(`${API_URL}/${history[historyCount].name}`, {
      method: "POST",
    })
    await restoreData();
    await getData();
    setRestore(false);
  }

  const displayHistory = () => {
    if (history.length) {
      return (
        <div>
          <p>{history[historyCount].createdOn}</p>
          <p>{history[historyCount].name}</p>
          <p>{history[historyCount].hex}</p>
  
          <button onClick={back}>Back</button>
          <button onClick={forward}>Forward</button>
          <button onClick={save}>Save</button>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }

  const verifyData = async () => {
    if (data && data.length) {
      const res = await fetch(`${API_URL}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ data }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
  
      const bool = await res.json();
      if (bool === 'true') {
        setVerify(
          <div style={{color: 'red'}}>
            <p>verification successful</p>
          </div>
        )
      } else {
        setVerify(
          <div style={{ color: 'red' }}>
            <p>unverified data</p>
          </div>
        )
      }
    } else {
      setVerify(
          <div style={{ color: 'red' }}>
            <p>need additional data</p>
          </div>
        )
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
        id="input"
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

        <button style={{ fontSize: "20px" }} onClick={() => setRestore(true)}>Restore Data</button>
      </div>
      {verify}

      <dialog open={restore}>
        {displayHistory()}
        <button onClick={() => setRestore(false)}>End</button>
      </dialog>

    </div>
  );
}

export default App;

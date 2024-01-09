import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [verify, setVerify] = useState<any>(<div></div>);
  const [restore, setRestore] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
    setVerify(<div></div>);
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
    setVerify(<div></div>);
    await getData();
  };

  const restoreData = async () => {
    setRestore(true);

    const res = await fetch(`${API_URL}/restore`, {
      method: "get",
    })
    const history = await res.json();
    console.log(history)
  }

  const verifyData = async () => {
    const res = await fetch(`${API_URL}/restore`, {
      method: "get",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    const bool = await res.json();
    if (bool === 'true') {
      setVerify(
        <div
          style={{
            color: 'red'
          }}
        >
          <p>verification successful</p>
        </div>
      )
    } else {
            setVerify(
        <div
          style={{
            color: 'red'
          }}
        >
          <p>fail</p>
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

        <button style={{ fontSize: "20px" }} onClick={restoreData}>Restore Data</button>
      </div>
      {verify}
      <dialog open={restore}>
        hello world
        <button onClick={() => setRestore(false)}></button>
      </dialog>
    </div>
  );
}

export default App;

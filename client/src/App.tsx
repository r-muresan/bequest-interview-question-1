import React, { useEffect, useState } from "react";
import { useRequest } from "./hooks/useRequest";

// const API_URL = "http://localhost:8080";

function App(): JSX.Element {
  const [data, setData] = useState<string>("");
  const [responseHash, setResponseHash] = useState<string | null>(null);

  const { updateData, getData, validateResponse } = useRequest();

  const fetchData = async (): Promise<void> => {
    const { msg, hash } = await getData();
    setResponseHash(hash);
    setData(msg);
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  const verifyData = (): void => {
    if (!validateResponse(data, responseHash)) {
      if (
        window.confirm(
          "the data has been tampered with, Do you want to try again?",
        )
      ) {
        fetchData().catch(console.error);
      }
    } else {
      alert("the data has not been tampered");
    }
  };

  const onClick = async (): Promise<void> => {
    await updateData(data);
    await fetchData();
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
      }}>
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={e => {
          setData(e.target.value);
        }}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{ fontSize: "20px" }}
          onClick={async () => await onClick()}>
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

import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";

const API_URL = "https://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // useEffect(() => {
  //   getData();
  // }, []);

  const getData = async () => {

    try{
      const response = await fetch(API_URL);
      const { data: responseData} = await response.json();

      bcrypt.compare(data, responseData, function(err: Error, isMatch: boolean){
        if(err){
          throw err;
        } else if(!isMatch){
          console.log("data tampered during transit")
          setStatusMessage("Data tampered during transit. Contact someone for help!");
        } else {
          console.log("data successfully stored")
          setStatusMessage("Data successfully stored");
          setData(""); // Reset the data in the input textbox

          setTimeout(() => { //erase the message after 3 secconds
            setStatusMessage(null);
          }, 3000);
        }

      })
    } catch (error) {
      console.error("ERROR: unsuccessful fetch or parse from server", error);
    }
    
  };

  const updateData = async () => {

    //chose to hash data so that only the server and the user know the data
    //data can not even be seen by bequest finance team
    const salt = bcrypt.genSaltSync(10); //used default 10 saltrounds for now
    console.log('data',data)
    const hashedData = bcrypt.hashSync(data, salt)

    console.log(hashedData)

    try {
      const response = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify({ hashedData }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
            },
      });

      if (response.ok) {
          console.log("API call successful");
      } else {
          console.error("API call failed");
      }

    } catch (error) {
      console.error("Error during API call:", error);
    }

    //for sanity check at the moment
    window.localStorage.setItem('data',hashedData)

    await getData();
  };

  const verifyData = async () => {
    throw new Error("Not implemented");
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

      <div style={{ fontSize: "20px", color: "red" }}>{statusMessage}</div>

    </div>
  );
}

export default App;

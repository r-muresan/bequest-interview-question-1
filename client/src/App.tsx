import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";

const API_URL = "https://localhost:8080"; //turned this into an https server for enhanced security when delivering data.

function App() {
  const [data, setData] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // useEffect(() => {
  //   getData();
  // }, []);

  //setting timed UI message to show user messages about their data storage and verification
  const handleStorageStatusMessage = (message: string) => {
    setStatusMessage(message);
    setData(""); // Reset the data in the input textbox
    setTimeout(() => {
      // Erase the message after 3 seconds
      setStatusMessage(null);
    }, 3000);
  }

  //request to server to backup data when relevant
  const backupData = async () => {
    try{
      //console.log("backing up")
      const response = await fetch(`${API_URL}/backup-data`, {
        method: "POST",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json; charset=utf-8",
          },
      });
      if (response.ok){
        handleStorageStatusMessage("Data storage successful");
      } else{
        handleStorageStatusMessage("WARN: data received but failure to make backup copy");
      }
    
    } catch (error){
      console.error("Error during API call:", error);
      handleStorageStatusMessage("ERROR: error during backup")
    }
  }

  //getting data from server
  const getData = async (url: string): Promise<boolean> => {
    let getStatus = false;
  
    try {
      const response = await fetch(url);
      const { data: responseData } = await response.json();
  
      await new Promise<void>((resolve, reject) => {
        bcrypt.compare(data, responseData, (err: Error, isMatch: boolean) => {
          if (err) {
            reject(err);
          } else if (!isMatch) {
            console.log("data tampered");
            getStatus = false;
            resolve();
          } else {
            console.log("good to go")
            getStatus = true;
            resolve();
          }
        });
      });
  
      return getStatus;
  
    } catch (error) {
      console.error("ERROR: unsuccessful fetch or parse from server", error);
      getStatus = false;
      return getStatus;
    }
  };

  //updating server data
  const updateData = async () => {

    //chose to hash data so that only the server and the user know the data
    //data can not even be seen by bequest finance team
    const salt = bcrypt.genSaltSync(10); //used default 10 saltrounds for now
    const hashedData = bcrypt.hashSync(data, salt)

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
        handleStorageStatusMessage("ERROR: failure to connect to server")
        console.error("API call failed");
      }

    } catch (error) {
      handleStorageStatusMessage("ERROR: failure to connect to server")
      console.error("Error during API call:", error);
    }

    const getStatus = await getData(API_URL); //this will check the data received against the data you're inputting

    if (getStatus){
      await backupData()
    } else {
      handleStorageStatusMessage("URGENT: Data tampered/compromised!")
    }
  };

  //requesting that the server use the backup copy to restore the live copy
  const restoreData = async ()=>{
    try {
      const response = await fetch(`${API_URL}/restore-data`, {
          method: "POST",
          headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
          },
      });

    } catch (error) {
      handleStorageStatusMessage("ERROR: failure to connect to server")
      console.error("Error during API call:", error);
    }

  }

  //checking if your data in the live database is still alright, if there is a problem, then the backup copy will kick in only if you match the backup copy.
  const verifyData = async () => {

    const getStatus = await getData(API_URL)
    if (getStatus){
      handleStorageStatusMessage("Data Verification: SUCCESS")
    } else {
      handleStorageStatusMessage("Sensitive Data not matching. Checking for tampering...")
      
      const backupStatus = await getData(`${API_URL}/backup-data`)
      if (backupStatus){
        //call to the restore api
        await restoreData()
        //for users that entered data that matches backup copy, then we deduce that the "live" database is faulty and use the backup to restore their information
        handleStorageStatusMessage("Data you entered matches previous records - Looks like we are able to restore the data for you!")
      } else {
        //if the user is attempting to enter data that does not match the backup copy, then I assume that they aren't the correct user
        handleStorageStatusMessage("Your information does not match anything the system remembers. Please contact us for help.")

      }

    }
  };

  //THIS IS FOR DEVS FOR TESTING ONLY: easy way to mess with the live database and show that the backup copy kicks in the next time you hit verify
  const tamperLiveDb = async () =>{
    await fetch(`${API_URL}/tamper-live-db`, {
      method: "POST",
      headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
      },
    });
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
      </div>

      <div style={{ fontSize: "20px", color: "red" }}>{statusMessage}</div>

      <div>
      <button style={{ fontSize: "20px" }} onClick={tamperLiveDb}>
          Tamper Live DB
        </button>
      </div>

    </div>
  );
}

export default App;

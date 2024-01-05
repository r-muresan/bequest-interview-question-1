# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal database is breached. 
Only the user is able to update their own data.


**1. How does the client insure that their data has not been tampered with? Assume that the database is compromised.**
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**


Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance


# Solution

## Overview

To address the requirement of detecting tampered data in case of a compromised database and providing data recovery options:

**Detecting Tampered Data:**
- Implemented a solution using the SHA-256 hash function to create digital signatures for important data.
- Enhanced security by incorporating a secret key stored in the environment variables (.env) to hash the data. This measure ensures that if the database is compromised, any unauthorized modifications made by hackers will generate a different hash, which will alert the system of tampering.
- The secret key acts as a unique identifier, allowing the system to differentiate between valid and hacker-generated hashes.

**Recovering Lost Data:**
- Proposed a solution involving scheduled backups of important data. Currently, the backup data is stored in a local variable for demonstration purposes.
- Suggests setting up a scheduled job to regularly back up data into a secure cloud storage system. This approach ensures that even in the event of data loss due to tampering or compromise, there's a secure and accessible backup available for recovery purposes.

By combining digital signatures with a secret key for hash generation and establishing a systematic backup process to cloud storage, the system not only detects unauthorized alterations to important data but also provides a reliable means of recovering lost or compromised data.

## How to run the app? 

### Server

1. Copy `server/.env.example` to `.env` and set `HASH_SECRET_KEY`. <br />
2. run `npm start` command to start server app.

### Client

1. run `npm start` command to start client app. 

## Implementation Details

### Backend - Endpoints

- `/ GET`: Return current data
- `/ POST`: Update current data
- `/verify POST`: Check if current data is tampered with. 
- `/tamper POST`: Trigger tampering for demonstration purpose. 
- `/recover POST`: Recover with recently updated data. 

### Client 

- There are three buttons in the page; `Update Data`, `Verify Data`, `Tamper Data(Test Purpose)`
- `Update Data` will update database data with the content of input. 
- `Verify Data` will check if database data is tampered with. If so, shows error message below and give an option to `Recover`. 
    - When `Recover` is clicked, the recently updated data will be returned and visible into input. 
- `Tamper Data(Test Purpose)` will cause tampering. After clicking this button, clicking `Verify Data` will show an error that the data is tampered with. 


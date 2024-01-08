# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**


## Overview

Bequest is a system that ensures the integrity of user data, preventing incorrect distribution of assets in the event of a database breach. The system allows users to update their own data securely.

# Solution

To address the requirement of detecting tampered data in case of a compromised database and providing data recovery options:

**1. Detecting Tampered Data:**
- To ensure data integrity, the system uses a hash-based verification mechanism. When updating data, a hash of the new data is sent to the server. The server verifies the hash before updating the data, preventing tampering.
- I used SHA-256 hash function to create hash.
- Enhanced security by incorporating a secret key stored in the environment variables to hash the data. The secret key acts as a unique identifier, allowing the system to differentiate between valid and hacker-generated hashes.

**2. Recovering Lost Data:**
- Proposed a solution involving scheduled backups of important data. Currently, the backup data is stored in a local variable for demonstration purposes.

- For the data backup, CRON job is scheduled. Basically CRON jobs are used to automate recurring tasks at specified intervals, allowing users to schedule jobs to run periodically.
- Currently it backups database after every 5 seconds, but for a standard application, we can set the schedule to 1 day.
    - For Example, we can update the CRON.schedule parameter by this: "0 2 * * *". So, the cron job runs every day at 2:00 AM.


## Implementation Details


### Client:
The frontend of Bequest is built using React. It provides a user interface to interact with the backend and manage user data securely.

- There are three buttons in the page; `Update Data`, `Verify Data`, `Recover Data`.
- `Update Data` will update database data with the content of input. 
- `Verify Data` will check if database data is tampered with. The toast will be appear as per the response of the API.
- When `Recover Data` is clicked, the recently updated data will be returned and visible into input. 

### Features:

- Display and update user data.
- Verify the integrity of user data.

## Server:

The backend of Bequest is built using Node js and Express.js. It provides API endpoints for the frontend to interact with and manages user data securely.

### Features:
- RESTful API for data retrieval and updates.
- Secure data integrity verification.
- Recovery of data from a backup.

### Server - Endpoints

- `/ GET`: Return current data
- `/ POST`: Update current data and hash
- `/verify POST`: Check if current data is tampered with. 
- `/recover POST`: Recover data with recently updated data. 

## How to run the app? 

### Server

1. Copy `server/.env.example` to `.env` and set `SECRET_KEY`. <br />
2. run `npm install` command to install the packages.
3. run `npm start` command to start server app.

### Client
1. run `npm install` command to install the packages.
2. run `npm start` command to start client app. 
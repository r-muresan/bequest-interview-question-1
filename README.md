# Bequest Data Integrity and Security Solution

## Problem Statement

At Bequest, ensuring the integrity of user data is paramount to prevent incorrect asset distribution in the event of a database breach. It's crucial that only the user can update their own data. The challenge lies in guaranteeing tamper-proof data and devising a recovery mechanism in case of data compromise.

## Solution Overview

To address these concerns, I propose a comprehensive solution based on encryption and a robust backup strategy.

### 1. Data Integrity Assurance

Implement end-to-end encryption for sensitive user data using strong cryptographic algorithms. Utilize SHA-256 or similar hashing algorithms to generate unique hash values for each piece of data.

- Encrypt sensitive user data using industry-standard encryption algorithms.
- Generate and store unique hash values for each piece of encrypted data.
- During data retrieval, recalculate the hash and compare it with the stored value.
- If the hashes don't match, it indicates data tampering.

### 2. Data Recovery Mechanism

In the unfortunate event of data tampering, a reliable recovery mechanism is crucial.

- Regularly back up the encrypted user data.
- Store multiple versions of backups to facilitate point-in-time recovery.
- Set up a monitoring system to detect any changes in hash values.
- If tampering is detected, initiate a rollback process using the latest untampered backup.

## Getting Started

1. **Encryption Implementation:**

   - Choose a secure encryption algorithm (e.g., AES-256) for data encryption.
   - Implement end-to-end encryption for sensitive user data.
   - Integrate SHA-256 or similar hashing algorithms for hash generation.

2. **Hash Management:**

   - Develop a secure mechanism to store and manage hash values on the server.
   - Ensure hash values are recalculated and verified during data retrieval.

3. **Backup Strategy:**

   - Set up a regular backup schedule for encrypted user data.
   - Store backup versions securely, considering redundancy and accessibility.

4. **Monitoring and Detection:**

   - Implement a monitoring system to detect discrepancies in hash values.
   - Establish alerts and notifications for immediate response to potential tampering.

5. **Rollback Procedure:**
   - Define a clear procedure for initiating data rollback in case of tampering.
   - Communicate the rollback process to relevant stakeholders.

By following these guidelines, I can establish a robust data integrity and security framework, safeguarding user data from tampering and ensuring a reliable recovery process in case of compromise.

## How to run this app?

### Server

Execute the command `npm start` to launch the server application.

### Client

Initiate the client application by running the command `npm start`.

## Implementation Overview

### Backend - API Endpoints

- `/ GET`: Retrieves user data.
- `/ POST`: Updates user data.
- `/verify POST`: Validates the integrity of current data.
- `/rollback PUT`: Reverts user data to the previous state using backup data.

### Client

- `Update Data`: Modifies the database with the input content.
- `Verify Data`: Checks for potential tampering with database data. If tampering is detected, an error message is displayed, providing an option to `Recover`.
- `Rollback Data`: Restores the recently updated data, making it visible in the input.

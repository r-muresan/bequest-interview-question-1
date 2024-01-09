# Tamper Proof Data - Bequest-Finance-Interview

**1. How does the client ensure that their data has not been tampered with?**

In the new design, the client ensures data integrity through the use of cryptographic checksums. The `crypto-js` library is employed to calculate the SHA256 hash of the data on the client side, creating a checksum. This checksum is sent along with the data to the server during the update process. Upon receiving data from the server, the client recalculates the checksum and compares it with the server-provided checksum. If they match, the client can reasonably conclude that the data has not been tampered with during transmission.

**Other Improvements**

 We can consider using HTTPS to encrypt the communication between the client and the server to ensure the data and checksum(Hashed secret key) are transmitted securely over the network, reducing the risk of tampering during transit.

**2. If the data has been tampered with, how can the client recover the lost data?**

In a scenario where the client detects data tampering, it implies a compromise in data integrity. To recover the lost or tampered data client can take following actions:-

**User Notification:**

If the data integrity check fails during an update, the client logs an error and can notify the user about the compromised data integrity.

**Server Logging:**

The server logs detailed information about the incident, including the new data, received version, checksum from the client, and the calculated checksum on the server.

**Recovery Steps:**

The client, upon detecting compromised data integrity, triggers a new fetch to obtain a fresh and untampered copy of the data from the server.

**Security Measures:**

The code employs SHA256 hashing for data integrity checks, providing a basic level of security. However, to enhance security, additional measures such as digital signatures or encryption could be considered.


## Basic information on the logic

**Generating checksum**

When the client sends an update request to the server, it computes the SHA256 hash of the new data (newData). This hash serves as a checksum representing the integrity of the data.

**Sending checksum to the server**

The checksum is included in the request payload when updating the data on the server. This allows the server to verify the integrity of the received data.

**Verifying Checksum on the server**

On the server side, when receiving the update request, it recalculates the SHA256 hash of the received data and compares it with the checksum provided by the client. If they do not match, it indicates potential data tampering, and the server rejects the update with a 400 Bad Request response.

This basic checksum mechanism ensures that the data sent from the client to the server has not been tampered with during transit. 

### Future scope or Other methods of implementation

We can also use AWS Secrets Manager and jwt(jsonwebtoken) integration for secure storage and retrieval of sensitive data. Moreover, AWS secrets manager also has rotation policy for secrets to regularly update sensitive information.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

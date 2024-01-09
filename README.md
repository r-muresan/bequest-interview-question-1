# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached.

**1. How does the client ensure that their data has not been tampered with?**

In this implementation:

1. The client sends the server the data and a hash of the data
2. The server will then rehash the new data and compare the sent hash to the one it just generated to verify the integrity of the data.

This also verifies that the data has not been tampered with during transmission. While this checks for data integrity during transmission, it does not protect against man-in-the-middle (MITM) attacks. To protect against those, the communication channel must be secured. This can be done by encrypting communication between client and server which is typically done by using HTTPS. This requires a TLS/SSL certificate which I am not comfortable generating and sending online.

**2. If the data has been tampered with, how can the client recover the lost data?**

In the event that the data has been tampered with, the user can recover lost data in a number of ways. In this implementation:

1. A backup of the previous data will be made
2. The user will be notified of the compromised data and be prompted to reinput the data
3. If the user does not reinput the data then the backup is restored

Typically in cases of the database being compromised, there are a large number of steps that need to be taken to discover the cause and patch security breaches. In the context of this question though, keeping consistent backups to recover the database is probably the best way to handle lost/compromised data. Apart from backups, a database that also stores transactions would be useful to create an audit trail to recreate the database to a state prior to it being compromised.

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:

`npm run start` in both the frontend and backend

## To make a submission:

1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

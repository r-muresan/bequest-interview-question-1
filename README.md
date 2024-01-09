# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached.

**1. How does the client ensure that their data has not been tampered with?**

In this implementation, the client sends the server the data and a hash of the data. The server will then rehash the new data and compare the sent hash to the one it just generated to verify the integrity of the data. This also verifies that the data has not been tampered with during transmission. While this checks for data integrity during transmission, it does not protect against man-in-the-middle (MITM) attacks. To protect against those, the communication channel must be secured. This can be done by encrypting communication between client and server which is typically done by using HTTPS. This requires a TLS/SSL certificate which I am not comfortable generating and sending online.
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:

`npm run start` in both the frontend and backend

## To make a submission:

1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

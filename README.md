# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal database is breached.
Only the user is able to update their own data.

**1. How does the client insure that their data has not been tampered with? Assume that the database is compromised.**
To verify if the client and the server data is not tampered, I followed the following steps

1. Server generates public and private key
2. When the client initates communication, server sends the public key to the client
3. Client sends the data to server and server store the same in database
4. Server then generates the digital signature and sends it back to client
5. In order to verify that the data is not tampered, client will send digital signature and public key to the server and the server verifies if the data is tampered through digital signature

<br />
**2. If the data has been tampered with, how can the client recover the lost data?** <br/>
I am using a backup to maintain the historical data. The historical data is backedup after every update request from the client.

### Demo:

![Demo](https://raw.githubusercontent.com/Akhilasulgante/bequest-interview-question-1/main/client/public/bequest.finance.gif)

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:

`npm run start` in both the frontend and backend

## To make a submission:

1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal database is breached.
Only the user is able to update their own data.

**1. How does the client insure that their data has not been tampered with? Assume that the database is compromised.**
To verify if the client and the server data is not tampered with, I followed the following steps

1. The server generates a public and private key
2. When the client initiates communication, the server sends the public key to the client
3. The client sends the data to the server and the server stores the same in the database
4. The server then generates the digital signature and sends it back to the client
5. To verify that the data is not tampered with, the client will send a digital signature and public key to the server and the server will verify if the data is tampered with through a digital signature

<br />
**2. If the data has been tampered with, how can the client recover the lost data?**<br/>
I am using a backup to maintain the historical data. The historical data is backed up after every update request from the client.

### Demo:

![Demo](https://raw.githubusercontent.com/Akhilasulgante/bequest-interview-question-1/main/client/public/bequest.finance.gif)

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:

`npm run start` in both the frontend and backend

## To make a submission:

1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

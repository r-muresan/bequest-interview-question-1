# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**

Digital signing was the technique used in this project to ensure the data has not been tampered. I used symmetric encryption with private key shared by both client and server to create and verify signatures in responses. Although this technique works well in this case, the other solution would be to use an asymmetric encryption algorithm such as RSA which   is more reliable due to its private/public keys system.
  
**2. If the data has been tampered with, how can the client recover the lost data?**
To recover the lost data I utilised a backup where I maintained old data to reset the real database to a previous answer in case of tampering. The data both in the database and in the backup were stored with the signatures to check tampering during the recovering process.


A system to be more tamper proof should also use other tecniques such as user authentication/authorization,
HTTPS and the keys should be stored in secured files.


#
Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

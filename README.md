# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal database is breached. 
Only the user is able to update their own data.

## Questions and Answers

**1. How does the client insure that their data has not been tampered with? Assume that the database is compromised.**

To verify the integrity of our data, assuming that the database is compromised, we can use digital signatures, which is basically when we send data to a server, it’s signed with a private key. The signature is sent with the data along with it and when we receive the data, we can use a public key to verify the signature. If our data has been changed, the signature won’t match, which means you’ve tampered with it.

Another approach could be using cryptographic hash functions. Before sending our data to the server, we can use a cryptographic hash function to calculate the hash of our data. This hash will then be stored locally and every time we try to retrieve our data, the hash will be re-calculated and compared to the stored one, so any discrepancies will indicate that our data has been tampered with. I really liked the second approach and hence I have implemented it in this repo ensuring integrity and taking precautionary steps for tampering.

**2. If the data has been tampered with, how can the client recover the lost data?**

To recover data, we'll need to use either version control on the server or use any distributed ledger technology. For the version control method, we can save a new version each time we update the data. If we detect any tampering, we can ask the client for a previous, “clean” version. For the distributed ledger technology method, we can utilize a blockchain or other distributed ledger technology that is inherently resistant to changes. Once we write the data, it can’t be altered without being detected, so we'll have a clear record of changes. I have also added version control to the repo to ensure data recovery.

### To run the apps:
Run `npm run start` in both the frontend and backend.

## To make a submission:
1. Clone the repo.
2. Make a PR with your changes in your repo.
3. Email your GitHub repository to robert@bequest.finance

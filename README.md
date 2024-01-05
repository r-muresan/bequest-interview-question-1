# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal database is breached. 
Only the user is able to update their own data.


**1. How does the client insure that their data has not been tampered with? Assume that the database is compromised.**
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**


Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

<!-- ANSWERS -->
**1. How does the client insure that their data has not been tampered with? Assume that the database is compromised.**
I would hash the user data and put it on a blockchain. If the user updates their data I would make sure the hash is also updated. If there was tampering we can check the hash of the blockchain records and will we see that it doesn't match. 

**2. If the data has been tampered with, how can the client recover the lost data?**
If the blockchain used smart contracts there would be automatic backups at certain points in time. Another way is to utilitize the audit trail to find any changes that were made. 

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal database is breached.
Only the user is able to update their own data.

**1. How does the client insure that their data has not been tampered with? Assume that the database is compromised.** The client can store a hash of the data, and then rehash the data in the database (as demonstrated in my modified code). If the hashes match, the data is intact. Otherwise, it has been compromised.
<br />
**2. If the data has been tampered with, how can the client recover the lost data?** The client can use a backup of the database.

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:

`npm run start` in both the frontend and backend

## To make a submission:

1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

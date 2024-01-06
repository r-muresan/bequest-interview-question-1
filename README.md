# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal database is breached.
Only the user is able to update their own data.

**1. How does the client insure that their data has not been tampered with? Assume that the database is compromised.**
The client ensures data integrity by storing a hash with the data on the server and verifying it during updates, even if the database is compromised.
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**
In case of tampering, the client recovers lost data by fetching a backup from the backup storage(in this case it is stored in a state) and triggering a restoration process, maintaining data integrity.

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:

`npm run start` in both the frontend and backend

## To make a submission:

1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal database is breached. 
Only the user is able to update their own data.


**1. How does the client insure that their data has not been tampered with? Assume that the database is compromised.**
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**


Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

### To run the solution
1. Start the Backend Server `npm i && npm run start`
2. Start the Frontend Server `npm i && npm run start`
3. Copy the CLIENT_KEY (DEC7ECA8DA1ABDB239FE97F3766C5) from backend server log and paste in the alert box of frontend. ( The idea is to share the CLIENT_KEY to the end customer securely to valid and handle security to ensure the asset is only updated by the user and server)

![Alt text](proposed_solution.png?raw=true)

## To make a submission:
1. Clone the repo 
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

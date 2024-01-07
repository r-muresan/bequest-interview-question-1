# Tamper Proof Data

At Bequest, we require that important user data is tamper-proof. Otherwise, our system can incorrectly distribute assets if our internal database is breached. 
Only the user can update their data.


**1. How does the client ensure that their data has not been tampered with? Assume that the database is compromised.**
    Each time the client inputs data, the server stores a SHA-256 hash of that data rather than the raw information. Consequently, when the client submits new data, a distinct hash for the corresponding information is stored on the server.
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**
    Each time clients input new data, a backup is generated and stored. This ensures that in the event of data compromise, clients can easily revert to the original information at any time in the future. I've incorporated a dedicated button for this functionality in the user interface (UI).

To enhance security, we can implement an additional layer by encrypting the backup file. This extra measure ensures that even if an attacker gains access to the backup, they won't be able to tamper with its contents. Integrating encryption for the backup file adds an extra level of protection to our system.


### To run the apps:
```npm run start``` in both the frontend and backend


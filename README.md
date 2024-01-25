# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

# Solution

The software needs to be able to recover from data tampering on the wire and on the back-end servers and database.

The solution provided here makes a heavy usage of asymmetric cryptography, particularly rsa key pairs.
Rsa was picked because it allows us to generate a key pair in the client and send only the public key for the server.

This allows us to have a very strong security property that the private key will remain isolated in the client, that way no security 
breaches would allow data tampering, even if the attacker has root access for the web server and database.

In high level the overall idea is to require a rsa key pair to be loaded in the client before any data can be uploaded.

This rsa key pair is going to be split pretty much how github manages SSH keys, the public key will be sent to the server 
and will be used to validate the authenticity of the data updates while the private key will stay in the client and will be used 
to guarantee that only the client can generate authentic updates. 

Whenever a data update is started in the client, the client would generate a digital signature of the data content and 
then always send this signature side by side with the data to the server. The server would then use the last known public 
key to validate that this signature matches the data exactly before accepting the update, otherwise it can safely reject 
the update.

In order to facilitate the key pair generation I added a Key Management panel in the client, it allows creating, exporting 
and updating the rsa key pair.

When the client creates a new key pair, we need to send the public key to the server so that the server can use it 
to validate the integrity of the digital signatures for the next updates. In order to protect this keys update mechanism 
itself from any tampering or hacking attempt we require a verification signature using the last known key.

For recovering the lost data (item 2), I believe a good solution would be to have a history log of updates in both the client 
and the server and actually chain the updates requiring the previous data signature like we did in this solution for the key 
updates. This would allow us to make sure we didn't lose any data and also detect exactly when the data tampering started in 
any sides of the wire, we could them recover the latest version of the data from the client log. 

# Possible Improvements

There are a few improvements that were not implemented for the sake of time and focusing in the main problem.

- Obviously this type of system should use HTTPS and actually enforce it using HSTS.
- User authentication is also another obvious and critical thing that is missing.
- The private keys are currently stored on IndexedDB, they have to be created as extractable keys in order for the key management panel to work. I believe the client security can be improved by using non-extractable keys. Some thought needs to be put on whether it makes more sense to create te keys externally in that case or to change the implementation such that the keys are extractable only when effectively exporting them.

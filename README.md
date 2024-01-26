# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**
<br />
To avoid data tamper we can use hashing, using a encrypttation and compare to check if the data, in this case using SHA256 algorithm will generate the same hash, since any change will result in a completely different hash. Even doing this it will make difficult for a hacker to tamper the request, but is still possible on any client side code to be modify. 
Example:
![Alt Text](/doc/example.gif)
<br />
Is important to keep logs and activity in any data changes, also moniroting tools and WAF to prevent and detect uncommon behavior and requests.
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**
<br />
We can use data versioning on our database, by keep tracking of previous versioned data and recovery in case the user want to. On a sofisticate enviroment, for example in any cloud we can also garantee backups, sql dumps to recovery the data in case the entire db was corrupted.
<br />

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

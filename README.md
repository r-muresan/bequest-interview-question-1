## Solution

### Server:

1. Hash is added to body of the api to check tampering
2. This hash acts as a secret key to check the validity of data
3. Added backup data for recovery

### Client:

1. Implemented verifyData method which generates a client side hash
2. This hash is compared with hash sent from the server
3. If the hash is tampered an API call is made to fetch backup data

### To run the apps:

`npm run start` in both the frontend and backend

### To run test cases:

`npm run test` in the frontend

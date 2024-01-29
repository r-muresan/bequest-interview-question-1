# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached.

## How Data Tampering is Prevented and Addressed

### Ensuring Data Integrity

1. **How does the client ensure that their data has not been tampered with?**

   To ensure data integrity, we use digital signatures. When a user updates their data, the client signs the data with their private key. The server verifies the data's authenticity by checking the signature with the user's public key. If the signature matches, the data is considered untampered.

   In real-life scenarios, keys should be stored securely in a Key Management System (KMS), such as AWS KMS, to prevent unauthorized access to private keys.

2. **If the data has been tampered with, how can the client recover the lost data?**

   If the data is tampered with and the verification process fails, the client can request a backup of their data. We maintain a backup database with the same data, and the client can use this backup to restore their original data.

## Running the Application

To run the apps:
`npm run start` in both the frontend and backend

## Submitting Your Solution

To make a submission:

1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your GitHub repository to robert@bequest.finance

## Security Considerations and Best Practices

- **Secure Private Key Storage**: Storing private keys on the server poses significant security risks. In a production system, you should use a secure key management system (KMS) or hardware security module (HSM) to store and use private keys securely.

- **Transport Security**: Ensure all communication between the client and server is encrypted using HTTPS to protect sensitive data in transit.

- **Key Handling**: Never transmit private keys over the network. Operations using the private key should be done server-side or in a secure, client-side environment.

- **Error Handling**: The demonstration of signature verification in the /data POST route is for educational purposes. In a real-world scenario, you should handle errors and exceptions gracefully and ensure that sensitive information is not exposed in error messages.

These security measures are essential in a real-life scenario to protect user data and ensure the integrity of the system.

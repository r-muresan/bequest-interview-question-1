# Tamper Proof Data Example

# Faq

### What does this project do?

This project implements a simple blockchain using Node.js and the Express framework, and uses Sequelize as the ORM to interact with the database.

The application consists of a blockchain structure, where blocks contain data, timestamps, cryptographic hashes and references to the hash of the previous block, guaranteeing the integrity and immutability of the chain.

The Blockchain class manages the logic of the chain, including adding new blocks, validating the chain, and restoring the chain in case of inconsistency.

The project uses a singleton standard for blockchain classes and follows a modular architecture with clearly defined services, repositories and models to facilitate management and interaction with blocks.

### What is blockchain?

Blockchain is a technology that allows the creation of distributed and secure digital records of transactions.
It works like a public ledger, with all transactions recorded in a chronological and immutable way. Each block in the chain contains a set of transactions, and once added to the chain, a block cannot be changed or deleted.

This guarantees the integrity and transparency of the recorded information.
Blockchain security is maintained through encryption and a consensus process between network participants.
When a new transaction is proposed, it needs to be verified by nodes to verify authenticity and compliance with network rules. After verification, the transaction is added to a new block and then connected to the previous block using a hash.

This process creates a series of interconnected blocks, hence the name “blockchain”, and makes it very difficult to change information without being detected, ensuring the reliability of the system.

### How can customers ensure data is not tampered with?

Chain integrity is maintained by validating each block against the previous block using a cryptographic hash. The `isChainValid()` method checks that the block hashes are correct and match the hash of the previous block, ensuring that the chain has not been tampered with.

### If data has been tampered with, how can customers recover lost data?

The `receiverChain()` method appears to be responsible for restoring the blockchain. It reloads the strings from the database and checks their integrity. If the string is corrupted, this method will return `false`, indicating that recovery has failed. However, the exact recovery mechanism (how to recover lost or corrupted data) is not clearly detailed in the provided code.

## Architectural Overview

This project adopts a "Feature by Package" architectural approach, where the code is organized into modules based on specific functionalities. Each feature, such as block management and blockchain logic, has its own set of components like models, services, repositories, and controllers. This modular structure enhances maintainability and readability, as all components related to a particular feature are located together.

Additionally, the project employs the Singleton design pattern for the Blockchain class. This pattern ensures that only one instance of the blockchain is created and used throughout the application, maintaining data consistency and integrity across all operations. The Singleton pattern is particularly beneficial in a blockchain context, where a single, consistent view of the chain is crucial.

## API Reference

### Update the data in the blockchain

```http
  POST /blockchain
```

| Parameter | Type     | Description                                                    |
| :-------- | :------- | :------------------------------------------------------------- |
| `data`    | `string` | **Required**. Text how gonna be saved in chain and in database |

#### Result

```code
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: text/html; charset=utf-8
Content-Length: 23
ETag: W/"17-4nF6ICodSzi3RHNfgXPMRFtuCUU"
Date: Sat, 20 Jan 2024 23:11:01 GMT
Connection: close

{
  "data": "block data"
}
```

### Get last data from chain

```http
  GET /blockchain/last
```

#### Result

```code
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: text/html; charset=utf-8
Content-Length: 23
ETag: W/"17-4nF6ICodSzi3RHNfgXPMRFtuCUU"
Date: Sat, 20 Jan 2024 23:12:40 GMT
Connection: close

{
  "data": "block data 4"
}
```

### Verify if chain is valid

```http
  GET /blockchain/validate
```

#### Result

```code
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: text/html; charset=utf-8
Content-Length: 23
ETag: W/"17-4nF6ICodSzi3RHNfgXPMRFtuCUU"
Date: Sat, 20 Jan 2024 23:12:40 GMT
Connection: close

true
```

### Recover chain from database and validate

```http
  GET /blockchain/recover
```

#### Result

```code
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: text/html; charset=utf-8
Content-Length: 23
ETag: W/"17-4nF6ICodSzi3RHNfgXPMRFtuCUU"
Date: Sat, 20 Jan 2024 23:12:40 GMT
Connection: close

true
```

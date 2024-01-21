# Tamper Proof Data Example

## To run the apps

create the database named bequest and follow the comands:

```bash
$ npm i
$ npm run migrate
$ npm run seed
$ npm run start
```

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

The `recoverChain()` method appears to be responsible for restoring the blockchain. It reloads the strings from the database and checks their integrity. If the string is corrupted, this method will return `false`, indicating that recovery has failed. However, the exact recovery mechanism (how to recover lost or corrupted data) is not clearly detailed in the provided code. Also, a cronjob was created to run every minute checking the integrity of the chain.

## Architectural Overview

This project adopts a "Feature by Package" architectural approach, where the code is organized into modules based on specific functionalities. Each feature, such as block management and blockchain logic, has its own set of components like models, services, repositories, and controllers. This modular structure enhances maintainability and readability, as all components related to a particular feature are located together.

Additionally, the project employs the Singleton design pattern for the Blockchain class. This pattern ensures that only one instance of the blockchain is created and used throughout the application, maintaining data consistency and integrity across all operations. The Singleton pattern is particularly beneficial in a blockchain context, where a single, consistent view of the chain is crucial.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

## Test

```bash
$ npm run test
```

## Migration

```bash
# Create a Migration File: Generate a new migration file with a command like:
$ npx sequelize-cli migration:generate --name=create-table-name
# Run the Migration: To apply the migration to your database, you would run:
$ npm run migrate
```

## Seed

To create a seeder, create a file in ./database/seeders

```bash
$ npx sequelize-cli seed:generate --name seed-name
```

```typescript
import { QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("tableName", [
      {
        field: "ABC",
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete(
      "tableName",
      {
        field: "ABC",
      },
      {}
    );
  },
};
```

## Docker

By default, the Docker will expose port 8080, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
# creating image
$ docker build -t my-server-image .
# executing docker
$ docker run -p 8080:8080 my-server-image
# Atention: Docker may need a distinct config to the database
```

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

### Main Methods:

`addBlock(data: BlockData)`: Adds a new block to the chain.

`prepareNewBlock(data: BlockData)`: Prepares a new block based on the given data and the last block in the chain.

`isChainValid()`: Checks whether the chain is intact, validating each block in relation to the previous one.

`isValidBlock(currentBlock: Block, precedingBlock: Block)`: Validates a block against its predecessor.

`calculateHashForBlock(block: Block)`: Calculates the hash of a block.

`reloadChain(force?: boolean)`: Reloads the database chain.

`getChain()`: Returns the current blockchain.

`getLastBlock()`: Returns the last block in the chain.

`calculateHash(...)`: Calculates the hash of a block based on its attributes.

`recoverChain()`: Attempts to recover the blockchain.

# Tests runned

| File                                 | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s       |
| ------------------------------------ | --------- | ---------- | --------- | --------- | ----------------------- |
| All files                            | 74.4      | 58.97      | 66.12     | 74.07     |
| database                             | 81.81     | 75         | 66.66     | 81.81     |
| database.ts                          | 81.81     | 75         | 66.66     | 81.81     | 24,33                   |
| database/config                      | 50        | 68         | 50        | 50        |
| database.config.ts                   | 50        | 68         | 50        | 50        | 33-35                   |
| src                                  | 82.75     | 20         | 66.66     | 82.75     |
| app.ts                               | 71.42     | 25         | 0         | 71.42     | 16-20                   |
| getEnvVar.ts                         | 85.71     | 0          | 100       | 85.71     | 23                      |
| index.ts                             | 100       | 100        | 100       | 100       |
| src/middlewares                      | 44.44     | 0          | 0         | 37.5      |
| error.middleware.ts                  | 44.44     | 0          | 0         | 37.5      | 13-19                   |
| src/modules/block                    | 100       | 100        | 100       | 100       |
| block.factory.ts                     | 100       | 100        | 100       | 100       |
| src/modules/block/models             | 100       | 100        | 100       | 100       |
| block.model.ts                       | 100       | 100        | 100       | 100       |
| src/modules/block/repositories       | 75        | 100        | 66.66     | 75        |
| block.repository.ts                  | 75        | 100        | 66.66     | 75        | 11-15                   |
| src/modules/block/services           | 71.42     | 100        | 66.66     | 71.42     |
| block.service.ts                     | 71.42     | 100        | 66.66     | 71.42     | 10-14                   |
| src/modules/blockchain               | 87.27     | 69.23      | 92.3      | 87.03     |
| blockchain.factory.ts                | 100       | 100        | 100       | 100       |
| blockchain.ts                        | 85.41     | 69.23      | 91.66     | 85.1      | 58,68,85,113-117        |
| src/modules/blockchain/controllers   | 75        | 100        | 81.81     | 74.19     |
| blockchain.controller.ts             | 75        | 100        | 81.81     | 74.19     | 19,28,37,46,51-55       |
| src/modules/blockchain/dtos          | 88.88     | 0          | 100       | 88.88     |
| add.block.dto.ts                     | 88.88     | 0          | 100       | 88.88     | 20                      |
| src/modules/blockchain/routes        | 100       | 100        | 100       | 100       |
| blockchain.routes.ts                 | 100       | 100        | 100       | 100       |
| src/utils                            | 100       | 100        | 100       | 100       |
| status.codes.ts                      | 100       | 100        | 100       | 100       |
| src/utils/error                      | 39.13     | 18.18      | 10        | 39.13     |
| custom.errors.ts                     | 34.61     | 0          | 0         | 34.61     | ...,39-40,46-51,60-67   |
| handler.errors.ts                    | 26.66     | 0          | 0         | 26.66     | 18-40                   |
| messages.enum.errors.ts              | 100       | 100        | 100       | 100       |
| ------------------------------------ | --------- | ---------- | --------- | --------- | ----------------------- |

Test Suites: 0 total
Tests: 0 failed, 5 passed, 5 total
Snapshots: 0 total
Time: 2.003 s

# Packages Used

Below are the npm packages used in this project, along with their respective links to documentation on the npm site.

- [**cors**](https://www.npmjs.com/package/cors): ^2.8.5

  - Description: Module that provides support for CORS (Cross-Origin Resource Sharing) middleware for Express.

- [**crypto**](https://www.npmjs.com/package/crypto): ^1.0.1

  - Description: Library for cryptographic functions in Node.js.

- [**dotenv**](https://www.npmjs.com/package/dotenv): ^16.3.1

  - Description: Loads environment variables from a `.env` file to process.env.

- [**express**](https://www.npmjs.com/package/express): ^4.18.2

  - Description: Minimalist web framework for Node.js.

- [**mysql2**](https://www.npmjs.com/package/mysql2): ^3.7.0

  - Description: MySQL Driver for Node.js.

- [**sequelize**](https://www.npmjs.com/package/sequelize): ^6.35.2

  - Description: ORM (Object-Relational Mapping) for Node.js, supporting PostgreSQL, MySQL, SQLite and MSSQL.

- [**ts-node**](https://www.npmjs.com/package/ts-node): ^10.9.2
  - Description: Executes TypeScript files directly in Node.js without the need for prior compilation.

## License

MIT

**Free Software, Hell Yeah!**

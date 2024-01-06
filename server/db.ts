import { IDatabase } from "./types";
import { encryptData, hashData } from "./utils";

const database: IDatabase = {
  key: "user_secret_key",
  data: "U2FsdGVkX18eZKPVfc3geWzvtxxeWfLManQByTD2NYE=", // Hello World!
  hash: "33a74c92d3297aeb81264eaf8d7b8fdd8d77bee842df7ea10683f8b17e6ab924",
  backupData: "U2FsdGVkX19Q0s8U0PFaVzGtNMUiqhRFXiz725w+xW0=", // Hello World
  backupHash:
    "33a74c92d3297aeb81264eaf8d7b8fdd8d77bee842df7ea10683f8b17e6ab924",
};

/**
 * Get data from the database
 * @returns IDatabase
 */
export function readDB(): IDatabase {
  return database;
}

/**
 * Store the encrypted updated data.
 * @param data
 * @returns IDatabase
 */
export function updateDB(data: string): IDatabase {
  const encryptedData = encryptData(data, database.key);
  const hashValue = hashData(data, database.key);

  // Store data and hashValue in the database
  database.data = database.backupData = encryptedData;
  database.hash = database.backupHash = hashValue;

  return database;
}

/**
 * Rollback the data with backup data.
 * @returns IDatabase
 */
export function rollbackDB(): IDatabase {
  database.data = database.backupData;
  database.hash = database.backupHash;

  return database;
}

/**
 * Check if the current data is verified.
 * @param data
 * @returns boolean
 */
export function checkDB(data: string): boolean {
  const hashValue = hashData(data, database.key);

  return database.hash === hashValue;
}

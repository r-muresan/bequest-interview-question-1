import { generateKeyPairSync } from "crypto";

interface Wallet {
  privateKey: string;
  publicKey: string;
}

interface User {
  password: string;
  wallet: Wallet;
  data: Array<{ data: string; signature: string }>; // assuming data is an array of objects with data and signature
}

export const users: Record<string, User> = {};
export const backupUsers: Record<string, User> = {};

export const generateWalletKeys = (): Wallet => {
  const { privateKey, publicKey } = generateKeyPairSync("ec", {
    namedCurve: "sect239k1",
  });

  return {
    privateKey: privateKey
      .export({ type: "sec1", format: "pem" })
      .toString("utf8"),
    publicKey: publicKey
      .export({ type: "spki", format: "pem" })
      .toString("utf8"),
  };
};

export const createUser = (username: string, hashedPassword: string) => {
  const { privateKey, publicKey } = generateWalletKeys();

  // Create user in the main database
  users[username] = {
    password: hashedPassword,
    wallet: {
      privateKey,
      publicKey,
    },
    data: [],
  };
  backupUsers[username] = {
    ...users[username],
    data: JSON.parse(JSON.stringify(users[username].data)),
  };
};

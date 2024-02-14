import { generateIdUser } from "../lib/functions/generateId";
import { createToken } from "../lib/functions/jwt";
import { User } from "../models/user";

const user = new User();

export const getUser = async (userId: string) => {
  const userFound = await user.getUserById(userId);
  if (!userFound) throw new Error("User not found");
  return userFound;
};
export const findOrCreateUser = async (name: string, password: string) => {
  // Here we perform the search in databases

  const findUser = await user.findUserByName(name);

  if (!findUser[0]) {
    const userId = generateIdUser();
    await user.createUser(userId, name, password);

    const token = await createToken({ userId, name, password });

    return { token, message: "User created" };
  }
  if (findUser[0].password !== password) throw new Error("Incorrect password");

  const token = await createToken(findUser[0]);
  return { token, message: "User found" };
};

export const updateUser = async (newName: string, dataUser: any) => {
  const { userId } = dataUser;
  if (!newName) throw new Error("The 'name' field cannot be empty");
  const findUserAndUpdate = await user.updateUserById(newName, userId);
  if (!findUserAndUpdate[0]) throw new Error("User not found");
  return findUserAndUpdate;
};

export const getChangesUserNames = async (dataUser: any) => {
  const { userId } = dataUser;
  const logChanges = await user.getChangesNameLogs(userId);
  if (!logChanges) throw new Error("Not found changes");
  return logChanges;
};

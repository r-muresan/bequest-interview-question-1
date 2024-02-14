// I simulate a model in the database to promote flow
// I apply this because I am in a technical evaluation context which does not require data persistence. Outside of this context, I would create a database to keep the data secure.

import { generateIdUser } from "../lib/functions/generateId";

export class User {
  users: any[];
  historyNames: {
    id: string;
    userId: string;
    previousName: string;
    timeChange: Date;
  }[];
  constructor() {
    this.users = [];
    this.historyNames = [];
  }
  async getUserById(userId: string) {
    return this.users.filter((u) => u.userId == userId);
  }
  async createUser(userId: string, name: string, password: string) {
    const newUser = { userId, name, password };
    const idHistory = generateIdUser();
    this.historyNames.push({
      id: idHistory.toString(),
      userId: userId,
      previousName: "",
      timeChange: new Date(),
    });

    return this.users.push(newUser);
  }
  async findUserByName(name: string) {
    const user = this.users.filter((u) => u.name === name);

    return user;
  }
  async updateUserById(newName: string, userId: any) {
    const findUser = this.users.filter((u) => u.userId === userId);

    if (findUser) {
      const previousName = findUser[0].name;
      const idHistory = generateIdUser();

      this.historyNames.push({
        id: idHistory.toString(),
        userId: userId,
        previousName: previousName,
        timeChange: new Date(),
      });
      findUser[0].name = newName;
    }
    return findUser;
  }
  async getChangesNameLogs(userId: string) {
    return this.historyNames.filter((change) => change.userId === userId);
  }
}

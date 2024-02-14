import cron from "node-cron";

export const userBackup = (user: any) => {
  // Here I'll implement logic to create a copy for security purposes, such as copying user data to other databases.
};

cron.schedule("0 2 * * *", userBackup);

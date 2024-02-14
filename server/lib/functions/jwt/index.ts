import jwt from "jsonwebtoken";

const secret = "thisissecretkey";
// This secret it will put in file '.env' but this is only example for exam don't use 'process.env.SECRET'

type UserData = {
  userId: string;
  name: string;
  password: string;
};

export const createToken = async (data: UserData) => {
  const token = await jwt.sign({ user: data }, secret);
  return token;
};

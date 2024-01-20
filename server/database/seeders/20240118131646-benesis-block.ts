import { QueryInterface } from 'sequelize';
import crypto from 'crypto';

function calculateHash(
  index: number, 
  timestamp: string, 
  data: string, 
  previousHash: string
): string {
  const hash = crypto.createHash('sha256');
  hash.update(index + timestamp + data + previousHash);
  return hash.digest('hex');
}

// const date = new Date().toUTCString()
const date = 'Fri, 19 Jan 2024 22:02:35 GMT'
const data =
JSON.stringify({ "data": "Genesis Block" })

console.log({
  index: 1,
  timestamp: date,
  data: data,
  previousHash: "",
  hash: calculateHash(1, date, data, "1")
})

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('blockchain', [{
      index: 1,
      timestamp: date,
      data: data,
      previousHash: "0",
      hash: calculateHash(1, date, data, "1")
    }]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('blockchain', 
    {
      index: 1
    }, {});
  }
};

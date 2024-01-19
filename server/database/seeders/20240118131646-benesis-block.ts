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

const date = new Date().toUTCString()
const data =
JSON.stringify({ "data": "Genesis Block" })

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('blockchain', [{
      index: 1,
      timestamp: date,
      data: data,
      previousHash: "0",
      hash: calculateHash(1, date, data, "0")
    }]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('blockchain', 
    {
      index: 0
    }, {});
  }
};

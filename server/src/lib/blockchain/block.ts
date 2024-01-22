import SHA256 from "crypto-js/sha256";

export default class Block {
  index: number;
  previousHash: string;
  data: string;
  timestamp: Date;
  hash: string = "";
  private nonce: number = 0;
  private minePrefix: string = "000";

  constructor(
    index: number = 0,
    previousHash: string = "",
    data: string = "Genesis Block"
  ) {
    this.index = index;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = new Date();
    this.mineHash();
  }

  generateHash() {
    return SHA256(
      this.index + this.previousHash + this.timestamp + this.data + this.nonce++
    ).toString();
  }

  mineHash() {
    do {
      this.hash = this.generateHash();
    } while (!this.hash.startsWith(this.minePrefix));
  }
}

import { createHash } from "node:crypto";

const digest = (value) => createHash("sha256").update(value).digest("hex");

export class MiniChain {
  constructor(difficulty = 2) {
    this.difficulty = difficulty;
    this.blocks = [this.mine({ height: 0, previousHash: "0".repeat(64), transactions: [] })];
  }

  mine({ height = this.blocks.length, previousHash = this.blocks.at(-1)?.hash, transactions }) {
    let nonce = 0;
    let hash;
    do {
      hash = digest(JSON.stringify({ height, previousHash, transactions, nonce }));
      nonce += 1;
    } while (!hash.startsWith("0".repeat(this.difficulty)));
    return { height, previousHash, transactions, nonce: nonce - 1, hash };
  }

  append(transactions) {
    const block = this.mine({ transactions });
    this.blocks.push(block);
    return block;
  }

  isValid() {
    return this.blocks.every((block, index) => {
      const expectedPrevious = index === 0 ? "0".repeat(64) : this.blocks[index - 1].hash;
      const expected = digest(JSON.stringify({
        height: block.height,
        previousHash: block.previousHash,
        transactions: block.transactions,
        nonce: block.nonce
      }));
      return block.previousHash === expectedPrevious &&
        expected === block.hash &&
        block.hash.startsWith("0".repeat(this.difficulty));
    });
  }
}

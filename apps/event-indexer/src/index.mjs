import { readFile, writeFile } from "node:fs/promises";
import { createPublicClient, getAddress, http, parseAbiItem } from "viem";
import { reduceFundingEvent, serializeState } from "./reducer.mjs";

const rpcUrl = process.env.RPC_URL ?? "http://127.0.0.1:8545";
const address = getAddress(process.env.CONTRACT_ADDRESS);
const checkpointPath = process.env.CHECKPOINT_PATH ?? "event-indexer-state.json";
const initialBlock = BigInt(process.env.START_BLOCK ?? 0);
const events = [
  parseAbiItem("event CampaignCreated(uint256 indexed id, address indexed creator, uint256 goal, uint256 deadline)"),
  parseAbiItem("event Contributed(uint256 indexed id, address indexed contributor, uint256 amount)"),
  parseAbiItem("event Claimed(uint256 indexed id, uint256 amount)"),
  parseAbiItem("event Refunded(uint256 indexed id, address indexed contributor, uint256 amount)")
];
const client = createPublicClient({ transport: http(rpcUrl) });

let checkpoint;
try {
  checkpoint = JSON.parse(await readFile(checkpointPath, "utf8"));
} catch {
  checkpoint = { lastBlock: String(initialBlock - 1n), campaigns: {} };
}
const latest = await client.getBlockNumber();
const fromBlock = BigInt(checkpoint.lastBlock) + 1n;
let state = { campaigns: checkpoint.campaigns };

if (fromBlock <= latest) {
  for (const event of events) {
    const logs = await client.getLogs({ address, event, fromBlock, toBlock: latest });
    for (const log of logs) state = reduceFundingEvent(state, log);
  }
}
await writeFile(checkpointPath, serializeState({ lastBlock: latest, ...state }));
console.log(`Indexado hasta bloque ${latest}. Campañas: ${Object.keys(state.campaigns).length}`);

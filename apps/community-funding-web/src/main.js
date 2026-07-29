import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  formatEther,
  http,
  parseEther
} from "viem";
import { fundingAbi } from "./abi.js";

const chainId = Number(import.meta.env.VITE_CHAIN_ID ?? 31337);
const rpcUrl = import.meta.env.VITE_RPC_URL ?? "http://127.0.0.1:8545";
const address = import.meta.env.VITE_CONTRACT_ADDRESS;
const localChain = defineChain({
  id: chainId,
  name: "Curso local",
  nativeCurrency: { name: "Test Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [rpcUrl] } }
});
const publicClient = createPublicClient({ chain: localChain, transport: http(rpcUrl) });
let walletClient;
let account;

const byId = (id) => document.querySelector(`#${id}`);
byId("network").textContent = `Red esperada: ${chainId} · Contrato: ${address ?? "no configurado"}`;

byId("connect").addEventListener("click", async () => {
  if (!window.ethereum) return setStatus("No se encontró una wallet EIP-1193.");
  walletClient = createWalletClient({ chain: localChain, transport: custom(window.ethereum) });
  [account] = await walletClient.requestAddresses();
  byId("account").textContent = account;
});

byId("read").addEventListener("click", async () => {
  requireConfig();
  const id = BigInt(byId("campaignId").value);
  const [creator, deadline, goal, pledged, claimed] = await publicClient.readContract({
    address, abi: fundingAbi, functionName: "campaigns", args: [id]
  });
  byId("campaign").textContent = JSON.stringify({
    creator,
    deadline: new Date(Number(deadline) * 1000).toISOString(),
    goal: formatEther(goal),
    pledged: formatEther(pledged),
    claimed
  }, null, 2);
});

byId("contribute").addEventListener("click", async () => {
  requireConfig();
  if (!walletClient || !account) throw new Error("Conecta la wallet");
  const args = [BigInt(byId("campaignId").value)];
  const value = parseEther(byId("amount").value);
  setStatus("Simulando…");
  const simulation = await publicClient.simulateContract({
    account, address, abi: fundingAbi, functionName: "contribute", args, value
  });
  setStatus(`Simulación correcta. Se solicitará firma por ${formatEther(value)} ETH de prueba.`);
  const hash = await walletClient.writeContract(simulation.request);
  setStatus(`Pendiente: ${hash}`);
  await publicClient.waitForTransactionReceipt({ hash });
  setStatus(`Confirmada: ${hash}`);
});

function requireConfig() {
  if (!address || /^0x0{40}$/.test(address)) throw new Error("Configura VITE_CONTRACT_ADDRESS");
}
function setStatus(message) { byId("status").textContent = message; }
window.addEventListener("unhandledrejection", (event) => setStatus(event.reason?.shortMessage ?? event.reason?.message ?? "Error"));

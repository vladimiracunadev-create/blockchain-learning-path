export const fundingAbi = [
  {
    type: "function",
    name: "campaigns",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      { name: "creator", type: "address" },
      { name: "deadline", type: "uint64" },
      { name: "goal", type: "uint128" },
      { name: "pledged", type: "uint128" },
      { name: "claimed", type: "bool" }
    ]
  },
  {
    type: "function",
    name: "contribute",
    stateMutability: "payable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: []
  }
];

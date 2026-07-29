export function reduceFundingEvent(state, event) {
  const next = structuredClone(state);
  const id = String(event.args.id);
  next.campaigns[id] ??= { pledged: 0n, claimed: false, refunds: 0n };
  if (event.eventName === "CampaignCreated") {
    Object.assign(next.campaigns[id], {
      creator: event.args.creator,
      goal: event.args.goal,
      deadline: event.args.deadline
    });
  } else if (event.eventName === "Contributed") {
    next.campaigns[id].pledged = BigInt(next.campaigns[id].pledged) + event.args.amount;
  } else if (event.eventName === "Claimed") {
    next.campaigns[id].claimed = true;
  } else if (event.eventName === "Refunded") {
    next.campaigns[id].refunds = BigInt(next.campaigns[id].refunds) + event.args.amount;
  }
  return next;
}

export function serializeState(state) {
  return JSON.stringify(state, (_, value) => typeof value === "bigint" ? value.toString() : value, 2);
}

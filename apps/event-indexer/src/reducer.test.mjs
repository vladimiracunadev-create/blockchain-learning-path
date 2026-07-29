import test from "node:test";
import assert from "node:assert/strict";
import { reduceFundingEvent, serializeState } from "./reducer.mjs";

test("reconstruye una campaña desde eventos", () => {
  let state = { campaigns: {} };
  state = reduceFundingEvent(state, {
    eventName: "CampaignCreated",
    args: { id: 1n, creator: "0x1", goal: 10n, deadline: 100n }
  });
  state = reduceFundingEvent(state, {
    eventName: "Contributed",
    args: { id: 1n, amount: 4n }
  });
  assert.equal(state.campaigns["1"].pledged, 4n);
  assert.doesNotThrow(() => JSON.parse(serializeState(state)));
});

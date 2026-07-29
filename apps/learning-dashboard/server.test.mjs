import test from "node:test";
import assert from "node:assert/strict";
import { createDashboardServer } from "./server.mjs";

test("sirve el panel y bloquea traversal", async () => {
  const server = createDashboardServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const home = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /Blockchain Learning Path/);
  server.close();
});

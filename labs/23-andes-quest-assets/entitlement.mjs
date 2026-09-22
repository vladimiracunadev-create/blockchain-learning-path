export function reconcile({ chainOwner, linkedWallet, accountActive, licenseActive, assetAllowed, metadataAvailable }) {
  const ownsToken = chainOwner.toLowerCase() === linkedWallet.toLowerCase();
  const reasons = [];
  if (!ownsToken) reasons.push("wallet-linked-account mismatch");
  if (!accountActive) reasons.push("account suspended");
  if (!licenseActive) reasons.push("license expired");
  if (!assetAllowed) reasons.push("asset disabled by current rules");
  if (!metadataAvailable) reasons.push("metadata unavailable");
  return { ownsToken, entitlement: reasons.length === 0, reasons };
}

export function demo() {
  return reconcile({
    chainOwner: "0x00000000000000000000000000000000000000a1",
    linkedWallet: "0x00000000000000000000000000000000000000a1",
    accountActive: false,
    licenseActive: true,
    assetAllowed: true,
    metadataAvailable: true,
  });
}

if (import.meta.url === `file://${process.argv[1]?.replaceAll("\\", "/")}`) {
  console.log(JSON.stringify(demo(), null, 2));
}

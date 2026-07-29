import { generateKeyPairSync, sign, verify } from "node:crypto";

export function signMessage(message) {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const signature = sign(null, Buffer.from(message), privateKey);
  return {
    publicKey,
    signature,
    verify: (candidate) => verify(null, Buffer.from(candidate), publicKey, signature)
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const signed = signMessage("Autorizo la práctica local");
  console.log("Mensaje original:", signed.verify("Autorizo la práctica local"));
  console.log("Mensaje alterado:", signed.verify("Autorizo otra operación"));
  console.log("La firma autentica una clave, no una identidad legal.");
}

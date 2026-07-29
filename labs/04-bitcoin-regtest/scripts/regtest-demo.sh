#!/usr/bin/env bash
set -euo pipefail

btc=(bitcoin-cli -regtest -rpcuser=student -rpcpassword=studentpass -rpcwallet=course)
address="$("${btc[@]}" getnewaddress "practica")"
"${btc[@]}" generatetoaddress 1 "$address" >/dev/null
echo "Altura: $("${btc[@]}" getblockcount)"
echo "Dirección local: $address"
echo "Balance regtest: $("${btc[@]}" getbalance)"

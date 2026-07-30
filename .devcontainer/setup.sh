#!/usr/bin/env bash
# Prepara el entorno del curso en Codespaces o Dev Containers:
# Node + pnpm (vía corepack), dependencias del monorepo y Foundry (forge/anvil/cast).
set -euo pipefail

echo "▶ Habilitando pnpm con corepack…"
corepack enable
corepack prepare pnpm@10.13.1 --activate

echo "▶ Instalando dependencias del monorepo…"
pnpm install

echo "▶ Instalando Foundry (forge, anvil, cast)…"
curl -L https://foundry.paradigm.xyz | bash
export PATH="$PATH:$HOME/.foundry/bin"
foundryup

if ! grep -q 'foundry/bin' "$HOME/.bashrc" 2>/dev/null; then
  echo 'export PATH="$PATH:$HOME/.foundry/bin"' >> "$HOME/.bashrc"
fi

echo "✅ Entorno listo. Prueba: pnpm check · pnpm test · pnpm lab:hash · forge --version"

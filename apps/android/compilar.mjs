#!/usr/bin/env node
// Ejecuta el wrapper de Gradle correcto en Windows, Linux y macOS. Mantener esta
// decisión en JavaScript evita que el comando local diverja del usado en CI.

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const android = join(root, "android");
const wrapper = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const result = spawnSync(wrapper, ["assembleDebug", "--no-daemon"], {
  cwd: android,
  stdio: "inherit",
  shell: process.platform === "win32"
});

process.exit(result.status ?? 1);

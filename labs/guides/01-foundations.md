# Guías 01–10 · Fundamentos

Cada práctica exige bitácora con hipótesis, procedimiento, resultado, explicación y límite.

## 01 · Blockchain o base tradicional

- **Objetivo:** justificar arquitectura.
- **Actividad:** aplica ADR 001 a salud, puntos internos y pagos internacionales.
- **Evidencia:** tres matrices y una decisión por caso.
- **Aceptación:** incluye autoridad, escritores, privacidad, corrección, costo y salida.

## 02 · Historia anotada

- **Objetivo:** relacionar avances y problemas.
- **Actividad:** línea temporal desde firmas digitales y dinero electrónico hasta Bitcoin, Ethereum y rollups.
- **Evidencia:** diez hitos con fuente primaria.
- **Aceptación:** cada hito explica qué problema anterior aborda.

## 03 · Propiedades de SHA-256

- **Objetivo:** observar determinismo y avalancha.
- **Actividad:** calcula hashes de mensajes que difieren en un bit.
- **Evidencia:** tabla de entradas, hashes y bits distintos.
- **Aceptación:** diferencia integridad, contraseña y cifrado.

## 04 · Cadena de hashes

- **Comando:** `pnpm lab:hash`.
- **Reto:** altera un registro y luego recalcula solo su hash.
- **Aceptación:** explica por qué los registros posteriores lo detectan.

## 05 · Árbol de Merkle

- **Comando:** `pnpm lab:merkle`.
- **Reto:** compara raíz con 3, 4 y 5 hojas.
- **Aceptación:** explica la duplicación de hoja impar en esta implementación.

## 06 · Prueba Merkle

- **Prueba:** `node --test labs/01-cryptography/merkle-proof.test.mjs`.
- **Reto:** prueba inclusión de la primera y última hoja.
- **Aceptación:** identifica qué información no demuestra la prueba.

## 07 · Firma digital

- **Comando:** `node labs/01-cryptography/digital-signature.mjs`.
- **Reto:** cambia mensaje, firma y clave pública por separado.
- **Aceptación:** distingue clave, control de clave e identidad legal.

## 08 · Custodia de claves

- **Actividad:** modela wallet móvil, hardware wallet y multisig.
- **Evidencia:** activos, amenazas, controles y recuperación.
- **Aceptación:** incluye pérdida, phishing, malware y coerción.

## 09 · Propagación P2P

- **Actividad:** representa cinco nodos y entrega mensajes con latencias distintas.
- **Evidencia:** orden observado y estado de cada nodo.
- **Aceptación:** diferencia propagación de consenso.

## 10 · Partición

- **Actividad:** divide la red 3/2, produce propuestas y reconcilia.
- **Evidencia:** decisión sobre seguridad y vivacidad.
- **Aceptación:** explica cuándo una rama puede descartarse.

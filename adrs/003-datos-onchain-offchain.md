# ADR-003 · ¿Qué datos van on-chain y cuáles off-chain?

> **Estado:** guía educativa · **Ámbito:** arquitectura de datos · [⬅️ Índice de ADRs](README.md)

## Contexto

Guardar datos on-chain es lo más caro que puede hacer un contrato: cada byte de storage se replica en todos los nodos para siempre. Además, lo escrito en una red pública es efectivamente imposible de borrar, lo que choca de frente con normativas como el GDPR y su derecho al olvido. La regla general del programa: **on-chain va solo lo que otros contratos deben verificar o lo que requiere disponibilidad consensuada; todo lo demás vive fuera, con un compromiso (hash) en la cadena si hace falta integridad.**

Conviene recordar qué prueba cada cosa: un hash on-chain prueba *integridad* (que el dato no cambió), no *disponibilidad* (que alguien lo siga sirviendo) ni *veracidad* (que fuera cierto al registrarse). Desde EIP-4844 (2024), Ethereum ofrece además *blobs*: datos temporales baratos pensados para rollups, que expiran en unas semanas y no son storage permanente.

## Opciones

| Criterio | Storage on-chain | Eventos on-chain | Blobs (EIP-4844) | IPFS / Arweave | BD tradicional |
| --- | --- | --- | --- | --- | --- |
| Legible por contratos | Sí | No | No | No | No |
| Permanencia | Perpetua | Perpetua en nodos de archivo | Semanas | Depende de pinning / dotación | Bajo tu control |
| Costo | Muy alto | Bajo | Muy bajo | Bajo | Mínimo |
| Borrable (GDPR) | No | No | Expira solo | Difícil | Sí |
| Uso típico | Balances, permisos, hashes | Historial para indexadores | Datos de rollups | Metadatos, imágenes, documentos | PII, datos mutables |

## Criterios de decisión

Tabla de referencia dato → dónde → por qué:

| Dato | Dónde | Por qué |
| --- | --- | --- |
| Saldos, propiedad, permisos | Storage on-chain | Otros contratos lo verifican en cada transacción |
| Hash o raíz Merkle de un documento | Storage on-chain | Compromiso de integridad barato y verificable |
| Historial de operaciones | Eventos | Los indexadores (The Graph, etc.) lo reconstruyen sin costo de storage |
| Contenido (imágenes, JSON, documentos) | IPFS o Arweave | Direccionado por contenido; la cadena guarda solo el CID |
| Datos personales (PII) | BD tradicional, jamás on-chain | Derecho al olvido: lo inmutable es incompatible con lo borrable |
| Datos de disponibilidad de un rollup | Blobs | Baratos y suficientes: solo se necesitan durante la ventana de disputa |

Preguntas que inclinan la balanza:

- ¿Algún **contrato** necesita leer este dato para tomar decisiones? Si no, no va a storage.
- ¿El dato identifica, directa o indirectamente, a una **persona**? Entonces jamás on-chain, ni siquiera cifrado (el cifrado se rompe con el tiempo; la cadena no olvida).
- ¿Basta con probar **integridad**? Publica el hash y guarda el dato donde puedas gobernarlo.
- ¿Quién garantiza la **disponibilidad** off-chain y qué pasa si desaparece?

## Decisión educativa

El programa enseña a diseñar con **minimalismo on-chain**: estado verificable y compromisos en la cadena, eventos para el historial, IPFS/Arweave para contenido y bases tradicionales para todo dato personal o mutable. El GDPR se trata como criterio duro, no negociable: ninguna PII toca la cadena en ningún ejercicio.

## Consecuencias

Positivas:

- Costos de gas órdenes de magnitud menores y contratos más simples de auditar.
- Cumplimiento normativo posible por diseño, no como parche posterior.

Negativas:

- La arquitectura se fragmenta: hay que operar y monitorear la capa off-chain (pinning, índices, backups).
- La verdad "completa" ya no vive en un solo lugar; la disponibilidad off-chain es un riesgo que se gestiona, no que desaparece.

## Señales para reconsiderar

- Cambios regulatorios que redefinan qué cuenta como dato personal (por ejemplo, direcciones de wallet vinculables).
- Abaratamiento drástico del storage on-chain o nuevas capas de disponibilidad de datos (el costo real: consúltalo en vivo).
- Que un contrato nuevo necesite verificar datos que hoy están solo en eventos: habría que promoverlos a storage.

## Referencias

- EIP-4844, *Shard Blob Transactions*: <https://eips.ethereum.org/EIPS/eip-4844>
- EDPB, directrices sobre blockchain y GDPR: <https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2025/guidelines-022025-processing-personal-data_en>
- Documentación de IPFS: <https://docs.ipfs.tech/>
- Arweave: <https://www.arweave.org/>

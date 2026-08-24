# 🗺️ Roadmap de 26 semanas

> [⬅️ Volver al programa](README.md) · [📚 Currículo](curriculum/README.md) · [🧪 Laboratorios](labs/CATALOG.md)

Dedica entre 6 y 10 horas semanales. Cada bloque termina con una evidencia verificable.

| Semanas | Contenido | Evidencia |
|---|---|---|
| 1–2 | Orientación, historia y casos de uso | Matriz blockchain vs. BD |
| 3–4 | Hashes, firmas, Merkle trees | Laboratorio de integridad |
| 5–6 | Bloques, P2P y consenso | Mini blockchain documentada |
| 7–8 | Bitcoin y UTXO, y la unidad transversal [Wallets desde cero](docs/wallets-desde-cero.md) | Análisis de transacciones + prevuelo de una transacción (práctica 71) |
| 9–10 | Ethereum, EVM, gas y ABI | Lectura de estado con viem |
| 11–13 | Solidity y Foundry | Contratos con pruebas |
| 14–15 | dApp y gestión de wallets | Interfaz local/testnet |
| 16–17 | Tokens y estándares | Token con modelo de amenazas |
| 18–19 | Seguridad y auditoría | Informe de hallazgos |
| 20 | Oráculos e indexación | Diseño de datos externos |
| 21 | DAO y gobernanza | Propuesta y simulación |
| 22 | L2, puentes e interoperabilidad | Comparación arquitectónica |
| 23 | Privacidad, ZK y tokenomics | Documento de decisiones |
| 24 | Infraestructura y nodos (módulo 16) | Topología y presupuesto de despliegue |
| 25 | Empresa e implementación (módulos 17–18) | Caso de negocio y documento de arquitectura |
| 26 | Proyecto final | Demo, pruebas y defensa |

## Extensión: finanzas on-chain e institucional (semanas 27–34)

La etapa que lleva del token al sistema financiero. Se puede cursar seguida del roadmap
principal o de forma independiente por quien ya domine la parte técnica.

| Semanas | Contenido | Evidencia |
|---|---|---|
| 27 | DeFi: AMM, préstamo y riesgo (módulo 19) | Ficha de riesgo de un protocolo real |
| 28 | Dinero, banca y liquidación (módulo 20) | Informe «Qué se mueve cuando pago» |
| 29 | Stablecoins (módulo 21) | Ficha comparada de dos emisores |
| 30 | Depósitos tokenizados y CBDC/MDBC (módulo 22) | Documento de opciones de diseño |
| 31 | Pagos, cross-border y FX on-chain (módulo 23) | Análisis de un corredor de pagos |
| 32 | Tokenización y RWA (módulo 24) | Memorando de tokenización |
| 33 | Mercados de capitales on-chain (módulo 25) | Arquitectura de un mercado de bonos |
| 34 | Custodia, identidad y regulación (módulos 26–27) | Política de custodia y análisis regulatorio |
| 35–36 | Blockchain Data Analytics y minería de datos on-chain (módulo 28) | Explorador analítico con informe, métricas de detección y límites declarados |

## Criterios para avanzar

- Puedes explicar el tema sin recurrir a definiciones memorizadas.
- El laboratorio funciona y sus resultados están registrados.
- Conoces al menos un fallo o limitación del enfoque.
- Las pruebas automatizadas pasan.
- Ningún secreto está guardado en el repositorio.

## Evolución del producto educativo

| Versión | Alcance | Estado |
|---|---|---|
| 0.1.0 | currículo de 16 módulos, 50 prácticas, contratos Foundry, dApp, indexador, seguridad, evaluaciones y landing | completada |
| 0.2.0 | sección de industria (construcción, stack, equipos, empresas, modelos de negocio, ciclo de vida), esquemas Mermaid y profundización en los 16 módulos | completada |
| 0.3.0 | etapa de producción del currículo: módulos 16 (infraestructura y nodos), 17 (empresa: valor, casos, costos y cómo explicarlo) y 18 (implementación end-to-end) | completada |
| 0.3.1 | resolución explicada de las 50 prácticas y barrido de calidad | completada |
| 0.4.0 | sitio navegable en GitHub Pages con menú lateral, Mermaid y tema claro/oscuro | completada |
| 0.5.0 | manual del usuario en PDF (~310 páginas) con todo el curso | completada |
| 0.6.0 | CI reforzada, Codespaces, buscador, progreso y autoevaluación global en el sitio | completada |
| 0.7.0 | autoevaluación por módulo (19 quizzes), app de escritorio para Windows y app Android, ambas offline; enlaces externos vigilados y lint de código | completada |
| 0.8.0 | profundización de los 19 módulos (11 900 → 24 218 palabras) en cuatro capas para principiante y experto, guía «Empieza aquí», glosario enlazado en todos los módulos y 31 de 50 prácticas auto-verificadas | completada |
| 0.8.1 | manual en PDF con la guía de entrada incluida (341 páginas) y cifras del manual verificadas en CI | completada |
| 0.9.0 | etapa de finanzas on-chain e institucional: 9 módulos nuevos (19–27) sobre DeFi, dinero y liquidación, stablecoins, depósitos tokenizados y MDBC, pagos y FX, tokenización y RWA, mercados de capitales, custodia e identidad y regulación; 20 prácticas nuevas, laboratorio de mercado tokenizado en Solidity, carpeta `regulation/`, casos reales y auditoría del programa | completada |
| 0.9.1 | unidad transversal [Wallets desde cero](docs/wallets-desde-cero.md) (uso, seguridad y recuperación) entre los módulos 04 y 05, con la práctica 71 «Prevuelo de una transacción» (`pnpm lab:wallet-segura`, 10 pruebas) integrada en catálogo, guías, sitio, manual y apps | completada |
| 0.10.0 | módulo 28 «Blockchain Data Analytics y minería de datos on-chain» en cuatro niveles (fundamentos, adquisición y preparación, análisis on-chain y avanzado), doce prácticas nuevas (72–83) sobre una cadena sintética determinista con verdad de campo, y el proyecto final «Explorador analítico de actividad blockchain» | actual |
| 1.0.0 | programa completo estabilizado: contenido congelado, binarios firmados y manual versionado por release | planificada |
| 2.0.0 | LMS multiusuario, sandbox remoto y analítica docente | futuro |

La versión actual funciona localmente y mantiene los ejercicios peligrosos aislados (Anvil o testnet). Las versiones futuras requieren infraestructura, identidad y decisiones institucionales que no deben simularse dentro del repositorio.

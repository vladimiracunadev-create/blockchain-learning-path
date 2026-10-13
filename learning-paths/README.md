# 🧭 Rutas de aprendizaje por rol profesional

> [⬅️ Programa](../README.md) · [Matriz de trazabilidad](TRACEABILITY.md) · [Inventario de cargos](ROLE_INVENTORY.md)

Esta capa orienta el currículo común de 66 clases y 91 prácticas hacia funciones profesionales verificables. No duplica recursos ni crea credenciales: cada ruta selecciona clases, laboratorios, evidencias y un proyecto integrador ya compatibles con la arquitectura del repositorio.

## Cómo usar las rutas

1. Completa los prerrequisitos y el tronco común indicado por la ficha.
2. Elige una familia y abre la ruta canónica que reúne cargos cercanos.
3. Recorre clases obligatorias, prácticas esenciales y recursos complementarios.
4. Conserva evidencias reproducibles y somételas a los métodos de evaluación descritos.
5. Entrega el proyecto integrador y declara explícitamente riesgos y límites.

## Familias profesionales e índice de roles

### Desarrollo

- [Desarrollador/a de contratos inteligentes y dApps](roles/desarrollador-contratos-dapps.md) — Smart Contract Developer / Blockchain Developer.

### Arquitectura e ingeniería

- [Arquitecto/a blockchain e integración](roles/arquitecto-integracion.md) — Blockchain Architect / Blockchain Integration Engineer.
- [Ingeniero/a de protocolos, interoperabilidad y ZK](roles/ingeniero-protocolo-zk.md) — Protocol Engineer / Distributed Systems Engineer.

### Infraestructura y operaciones

- [Ingeniero/a de plataforma blockchain, SRE y validadores](roles/plataforma-sre-validadores.md) — Blockchain SRE / Blockchain DevOps Engineer.

### Seguridad

- [Auditor/a de seguridad de contratos y protocolos](roles/auditor-seguridad-contratos.md) — Smart Contract Security Auditor / Blockchain Security Engineer.
- [Analista de forensics e incidentes de activos digitales](roles/forensics-incidentes-activos-digitales.md) — Blockchain Forensics Analyst / Blockchain Incident Response Specialist.

### Finanzas digitales

- [Ingeniero/a y analista de riesgo DeFi](roles/defi-riesgo.md) — DeFi Engineer / DeFi Risk Analyst.
- [Especialista en tokenización, pagos, custodia y conciliación](roles/tokenizacion-pagos-custodia.md) — Tokenization Specialist / Blockchain Payments Specialist.

### Gobernanza

- [Especialista en gobernanza y operaciones DAO](roles/gobernanza-dao-tesoreria.md) — DAO Governance Specialist / DAO Operations Manager.

### Cumplimiento

- [Especialista en cumplimiento, regulación y riesgo de activos digitales](roles/cumplimiento-regulacion-aml.md) — Blockchain Compliance Analyst / Crypto AML Analyst.

### Producto, gestión y consultoría

- [Especialista en producto, proyecto y consultoría blockchain](roles/producto-proyecto-consultoria.md) — Web3 Product Manager / Blockchain Project Manager.

### Investigación e IA aplicada

- [Especialista en datos on-chain, investigación e IA asistida](roles/datos-investigacion-ia.md) — On-chain Data Analyst / Blockchain Analytics Engineer.

### Educación

- [Instructor/a técnico y diseñador/a curricular blockchain](roles/educacion-blockchain.md) — Blockchain Technical Instructor / Blockchain Curriculum Designer.

## Requisitos previos

Todas las rutas parten de programación y herramientas básicas acordes a su especialidad, manejo seguro de claves de prueba y comprensión del tronco común. La ficha concreta qué clases completar primero. No se requieren fondos reales, mainnet ni credenciales de producción.

## Niveles de competencia

| Nivel | Alcance |
|---|---|
| Fundamental | Comprende conceptos, vocabulario, principios y limitaciones. |
| Aplicado | Ejecuta procedimientos guiados y explica resultados. |
| Autónomo | Resuelve problemas sin depender de instrucciones paso a paso. |
| Avanzado | Diseña, compara, diagnostica y optimiza soluciones complejas. |
| Profesional integrador | Entrega un proyecto verificable, defiende decisiones y reconoce riesgos y límites. |

Los niveles miden evidencia educativa; no conceden seniority, experiencia laboral ni autorización profesional.

## Clases, laboratorios y proyectos de portafolio

La [matriz profesional de trazabilidad](TRACEABILITY.md) conecta **rol → competencia → clase → laboratorio → evidencia → evaluación**. Una clase o práctica puede servir a varias rutas sin copiarse. Cada ficha culmina con un proyecto de portafolio, criterios de aceptación, evidencia reproducible, evaluación y límites éticos.

## Alcance y empleabilidad

Completar una ruta es capacitación y puede demostrar competencias mediante evidencias; no constituye certificación oficial, licencia, promesa de empleo ni experiencia laboral real. La selección profesional depende además del contexto, la evaluación independiente, la experiencia y los requisitos legales de cada organización y jurisdicción.

## Fuente canónica y mantenimiento

Las relaciones estructuradas viven en [roles.json](roles.json). Las fichas, este índice y las matrices se generan con `pnpm build:paths` y se verifican con `pnpm check`. Última revisión: **2026-10-12**.

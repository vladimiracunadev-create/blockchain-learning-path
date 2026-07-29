# 15 · Arquitectura avanzada

> **Nivel:** Avanzado · ⏱️ **Duración estimada:** 180 min · **Fuente:** ERC-4337 / EIP-7702 (abstracción de cuenta) e investigación de Flashbots (MEV)
> [⬅️ Currículo](../README.md) · [📚 Bibliografía](../../docs/bibliografia.md)

---

## 🎯 Objetivos

- Integrar la abstracción de cuenta con ERC-4337 (UserOperations, bundlers, paymasters) y EIP-7702 para EOAs en Pectra (2025).
- Diseñar sistemas actualizables con patrones proxy (UUPS, Transparent) cuidando el storage layout y sus riesgos.
- Analizar el MEV (front-running, sandwich) y las respuestas de mercado como PBS y mev-boost.
- Redactar un documento de arquitectura que cubra amenazas, invariantes, costos, gobernanza, privacidad, legalidad y operación.
- Argumentar cuándo la decisión más madura es reducir o eliminar componentes blockchain.

## 📚 Resultados de aprendizaje

Al finalizar, el estudiante podrá:

1. **Explicar** el flujo de una UserOperation en ERC-4337 y en qué se diferencia de EIP-7702.
2. **Diseñar** un contrato actualizable seguro justificando el patrón proxy y el storage layout.
3. **Identificar** vectores de MEV en un flujo de usuario y proponer mitigaciones.
4. **Elaborar** un documento de arquitectura con activos, actores, amenazas e invariantes explícitos.
5. **Evaluar** tokenomics de un diseño con un simulador de suministro y contrastarlo con sus objetivos.
6. **Decidir** con criterio cuándo una alternativa no-blockchain resuelve mejor el problema.

## 🗺️ Temas

| # | Tema | Por qué importa |
|---|------|-----------------|
| 1 | ERC-4337 (UserOps, bundlers, paymasters) | Habilita cuentas programables y patrocinio de gas sin cambiar el protocolo |
| 2 | EIP-7702 (EOAs con código en Pectra) | Da capacidades de smart account a cuentas existentes desde 2025 |
| 3 | Proxies y upgrades (UUPS, Transparent) | Permiten evolucionar contratos; un error de storage puede corromper el estado |
| 4 | MEV: front-running y sandwich | El orden de las transacciones es un activo que se explota |
| 5 | PBS y mev-boost | Separan proponer de construir bloques para acotar el poder del validador |
| 6 | Tokenomics y economía de mecanismos | Alinea incentivos; un mal diseño rompe el sistema aunque el código sea correcto |
| 7 | Observabilidad y respuesta a incidentes | Sin monitoreo no hay detección ni contención de un fallo |
| 8 | Cumplimiento y decisión de no usar blockchain | La madurez incluye reconocer cuándo blockchain no aporta |

## 🧠 Modelo mental

Piensa en la arquitectura avanzada como el plano de un edificio, no como el ladrillo. La abstracción de cuenta cambia las cerraduras (quién puede firmar y cómo se paga la entrada), los proxies son las reformas que permiten cambiar habitaciones sin demoler la estructura, y el MEV es el portero que decide en qué orden entran los visitantes y puede cobrar por adelantar a unos frente a otros. El documento de arquitectura es la memoria del proyecto: qué se construye, para quién, con qué riesgos y qué se hace cuando algo falla.

La analogía se queda corta en un punto esencial: a diferencia de un edificio, aquí muchas veces la mejor decisión de diseño es construir menos. Añadir un componente blockchain introduce costes, superficie de ataque y rigidez de actualización; la madurez técnica se demuestra sabiendo cuándo una base de datos, una firma o un servicio convencional resuelven el problema con menos riesgo. El plano correcto puede ser el que retira ladrillos.

## 📖 Conceptos y definiciones

- **Abstracción de cuenta**: capacidad de que la lógica de validación de una cuenta sea programable, en lugar de fija como en una EOA clásica.
- **UserOperation**: intención firmada que un bundler empaqueta y envía en ERC-4337, procesada por un contrato EntryPoint.
- **Paymaster**: contrato que puede patrocinar el gas de una UserOperation, habilitando pagos en tokens o gas gratuito condicionado.
- **EIP-7702**: mecanismo de Pectra (2025) que permite a una EOA delegar en código de contrato, acercándola a una smart account.
- **Proxy UUPS/Transparent**: patrón que separa lógica y almacenamiento para permitir upgrades; exige preservar el storage layout.
- **MEV**: valor extraíble por reordenar, insertar o censurar transacciones dentro de un bloque; incluye front-running y sandwich.
- **PBS (proposer-builder separation)**: separación entre quien propone el bloque y quien lo construye, para limitar la extracción de MEV.
- **mev-boost**: software que implementa un mercado de construcción de bloques externo para validadores de Ethereum.
- **Invariante**: propiedad que el sistema debe cumplir siempre (por ejemplo "el suministro total nunca disminuye salvo por quema").
- **Tokenomics**: diseño económico del token (emisión, distribución, incentivos) que determina la sostenibilidad del sistema.

## 🧪 Laboratorio guiado

Ejecuta el simulador de suministro para la parte de tokenomics y luego integra los hallazgos en el documento de arquitectura. El proyecto integrador vive en `capstone` y en `projects/community-funding`.

1. Lanza el simulador de tokenomics y registra las curvas de emisión y suministro resultantes.

```bash
pnpm lab:tokenomics
```

2. Varía los parámetros de emisión y observa el efecto sobre el suministro total y los incentivos.
3. Documenta el patrón de upgrade elegido (UUPS o Transparent) y verifica que el storage layout se preserva entre versiones.
4. Traza el flujo de una UserOperation (ERC-4337) y contrasta el modelo con una delegación EIP-7702 desde una EOA.
5. Analiza dónde aparece MEV en el flujo de usuario y qué mitigación aplicarías (por ejemplo envío privado o subasta de bloques).

## 📝 Reto verificable

Entrega un documento de arquitectura del proyecto integrador que incluya: problema y usuarios, decisión blockchain vs. alternativas, componentes y límites de confianza, activos/actores/amenazas, invariantes, costos y escalabilidad, administración y gobernanza, privacidad y aspectos legales, y pruebas/despliegue/monitoreo/retiro.

**Criterio de aceptación:** el documento contiene las nueve secciones citadas, define al menos tres invariantes verificables, justifica explícitamente la decisión de usar (o no) blockchain frente a alternativas, y adjunta los resultados del simulador `pnpm lab:tokenomics` que respaldan el diseño económico.

## ⚠️ Errores frecuentes

| Síntoma | Causa y cómo comprobarlo |
|---------|--------------------------|
| Upgrade que corrompe el estado | Cambio en el storage layout; compara las variables de almacenamiento entre versiones |
| Confundir ERC-4337 con EIP-7702 | Uno usa UserOps vía EntryPoint, el otro delega desde una EOA; revisa el flujo de cada uno |
| Ignorar el MEV en el diseño | Se asume orden neutral; simula un sandwich sobre el flujo de swap |
| Paymaster sin límites | Patrocinio ilimitado se explota; verifica cuotas y validación del paymaster |
| Tokenomics sin invariantes | El incentivo se rompe silenciosamente; define y prueba invariantes de suministro |
| Usar blockchain por defecto | No se evaluó la alternativa; documenta por qué una base de datos no bastaba |

## 🛡️ Seguridad y ética

- Trabaja en local o testnet; no despliegues con fondos reales ni utilices claves privadas reales en el laboratorio.
- No incluyas datos personales reales en el documento de arquitectura ni en el simulador.
- Declara los límites de confianza y las claves administrativas; ocultar un poder de upgrade es una omisión ética.
- Reconoce el impacto del MEV en los usuarios y prioriza diseños que reduzcan la extracción a su costa.
- Considera el cumplimiento legal y la privacidad desde el diseño, no como un añadido posterior.

## 🔗 Referencias

- ERC-4337, Account Abstraction Using Alt Mempool — <https://eips.ethereum.org/EIPS/eip-4337>
- EIP-7702, Set EOA account code (Pectra) — <https://eips.ethereum.org/EIPS/eip-7702>
- Flashbots, investigación sobre MEV — <https://writings.flashbots.net/>
- OpenZeppelin, Upgrades Plugins — <https://docs.openzeppelin.com/upgrades-plugins/>
- Voshmgir, S., *Token Economy* — <https://tokeneconomy.co/>
- Fuente primaria: Daian et al., *Flash Boys 2.0* — <https://arxiv.org/abs/1904.05234>

## ✅ Criterio de dominio

- Explicas el flujo de ERC-4337 y su diferencia con EIP-7702 sin apoyo.
- Diseñas un upgrade seguro razonando el storage layout y el patrón proxy elegido.
- Produces un documento de arquitectura con invariantes verificables y una decisión justificada sobre usar o no blockchain.

---

## 🧭 Navegación

⬅️ [Módulo 14 · Privacidad y zero knowledge](../14-privacidad-zk/README.md) · [📚 Índice del currículo](../README.md)

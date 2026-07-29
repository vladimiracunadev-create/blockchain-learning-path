# Registros de decisiones de arquitectura (ADRs)

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md)

## ¿Qué es un ADR?

Un ADR (*Architecture Decision Record*) es un documento breve que captura **una** decisión de arquitectura: el contexto que la provocó, las opciones evaluadas, la elección tomada, sus consecuencias y las señales que obligarían a reconsiderarla. No es documentación exhaustiva: es la memoria de *por qué* el sistema es como es.

## ¿Por qué esta industria los usa tanto?

En el ecosistema blockchain los ADRs pesan más que en el software tradicional por dos razones:

- **Coordinación asíncrona y distribuida.** Los equipos de protocolos y DAOs trabajan repartidos por el mundo, muchas veces sin empresa central. Un ADR permite que cualquiera entienda una decisión sin asistir a la reunión donde se tomó (los EIPs de Ethereum y los ADRs del Cosmos SDK siguen esta lógica).
- **Código inmutable o carísimo de cambiar.** Un contrato desplegado no se parchea con un `git push`. Cuando revertir cuesta millones o es directamente imposible, documentar la decisión *antes* de ejecutarla deja de ser burocracia y pasa a ser gestión de riesgo.

## Los 6 ADRs del programa

Cada ADR modela una decisión recurrente al diseñar un sistema con (o sin) blockchain. Son **guías educativas**: muestran cómo razonar, no imponen una respuesta única.

| ADR | Pregunta que responde | Decisión por defecto del programa |
| --- | --- | --- |
| [001 · Blockchain vs. base de datos](001-blockchain-vs-database.md) | ¿Este problema necesita blockchain o basta una base de datos? | Base de datos, salvo que se cumplan criterios estrictos |
| [002 · Pública vs. permisionada](002-publica-vs-permisionada.md) | Si hay blockchain, ¿red pública o de consorcio? | Pública (L2) con privacidad selectiva |
| [003 · Datos on-chain vs. off-chain](003-datos-onchain-offchain.md) | ¿Qué datos van a la cadena y cuáles fuera? | On-chain solo lo que otros contratos verifican; PII jamás |
| [004 · Inmutabilidad vs. upgrades](004-inmutabilidad-upgrades.md) | ¿Contrato inmutable o actualizable? | Inmutable con *guarded launch*; UUPS + timelock si el dominio lo exige |
| [005 · L1, L2 o appchain](005-l1-l2-appchain.md) | ¿Dónde desplegar: L1, rollup general o cadena propia? | L2 rollup de propósito general |
| [006 · Token propio](006-token-propio.md) | ¿Emitir un token o usar activos existentes? | No emitir token salvo mecanismo de valor claro |

## Cómo escribir tu propio ADR

Plantilla resumida en 6 puntos:

1. **Título y estado.** Un número secuencial, un título en forma de decisión y un estado (`propuesto`, `aceptado`, `reemplazado por ADR-NNN`).
2. **Contexto.** El problema real y las restricciones (técnicas, regulatorias, de negocio) en 1-2 párrafos. Sin contexto, la decisión parece arbitraria en seis meses.
3. **Opciones.** Al menos dos alternativas reales, comparadas con los mismos criterios. Si solo hay una opción, no hay decisión que registrar.
4. **Decisión.** Qué se elige y el razonamiento que inclinó la balanza. Una frase clara, no un ensayo.
5. **Consecuencias.** Lo bueno *y* lo malo que se acepta. Un ADR sin consecuencias negativas es marketing, no ingeniería.
6. **Señales para reconsiderar.** Qué cambio del entorno (costos, regulación, madurez tecnológica) invalidaría la decisión. Esto convierte el ADR en un documento vivo.

Para profundizar, consulta la [bibliografía del programa](../docs/bibliografia.md).

# Cuaderno de prácticas

El cuaderno de laboratorios reúne las **50 prácticas** del programa, organizadas en **5 cuadernos por etapa** que acompañan el avance por los 19 módulos del currículo. Cada guía especifica objetivo, evidencia y aceptación; el detalle operativo de cada laboratorio (comandos, archivos, dependencias) está en el [catálogo](../CATALOG.md).

## Los cinco cuadernos

| Cuaderno | Prácticas | Módulos que acompaña |
|---|---|---|
| [Fundamentos](01-foundations.md) | 01–10 | 00–03 (orientación, criptografía, distribuidos, consenso) |
| [Consenso y Bitcoin](02-consensus-bitcoin.md) | 11–20 | 03–04 (consenso aplicado y Bitcoin) |
| [EVM y desarrollo](03-evm-development.md) | 21–30 | 05–07 (EVM, Solidity/Foundry, dApps) |
| [Profesional y seguridad](04-professional-security.md) | 31–40 | 08–11 (tokens, seguridad, oráculos, DAO) |
| [Avanzado y capstone](05-advanced-capstone.md) | 41–50 | 12–18 y proyecto final |

## Qué contiene cada guía

Cada práctica dentro de un cuaderno sigue la misma estructura:

- **Objetivo:** qué concepto o habilidad demuestra la práctica.
- **Comando o procedimiento:** cómo ejecutarla, con el laboratorio correspondiente del catálogo.
- **Evidencia:** qué debes registrar en tu bitácora.
- **Aceptación:** el criterio binario que decide si la práctica está completa.

## Cómo trabajar una práctica

1. **Lee primero los criterios de aceptación** de la guía: definen qué evidencia se espera antes de que ejecutes nada.
2. **Formula una hipótesis** de lo que va a ocurrir; ejecutar sin predicción es mirar, no experimentar.
3. **Ejecuta** el laboratorio siguiendo el comando indicado en la guía o en el catálogo.
4. **Registra la evidencia en tu bitácora**: comando exacto, resultado resumido, qué te sorprendió y qué pregunta te queda abierta.
5. Marca la práctica en tu `progress.json` solo cuando la evidencia sea reproducible.

```mermaid
flowchart LR
  A["Leer aceptación"] --> B["Formular hipótesis"]
  B --> C["Ejecutar laboratorio"]
  C --> D["Registrar evidencia"]
  D --> E["Marcar en progress.json"]
```

## Convención de evidencia

- Cada práctica exige una entrada de bitácora con hipótesis, procedimiento, resultado, explicación y límite de lo demostrado.
- La evidencia debe ser verificable por otra persona: rutas a código, salidas de pruebas, txid locales o documentos, nunca capturas sin contexto.
- Nunca incluyas claves, seeds ni endpoints privados en la evidencia, ni siquiera de testnet.

## Evaluación

El instructor evalúa con los criterios de `docs/evaluacion.md`; las respuestas conceptuales orientativas están en `solutions/conceptual-guide.md`, que da criterios de revisión, no soluciones para copiar. Las prácticas se articulan con los módulos del [currículo](../../curriculum/README.md).

## Navegación

- [Catálogo de laboratorios](../CATALOG.md)
- [Currículo completo](../../curriculum/README.md)
- [Inicio del programa](../../README.md)

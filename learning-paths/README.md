# Rutas por perfil profesional

Todas las rutas parten del tronco común 00–05 (orientación, criptografía, sistemas distribuidos, consenso, Bitcoin y EVM). A partir de ahí, cada perfil prioriza módulos, laboratorios y un entregable de portafolio distinto. Elige la ruta que mejor describa el rol al que apuntas; puedes cambiar de ruta sin perder avance, porque el registro de progreso es el mismo.

```mermaid
flowchart TD
  T["Tronco común 00-05"] --> D["Desarrollo"]
  T --> A["Arquitectura"]
  T --> S["Auditoría y seguridad"]
  T --> P["Producto y negocio"]
  T --> I["Investigación"]
  T --> E["Empresa y consultoría"]
  D --> C["Capstone y portafolio"]
  A --> C
  S --> C
  P --> C
  I --> C
  E --> C
```

## Resumen de las seis rutas

| Perfil | Módulos prioritarios | Laboratorios clave | Entregable de portafolio | Salida laboral típica |
|---|---|---|---|---|
| Desarrollo | 06–10, 12 | 21–30, 31–35 | dApp integral probada con Foundry | Smart contract / full-stack Web3 developer |
| Arquitectura | 02–05, 10–16 | 01–10, 41–46 | ADR de plataforma con trade-offs | Arquitecto de soluciones blockchain |
| Auditoría y seguridad | 05–09, 11, 15 | 31–40, 41–45 | Informe de seguridad estilo auditoría | Auditor de contratos / security researcher |
| Producto y negocio | 00, 04, 07–08, 11–15, 17–18 | 01–05, 11–15 | Validación de caso y tokenomics | Product manager / analista Web3 |
| Investigación | 01–03, 12–15 | 01–10, 41–48 | Réplica comentada de un paper | Investigador / protocol engineer junior |
| Empresa y consultoría | 00, 02, 10–13, 15–18 | 01–10, 46–50 | Diseño de red permisionada con ADR | Consultor / líder técnico enterprise |

## Desarrollo

- **A quién le sirve:** programadores que quieren construir contratos y aplicaciones descentralizadas de nivel profesional.
- **Secuencia recomendada:** 00–05 completos → énfasis fuerte en [06-solidity-foundry](../curriculum/06-solidity-foundry/README.md), [07-dapps](../curriculum/07-dapps/README.md), [08-tokens](../curriculum/08-tokens/README.md), [09-seguridad](../curriculum/09-seguridad/README.md) y [10-oraculos-indexacion](../curriculum/10-oraculos-indexacion/README.md) → [12-escalabilidad](../curriculum/12-escalabilidad/README.md) para desplegar en L2.
- **Puede aligerar:** 14 (ZK) y 17–18 (empresa) a lectura de síntesis.
- **Laboratorios clave:** prácticas 21–30 (EVM y desarrollo) al completo y 31–35 del bloque profesional; consulta el [catálogo](../labs/CATALOG.md).
- **Entregable de portafolio:** una dApp integral — contratos con pruebas unitarias, fuzzing e invariantes, interfaz y despliegue reproducible en testnet.
- **Salida laboral:** smart contract developer, full-stack Web3 developer, integrador de protocolos DeFi.

## Arquitectura

- **A quién le sirve:** ingenieros con experiencia que decidirán qué cadena, capa y modelo de confianza usa un sistema.
- **Secuencia recomendada:** profundiza 02–03 (distribuidos y consenso) y 05; después [10-oraculos-indexacion](../curriculum/10-oraculos-indexacion/README.md), [12-escalabilidad](../curriculum/12-escalabilidad/README.md), [13-interoperabilidad](../curriculum/13-interoperabilidad/README.md), [15-arquitectura-avanzada](../curriculum/15-arquitectura-avanzada/README.md) y [16-infraestructura-nodos](../curriculum/16-infraestructura-nodos/README.md).
- **Puede aligerar:** 08 (tokens) y hacer 06–07 solo hasta poder leer contratos.
- **Laboratorios clave:** prácticas 01–10 (modelado de sistemas) y 41–46 (rollups, puentes, MEV).
- **Entregable de portafolio:** un ADR de plataforma que compare al menos dos alternativas (L1 vs. L2, pública vs. permisionada) con trade-offs medibles.
- **Salida laboral:** arquitecto de soluciones blockchain, staff engineer de infraestructura Web3.

## Auditoría y seguridad

- **A quién le sirve:** quienes quieren encontrar y explicar vulnerabilidades antes de que cuesten dinero.
- **Secuencia recomendada:** 05 y 06 a fondo (no se audita lo que no se sabe escribir), énfasis máximo en [09-seguridad](../curriculum/09-seguridad/README.md); complementa con 07–08 (superficies de ataque de dApps y tokens), [11-dao-gobernanza](../curriculum/11-dao-gobernanza/README.md) (ataques de gobernanza) y 15.
- **Puede aligerar:** 13 y 17–18.
- **Laboratorios clave:** prácticas 31–40 (seguridad profesional) completas y 41–45 (front-running, storage collision y afines).
- **Entregable de portafolio:** un informe de seguridad con formato de auditoría real — hallazgos clasificados por severidad, prueba de concepto y recomendación; usa la plantilla de `assessments/audit-report-template.md` y los [checkpoints](../assessments/checkpoints.md).
- **Salida laboral:** auditor de smart contracts, security researcher, participante de concursos de auditoría (Code4rena, Sherlock).

## Producto y negocio

- **A quién le sirve:** perfiles de producto, negocio o emprendimiento que deben decidir si blockchain aporta valor y cómo se monetiza.
- **Secuencia recomendada:** 00 y 04 con calma; 07–08 para entender qué se puede construir; [11-dao-gobernanza](../curriculum/11-dao-gobernanza/README.md) a [15-arquitectura-avanzada](../curriculum/15-arquitectura-avanzada/README.md) en modo conceptual; y con énfasis fuerte [17-blockchain-en-la-empresa](../curriculum/17-blockchain-en-la-empresa/README.md) y [18-implementacion-empresarial](../curriculum/18-implementacion-empresarial/README.md), junto con toda la [sección de industria](../industria/README.md) (modelos de negocio, equipos y ciclo de vida).
- **Puede aligerar:** 06 y 09 a nivel de vocabulario.
- **Laboratorios clave:** prácticas 01–05 (fundamentos con criterio) y 11–15 (economía de Bitcoin y consenso).
- **Entregable de portafolio:** una validación de caso de uso con ADR "¿por qué blockchain?" y un análisis de tokenomics (derechos, emisión, demanda y gobernanza).
- **Salida laboral:** product manager Web3, analista de negocio blockchain, fundador o responsable de innovación.

## Investigación

- **A quién le sirve:** perfiles académicos o muy técnicos interesados en los fundamentos y en las fronteras del área.
- **Secuencia recomendada:** máxima profundidad en 01–03 (criptografía, distribuidos, consenso); después [12-escalabilidad](../curriculum/12-escalabilidad/README.md), [13-interoperabilidad](../curriculum/13-interoperabilidad/README.md), [14-privacidad-zk](../curriculum/14-privacidad-zk/README.md) y 15, apoyándose en la [bibliografía](../docs/bibliografia.md).
- **Puede aligerar:** 07–08 y 17–18.
- **Laboratorios clave:** prácticas 01–10 (implementar primitivas desde cero) y 41–48 (rollups, ZK, MEV).
- **Entregable de portafolio:** la réplica comentada de un paper relevante (por ejemplo, un mecanismo de consenso o una construcción ZK) con implementación mínima y análisis crítico.
- **Salida laboral:** investigador en criptografía aplicada, protocol engineer junior, estudiante de posgrado con base sólida.

## Empresa y consultoría

- **A quién le sirve:** consultores e ingenieros que integran blockchain en organizaciones existentes, con requisitos de cumplimiento y privacidad.
- **Secuencia recomendada:** 00 y 02 para el modelo mental; 10–13 para datos, escalado e interoperabilidad; 15–16 para arquitectura e infraestructura de nodos; y como núcleo [17-blockchain-en-la-empresa](../curriculum/17-blockchain-en-la-empresa/README.md) y [18-implementacion-empresarial](../curriculum/18-implementacion-empresarial/README.md), complementados con la [sección de industria](../industria/README.md) completa (cómo se construye una blockchain, stack, roles y ciclo de vida de un proyecto).
- **Puede aligerar:** 06 (escritura de contratos) y 14.
- **Laboratorios clave:** prácticas 01–10 y 46–50 (arquitectura avanzada y cierre de capstone).
- **Entregable de portafolio:** el diseño de una red permisionada o híbrida con ADR, modelo de gobernanza, plan de operación y análisis de cumplimiento estilo módulo 18.
- **Salida laboral:** consultor blockchain, líder técnico de proyectos enterprise, arquitecto de integraciones.

## Nivelación

- Sin programación previa: completa ejercicios de terminal y JavaScript básico antes del módulo 05.
- Con experiencia general: realiza `assessments/diagnostic.json`; si alcanzas 80 %, usa la ruta rápida descrita en la documentación del programa.
- Con experiencia EVM: comienza por seguridad, pero entrega igualmente el ADR "¿por qué blockchain?".

## Navegación

- [Inicio del programa](../README.md)
- [Currículo completo (19 módulos)](../curriculum/README.md)
- [Catálogo de laboratorios](../labs/CATALOG.md)
- [Evaluación](../docs/evaluacion.md) · [Checkpoints](../assessments/checkpoints.md)
- [Sección de industria](../industria/README.md) · [Roadmap](../ROADMAP.md)

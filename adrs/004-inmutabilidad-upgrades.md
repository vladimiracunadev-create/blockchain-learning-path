# ADR-004 · ¿Contrato inmutable o actualizable?

> **Estado:** guía educativa · **Ámbito:** ciclo de vida de contratos · [⬅️ Índice de ADRs](README.md)

## Contexto

Un contrato inmutable maximiza la promesa central de la plataforma —las reglas no cambian— pero convierte cualquier bug en permanente. Un contrato actualizable permite reparar fallos y evolucionar, pero reintroduce exactamente lo que la blockchain prometía eliminar: un administrador con poder para cambiar las reglas. La decisión no es técnica sino de **distribución de poder**: quién puede cambiar qué, con qué demora y con qué visibilidad.

Los mecanismos de upgrade añaden además riesgos técnicos propios: colisiones de layout de storage entre versiones, inicializadores ejecutables por cualquiera si se olvidan, y la llave del admin como punto único de fallo (la mayoría de los grandes exploits de puentes fueron compromisos de llaves, no bugs de lógica).

## Opciones

| Criterio | Inmutable puro | Proxy Transparent | Proxy UUPS | Módulos / Diamond (EIP-2535) | Migración por redeploy |
| --- | --- | --- | --- | --- | --- |
| Reparación de bugs | Imposible | Sí, vía admin | Sí, vía lógica de upgrade | Sí, por facetas | Sí, con migración de usuarios |
| Riesgo de admin key | Nulo | Alto | Alto | Alto y granular | Nulo entre versiones |
| Riesgo de storage collision | N/A | Medio | Medio | Alto | N/A |
| Complejidad de auditoría | Baja | Media | Media | Alta | Baja por versión |
| Costo de gas | Base | +1 delegatecall | +1 delegatecall | +lookup por faceta | Base |

## Criterios de decisión

- ¿El dominio exige poder **responder a incidentes** (custodia de fondos de terceros, cumplimiento regulatorio)?
- ¿Puede el protocolo tolerar un **bug congelado** mitigado con pausas, límites o migración voluntaria?
- ¿Quién controla la llave de upgrade: EOA, multisig, timelock, gobernanza? ¿Los usuarios pueden **salir antes** de que un upgrade los afecte?
- ¿El equipo tiene la disciplina operativa para gestionar layouts de storage entre versiones (herramientas como el plugin de upgrades de OpenZeppelin)?
- ¿Qué comunica al mercado: "código es ley" o "confía en nuestro multisig"?

## Decisión educativa

El programa recomienda por defecto **contratos inmutables con *guarded launch***: lanzamiento con límites de depósito, circuit breakers (pausa acotada) y despliegue progresivo, retirando esos poderes con el tiempo. Cuando el dominio exige capacidad de reparación (custodia significativa, requisitos regulatorios), la alternativa aceptada es **UUPS + timelock público + multisig**, documentando quién firma, cuánto dura la demora y cómo sale un usuario que no acepta el upgrade.

Transparent se estudia como patrón histórico; Diamond solo se recomienda cuando el tamaño del contrato lo hace inevitable, por su costo de auditoría.

## Consecuencias

Positivas:

- Los ejercicios del programa fuerzan a diseñar bien desde el inicio: no hay "ya lo parcheamos luego".
- Cuando hay upgrades, el poder administrativo queda explícito, demorado y auditable.

Negativas:

- Un bug serio en un contrato inmutable obliga a redeploy y migración, con costo reputacional y de coordinación.
- El timelock demora también las correcciones de emergencia: hay que combinar con pausas de alcance mínimo.

## Señales para reconsiderar

- El contrato pasa a custodiar valor de terceros a una escala donde "no poder reparar" es indefendible.
- La gobernanza madura (participación real, timelock respetado) y puede asumir upgrades con legitimidad.
- Aparecen exigencias regulatorias de intervención (congelamiento, listas) incompatibles con la inmutabilidad pura.

## Referencias

- OpenZeppelin, *Proxy Upgrade Pattern*: <https://docs.openzeppelin.com/upgrades-plugins/proxies>
- EIP-1822 (UUPS): <https://eips.ethereum.org/EIPS/eip-1822>
- EIP-2535 (Diamonds): <https://eips.ethereum.org/EIPS/eip-2535>
- Trail of Bits, *Contract upgrade anti-patterns*: <https://blog.trailofbits.com/2018/09/05/contract-upgrade-anti-patterns/>

# 👩‍🏫 Guía del instructor

> 🧭 [🛡️ Especialización](README.md) · [🧪 Laboratorios](laboratorios/README.md) · [📝 Evaluación](evaluacion/README.md) · [🧮 Matriz](MATRIZ-INTEGRACION.md) · [👩‍🏫 Instructor del programa](../instructor/syllabus.md)

Cómo impartir la especialización: secuencia, tiempos, puntos delicados y cómo tratar un caso que sigue abierto.

## Perfil de entrada y duración

- **Perfil:** quien ha completado, al menos, las unidades de criptografía, Ethereum y EVM, seguridad y custodia, o tiene experiencia equivalente. El material asume que sabes qué es una transacción y un hash.
- **Duración orientativa:** 36–44 horas lectivas. Reparto sugerido: 14 h de bloques, 16 h de laboratorios, 6 h de caso e integrador y 4 h de evaluación.
- **Formato:** presencial, síncrono o autoestudio guiado. Los laboratorios se ejecutan sin red y sin instalación, lo que permite trabajarlos en cualquier entorno con Node.js.

## Secuencia por sesiones

| Sesión | Contenido | Laboratorio | Producto de la sesión |
|---|---|---|---|
| 1 | [Bloque 1](bloques/01-criptografia-asimetrica-y-firmas.md) | [LE1](laboratorios/LE1-billeteras-de-prueba.md), [LE2](laboratorios/LE2-firmas-digitales.md) | Qué prueba y qué no prueba una firma |
| 2 | [Bloque 2](bloques/02-cuentas-contratos-y-abstraccion.md) | [LE3](laboratorios/LE3-transferencias-simuladas.md), [LE4](laboratorios/LE4-delegacion-eip7702.md) | Las dos ventanas de nonces, medidas |
| 3 | [Bloque 4](bloques/04-delegacion-de-permisos.md) | [LE5](laboratorios/LE5-detector-delegaciones.md) | Un detector y su evaluación honesta |
| 4 | [Bloque 3](bloques/03-custodia-claves-y-politicas-de-firma.md) | [LE8](laboratorios/LE8-monitor-riesgos-custodio.md) | Una política de firma y un monitor |
| 5 | [Bloques 5](bloques/05-trazabilidad-multicadena.md), [7](bloques/07-analisis-de-transacciones-eventos-y-logs.md) | [LE6](laboratorios/LE6-explorador-transacciones.md), [LE7](laboratorios/LE7-flujos-multidireccion.md) | Un rango de exposición con su método |
| 6 | [Bloques 6](bloques/06-stablecoins-congelamiento-y-recuperacion.md), [8](bloques/08-pruebas-de-reservas-y-sus-limites.md) | Prácticas 88–89 | Qué se puede congelar y qué prueba una PoR |
| 7 | [Bloque 9](bloques/09-caso-binance-2026-10-29.md) | Repaso de LE4, LE5, LE7 y LE8 | Informe del caso |
| 8 | Proyecto integrador y evaluación | — | Defensa del diseño |

El orden 3 → 4 (delegación antes de custodia) es deliberado: así los estudiantes llegan a la política de firma sabiendo qué tipos de firma conviene prohibir.

## Puntos delicados y cómo tratarlos

### Es un caso vivo

El incidente del bloque 9 tiene una fecha de corte y varias incógnitas abiertas. **Lo más valioso que puede aprender el grupo es a trabajar con un caso incompleto.**

- Empieza la sesión del caso pidiendo que **cada estudiante clasifique** diez afirmaciones de prensa antes de leer el estudio. Las discrepancias entre sus clasificaciones son la discusión.
- Si hay novedades desde la fecha de corte, **no las incorpores en el aula sin pasar por el procedimiento de actualización** del bloque. Pide al grupo que haga el trabajo: ¿qué fila cambia y por qué?
- Si un estudiante trae un dato nuevo sin fuente, es la ocasión de aplicar la categoría «no verificado».

### Atribución y personas

Resiste la tentación de «cerrar» el caso con un culpable. El material no atribuye conducta a nadie: la atribución a un grupo es una evaluación de terceros y el acceso inicial es una cadena de ataque, no una responsabilidad individual. Si el debate deriva hacia «quién tuvo la culpa», redirígelo a «qué control faltaba».

### Código ofensivo

Los laboratorios no contienen herramientas ofensivas: la red es un libro de estado en memoria, el «delegado hostil» tiene dos transferencias y el repaso de la fuga por nonce usa claves de prueba. Si un estudiante propone llevar algo a una red real, la respuesta es no, y que explique por qué: ese límite forma parte del aprendizaje. Consulta [¿Y si cruzas la línea?](../docs/y-si-cruzas-la-linea-blockchain.md).

### El hueco declarado

MPC, multisig y hardware wallets se estudian de forma comparativa, sin un laboratorio de implementación (ver la [matriz](MATRIZ-INTEGRACION.md#cobertura-inversa-de-los-temas-exigidos-a-su-ubicación)). Si el grupo quiere profundizar, la recomendación es una práctica con una biblioteca auditada, no una implementación casera.

## Errores habituales de los estudiantes

1. **Leer una firma válida como una operación legítima.** Vuelve a la tabla «Qué prueba y qué no» del bloque 1.
2. **Pensar que 50 autorizaciones aplican 50 veces o una sola.** Pide el experimento en LE4 con ambos órdenes.
3. **Dar un solo número de fondos «manchados».** Exige el rango y el método.
4. **Querer un detector perfecto.** LE5 está diseñado para que no exista: la lección es el compromiso.
5. **Evaluar una política solo contra el ataque.** LE8 incluye el día normal para eso.
6. **Confundir congelado con recuperado.**
7. **Copiar direcciones de artículos.** El material no las reproduce a propósito.

## Preparación de cada sesión

- Ejecuta tú los laboratorios antes: son deterministas y los resultados esperados están en cada guía.
- Revisa las [rúbricas](evaluacion/rubricas.md) y decide qué laboratorios exigen defensa oral.
- Comprueba que cada estudiante tiene Node.js 22.12 o superior (`node --version`).
- Si usas el modo en vivo de LE6, avisa de las reglas: nodo público de su elección, solo lectura, sin claves, sin credenciales en la URL.

## Adaptación por tiempo

| Tiempo | Qué priorizar |
|---|---|
| 12 h | Bloques 1, 2, 4 y 9; laboratorios LE2, LE4 y LE8 |
| 24 h | Los anteriores más bloques 3 y 5; LE5 y LE7 |
| 36–44 h | Todo, con proyecto integrador |

## 🧭 Navegación

[🛡️ Especialización](README.md) · [🧪 Laboratorios](laboratorios/README.md) · [📝 Evaluación](evaluacion/README.md) · [🧮 Matriz](MATRIZ-INTEGRACION.md) · [🏠 Programa](../README.md)

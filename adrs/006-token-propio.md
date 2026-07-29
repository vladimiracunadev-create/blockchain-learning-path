# ADR-006 · ¿Emitir un token propio?

> **Estado:** guía educativa · **Ámbito:** diseño económico · [⬅️ Índice de ADRs](README.md)

## Contexto

Casi todo proyecto blockchain enfrenta la tentación de emitir su propio token: financia el desarrollo, crea comunidad y "es lo que todos hacen". Pero un token es un producto financiero vivo que exige diseño de emisión y distribución, gestión de liquidez, gobernanza y —sobre todo— exposición regulatoria permanente. La pregunta correcta no es "¿podemos emitir un token?" sino "¿hay una función que un activo existente (ETH, una stablecoin) o una simple base de permisos no resuelva mejor?".

Si la única función del token es financiar el proyecto, eso tiene nombre: una venta de valores no registrada, con el riesgo jurídico y de incentivos que implica. La historia reciente está llena de tokens de gobernanza sin captura de valor real que cotizan como pasivo reputacional del equipo que los emitió.

## Opciones

| Criterio | Sin token (stablecoin/ETH) | Token de gobernanza | Token de utilidad | Puntos off-chain primero |
| --- | --- | --- | --- | --- |
| Captura de valor | En el producto, vía ingresos | Solo si la gobernanza controla flujos reales | Solo si el uso exige el token de verdad | Diferida: opcionalidad total |
| Riesgo regulatorio | Mínimo | Medio-alto (según derechos) | Medio (test de Howey caso a caso) | Bajo mientras no sean transferibles |
| Costo operativo | Bajo | Alto: gobernanza, liquidez, tesorería | Alto: liquidez y UX de compra | Muy bajo |
| Fricción de usuario | Mínima | Media | Alta (comprar el token para usar el producto) | Nula |
| Reversibilidad | Total | Casi nula tras el listado | Casi nula | Total: se puede migrar o cancelar |

## Criterios de decisión

- ¿Existe **captura de valor real**: el token recibe flujos, derechos o utilidad que crecen con el uso del protocolo?
- ¿Pasaría un análisis tipo **test de Howey** (inversión de dinero, empresa común, expectativa de ganancia por esfuerzo ajeno)? En la UE, ¿qué categoría de **MiCA** aplicaría y con qué obligaciones (white paper, autorización)?
- ¿Quién provee y sostiene la **liquidez**? Un token ilíquido es peor que ninguno; uno líquido convierte al equipo en gestor de mercado.
- ¿La utilidad propuesta sobrevive a la pregunta "¿y si esto se paga en stablecoin?"? Si sí, el token es fricción, no función.
- ¿El equipo acepta la **responsabilidad permanente** (legal, fiscal, de comunicación) que un token cotizado impone?

## Decisión educativa

El programa recomienda por defecto **no emitir token**: cobrar en stablecoins o ETH y gestionar permisos con mecanismos simples. Si el diseño sugiere que un token podría tener sentido, el camino recomendado es **puntos off-chain primero**, midiendo si el mecanismo funciona antes de asumir la irreversibilidad de un activo transferible. Solo se justifica emitir cuando existe un mecanismo de captura de valor claro y defendible, coherente con lo trabajado en los módulos 08 y 17 del currículo.

## Consecuencias

Positivas:

- Los proyectos se evalúan por su producto, no por la especulación sobre su token.
- Se evita la exposición regulatoria más severa del ecosistema y la carga de gestionar un mercado.

Negativas:

- Se renuncia a la vía de financiamiento y de incentivos tempranos que un token bien diseñado puede ofrecer.
- Migrar de puntos a token más tarde exige diseño cuidadoso para no defraudar expectativas creadas.

## Señales para reconsiderar

- El protocolo genera flujos reales y una gobernanza madura podría dirigirlos: un token con derechos sobre esos flujos deja de ser humo.
- Claridad regulatoria en la jurisdicción objetivo (por ejemplo, registro viable bajo MiCA) que reduzca el riesgo a niveles gestionables.
- El mecanismo probado con puntos off-chain demuestra que la transferibilidad añade valor y no solo especulación.

## Referencias

- SEC, *Framework for “Investment Contract” Analysis of Digital Assets*: <https://www.sec.gov/corpfin/framework-investment-contract-analysis-digital-assets>
- Reglamento MiCA (UE) 2023/1114: <https://eur-lex.europa.eu/eli/reg/2023/1114/oj>
- a16z crypto, *Defining tokens*: <https://a16zcrypto.com/posts/article/defining-tokens/>
- Variant, *Productive assets and token value*: <https://variant.fund/articles/>

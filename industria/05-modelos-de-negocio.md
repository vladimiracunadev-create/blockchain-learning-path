# 💼 Modelos de negocio del ecosistema

> **Audiencia:** Fundadores, analistas y product managers · ⏱️ **Lectura:** 25 min · **Fuentes:** documentación pública de protocolos y literatura de tokenomics
> [⬅️ Industria](README.md) · [🏠 Programa](../README.md) · [📚 Bibliografía](../docs/bibliografia.md)

---

## 🧭 De dónde sale el dinero realmente

Separemos dos preguntas que el marketing mezcla: **cómo genera ingresos un negocio del ecosistema** y **cómo captura valor un token**. Son problemas distintos y confundirlos ha quemado miles de millones. Los negocios del sector cobran por lo mismo que cualquier otro: por transacciones facilitadas, por infraestructura alquilada, por riesgo gestionado o por conocimiento aplicado. El token, cuando existe, es un mecanismo adicional de coordinación y captura de valor — a veces funciona, a veces es pura fricción.

Un filtro profesional útil antes de analizar cualquier proyecto: ¿quién paga, cuánto, por qué, y seguiría pagando si el precio del token fuera cero? Si la respuesta a la última pregunta es "nadie", el "modelo de negocio" es en realidad exposición al ciclo de mercado.

## 📊 Tabla de modelos: quién cobra, a quién y por qué

| Modelo | Ejemplos | Cómo genera ingresos | Riesgos del modelo |
|---|---|---|---|
| Protocolo DeFi (intercambio) | Uniswap, Curve | Comisión por swap pagada por traders; hoy fluye mayormente a proveedores de liquidez; el "fee switch" para el protocolo es decisión de gobernanza | Competencia feroz por comisiones; la gobernanza puede tardar años en activar captura de valor |
| Protocolo DeFi (préstamos) | Aave, Morpho | Spread entre interés pagado por prestatarios y recibido por depositantes; comisiones de liquidación | Riesgo de deuda incobrable en caídas bruscas; parámetros de riesgo mal calibrados |
| L2 / secuenciador | Arbitrum, Base, OP Mainnet | Margen entre el gas cobrado a usuarios y el costo de publicar datos en L1 — muy visible desde EIP-4844 (2024), que abarató la disponibilidad de datos con blobs | Compresión de márgenes por competencia entre L2; presión por descentralizar el secuenciador (y compartir el ingreso) |
| Staking y validación | Lido, staking institucional (Coinbase, Figment) | Comisión porcentual sobre las recompensas de staking de los clientes | Riesgo de slashing, concentración criticada por la comunidad, regulación del staking como servicio |
| Infraestructura RPC / nodos | Alchemy, Infura, QuickNode | Suscripción SaaS por acceso a nodos y APIs; niveles gratuitos como embudo | Comoditización; los clientes grandes migran a nodos propios |
| Indexación de datos | The Graph, indexadores propietarios | Pago por consulta o suscripción; en The Graph, mercado de curación e indexación con token | Alternativas centralizadas más simples compiten bien en la práctica |
| Oráculos | Chainlink | Los protocolos pagan por datos (suscripción o pago por actualización); servicios adicionales como VRF y CCIP | Concentración de dependencia sistémica; negociación opaca de contratos enterprise |
| Exchanges y custodia | Binance, Coinbase, custodios regulados | Spreads y comisiones de trading, listado, custodia institucional con tarifa sobre activos | Regulatorio (el mayor); ciclos de volumen; competencia de DEX |
| Seguridad como servicio | Trail of Bits, OpenZeppelin, Immunefi | Auditorías por proyecto, retainers, plataformas de bug bounty con comisión, monitoreo | Escasez de talento senior; responsabilidad reputacional por incidentes post-auditoría |
| Wallets | MetaMask, Rabby, wallets móviles | Comisión sobre swaps integrados, acuerdos con on-ramps, funciones premium | Monetizar sin erosionar confianza es difícil; competencia de wallets de exchanges |
| Tooling open core | Foundry (gratuito) vs. Tenderly, Hardhat + servicios | Núcleo abierto gratuito + plataforma de pago (simulación, monitoreo, CI especializado) | El estándar abierto puede canibalizar el producto de pago |
| Consultoría e integración | Consultoras especializadas, big four | Tarifa por proyecto/hora para llevar empresas a producción | Depende del ciclo de interés corporativo; difícil de escalar |

Nota sobre los números: los ingresos reales de muchos de estos actores son públicos y verificables on-chain o en agregadores — pero cambian semana a semana. Cita siempre la fuente y la fecha: **consúltalo en vivo** en DefiLlama (fees/revenue) y Token Terminal.

## 🪙 El token como modelo de negocio

Un token puede cumplir funciones reales: asegurar la red (staking), coordinar gobernanza, alinear incentivos tempranos o dar derecho a flujos de caja. La pregunta profesional es cuándo **captura valor** y cuándo es solo fricción añadida para financiar el proyecto:

- **Captura valor** cuando existe un vínculo mecánico entre uso del protocolo y demanda del token: quema de comisiones, distribución de ingresos a stakers, colateral obligatorio. Y cuando ese vínculo sobrevive escrutinio legal.
- **Es fricción** cuando el producto funcionaría igual con ETH o stablecoins y el token solo existe porque financió la ronda: el usuario debe adquirir un activo volátil extra para usar el servicio, y la presión vendedora de emisiones e inversores supera cualquier demanda orgánica.
La taxonomía clásica es menos nítida en la práctica de lo que sugieren las categorías:

| Categoría | Promesa nominal | Realidad frecuente |
|---|---|---|
| *Utility token* | Acceso o pago dentro del servicio | Si el servicio acepta stablecoins, la "utilidad" es sustituible y la demanda es especulativa |
| *Governance token* | Derecho a votar decisiones del protocolo | Sobre una tesorería con ingresos, se parece funcionalmente a un derecho económico — y los reguladores lo saben |
| *Security token* | Valor negociable declarado, con cumplimiento | La categoría más honesta y la menos usada, porque asume el costo regulatorio de frente |

La **"fat protocol thesis"** (Joel Monegro, USV, 2016) sostenía que en blockchain el valor se acumularía en la capa de protocolo y no en las aplicaciones — lo inverso a internet. Como hipótesis histórica fue influyente y parcialmente correcta para las L1. Las críticas actuales son sólidas: las comisiones migran hacia donde hay usuarios (aplicaciones y frontends como los de Uniswap o los wallets capturan cada vez más), las L2 compiten los márgenes de ejecución a la baja, y "valor de mercado del token" no es lo mismo que "valor capturado sosteniblemente". Úsala como referencia conceptual, no como ley.

### 💸 Flujo de valor en un protocolo con comisiones

```text
                    comisiones por uso
   Usuarios ───────────────────────────────► Protocolo (contratos)
   (traders,                                      │
   prestatarios)                                  ├──► Proveedores de liquidez / validadores
                                                  │        (la mayor parte, usualmente)
                                                  │
                                                  └──► Tesorería / DAO
                                                           │
                                          decisión de gobernanza ("fee switch")
                                                           │
                              ┌────────────────────────────┼─────────────────────────┐
                              ▼                            ▼                         ▼
                    Financiar desarrollo         Recompra/quema o           Reservas y
                    y seguridad                  distribución a holders     diversificación
                                                 (¿y sus implicancias
                                                  regulatorias?)
```

El eslabón punteado — de la tesorería al holder — es el más frágil: es donde la gobernanza se politiza y donde un token puede empezar a parecer un valor negociable ante el regulador.

## 📈 Métricas: qué mirar y qué no creerse

- **TVL (valor total bloqueado):** mide capital depositado, no ingresos ni usuarios. Es inflable con incentivos (capital mercenario que se va cuando terminan las emisiones) y doble-contable entre protocolos apilados. Útil como proxy de confianza, inútil como métrica de éxito por sí sola.
- **Fees vs. revenue:** *fees* es lo que pagan los usuarios; *revenue* es la porción que retiene el protocolo/tesorería. Un protocolo puede generar millones en fees y cero revenue (Uniswap durante años, con el fee switch apagado). DefiLlama y Token Terminal desglosan ambos — consúltalo en vivo.
- **Emisiones netas:** ingresos menos el costo de los incentivos en token propio. Muchos protocolos "rentables" en fees son deficitarios netos cuando se descuenta lo que emiten para atraer ese uso.
- **Usuarios activos y retención:** las direcciones no son personas (sybils, bots); busca cohortes y retención, no wallets acumuladas.
- **P/F y P/S (precio sobre fees o revenue):** útiles para comparar protocolos entre sí, siempre que se use la misma definición de ingreso; sin esa disciplina son marketing con decimales.
- **Concentración:** pocos usuarios o integraciones generando la mayoría de los fees es riesgo de cliente, igual que en cualquier SaaS.

## 🌱 Sostenibilidad: quién sobrevivió los inviernos

Los ciclos bajistas (2018-2019, 2022-2023) fueron el mejor auditor de modelos de negocio. Sobrevivieron los que cobraban por algo con demanda real e ingresos en activos sólidos: exchanges e infraestructura con suscripciones, protocolos de intercambio y préstamo con uso orgánico, firmas de seguridad, emisores de stablecoins (cuyo modelo — rendimiento del colateral — resultó ser de los más rentables del sector).

Patrones comunes de los sobrevivientes:

- Ingresos denominados en activos que no dependen del propio token (ETH, stablecoins, moneda fiat).
- Costos operativos que se pueden recortar en mercado bajista sin matar el producto.
- Tesorería diversificada antes del invierno, no durante.
- Un servicio por el que alguien pagaría aunque no existiera expectativa de apreciación de ningún token.

Murieron los **ponzinomics**: modelos cuyo ingreso dependía de la entrada de nuevos participantes comprando el token. El caso de estudio es el *play-to-earn* de 2021 (Axie Infinity como emblema): la "economía" pagaba a jugadores con un token cuya demanda eran otros jugadores nuevos; cuando el flujo de entrada se frenó, el modelo colapsó en meses. Misma mecánica en protocolos de "rendimiento" tipo Terra/Anchor: subsidios presentados como modelo de negocio. La señal de alerta es siempre la misma: rendimientos cuyo origen nadie puede explicar sin mencionar la llegada de nuevos compradores.

## ⚖️ Consideraciones regulatorias del modelo

El diseño del modelo de negocio y del token determina el perímetro regulatorio:

- **EE. UU. (referencia conceptual):** el test de *Howey* pregunta si hay inversión de dinero en una empresa común con expectativa de ganancia derivada del esfuerzo de terceros. Un token vendido prometiendo que el equipo lo valorizará encaja incómodamente bien. La aplicación concreta ha variado con los cambios de administración — el criterio conceptual sigue siendo la referencia.
- **UE:** MiCA (vigente desde 2024) clasifica criptoactivos (EMT, ART, otros), exige libro blanco y autorización a emisores y CASP, y regula especialmente a los emisores de stablecoins. Diseñar el token con MiCA en la mesa es más barato que rediseñarlo después.
- **Chile:** la Ley Fintech 21.521 (2023) incorpora los criptoactivos al perímetro de la CMF; los proveedores de servicios sobre criptoactivos requieren registro y autorización según el servicio.
- Regla práctica: si el modelo depende de vender el token a inversionistas minoristas con promesa implícita de apreciación, el riesgo regulatorio **es** el modelo de negocio.

## 🧪 Casos de estudio: la teoría en la práctica

### Uniswap y el "fee switch": valor generado no es valor capturado

Uniswap ha facilitado un volumen acumulado de billones de USD y ha generado miles de millones en comisiones — pagadas casi íntegramente a los proveedores de liquidez, no al protocolo ni al token UNI. Durante años la gobernanza debatió activar el *fee switch* (desviar una fracción de las comisiones a la tesorería o a los holders) sin ejecutarlo, en parte por el riesgo de que esa distribución acerque a UNI a la definición de valor negociable, y en parte por el temor a que los LPs migren a competidores. Lección doble: la captura de valor es una decisión de gobernanza con costo regulatorio y competitivo, no una consecuencia automática del uso; y un token puede coexistir años con un producto exitoso sin recibir un centavo de sus flujos. Estado actual del debate: consúltalo en vivo en el foro de gobernanza del protocolo.

### Secuenciadores de L2 después de EIP-4844: un negocio de márgenes visibles

Antes de Dencun (2024), el mayor costo operativo de una L2 era publicar datos en Ethereum. Los *blobs* de EIP-4844 redujeron ese costo drásticamente, y el margen del secuenciador — gas cobrado a usuarios menos costo de disponibilidad de datos en L1 — se volvió observable on-chain para cualquier analista. Es uno de los modelos más limpios del sector: ingreso por servicio prestado, costos medibles, sin depender del precio de un token. Sus riesgos también son claros: la competencia entre L2 comprime las tarifas al usuario, y la presión por descentralizar el secuenciador implicará, tarde o temprano, compartir ese ingreso.

### Staking líquido: comisión recurrente sobre un flujo estructural

Lido cobra un porcentaje de las recompensas de staking que genera para sus usuarios: ingresos recurrentes, denominados en el activo de la red, con costos operativos acotados. Es probablemente el modelo de negocio más simple y robusto del ecosistema post-Merge — y a la vez el más criticado, por la concentración de participación que acumula sobre la seguridad de Ethereum. Los servicios institucionales de staking replican el modelo con comisiones mayores a cambio de cumplimiento, custodia y soporte. La lección: los mejores modelos del sector cobran una fracción de un flujo estructural de la red, no apuestan a la apreciación de un token propio.

### 🧰 Checklist para evaluar cualquier modelo del sector

- ¿Quién paga, cuánto y a cambio de qué servicio concreto?
- ¿Los ingresos existen sin contar emisiones ni apreciación del token propio?
- ¿Qué fracción de los *fees* llega realmente al protocolo (revenue) y quién decide eso?
- ¿El modelo sobrevivió al menos un ciclo bajista completo, o solo conoce mercados alcistas?
- ¿Qué pasa con los ingresos si la actividad especulativa cae 80 %? (les pasó a todos en 2022)
- ¿El token es necesario para el servicio o es un instrumento de financiamiento con fricción añadida?
- ¿Qué clasificación regulatoria tendría el modelo en cada jurisdicción donde opera?

## ⚠️ Errores y mitos frecuentes

| Mito o error | Realidad |
|---|---|
| "Si el producto se usa, el token sube" | No necesariamente: sin mecanismo de captura (quema, distribución, colateral), uso y precio pueden divergir durante años |
| "TVL alto = protocolo exitoso" | El TVL mide depósitos, no ingresos; puede ser capital mercenario alquilado con emisiones |
| "Los fees del protocolo son ingresos del protocolo" | La mayoría va a LPs/validadores; el revenue del protocolo puede ser cero con el fee switch apagado |
| "El token alinea incentivos por definición" | Un token mal diseñado desalinea: presión vendedora de insiders contra usuarios que necesitan estabilidad |
| "APY alto = buen negocio" | Pregunta de dónde sale el rendimiento; si la respuesta es "de las emisiones del token", es un subsidio, no un negocio |
| "La fat protocol thesis demuestra que hay que invertir en L1" | Es una hipótesis de 2016 con contraejemplos crecientes: frontends, wallets y aplicaciones capturan cada vez más valor |
| "Ser DAO nos exime de la regulación de valores" | Los reguladores miran la función económica, no la etiqueta organizacional |

## 🔗 Referencias

- Shermin Voshmgir, *Token Economy* (texto abierto): <https://github.com/Token-Economy-Book/EnglishVersion>
- DefiLlama — TVL, fees y revenue en vivo: <https://defillama.com/>
- Token Terminal — métricas financieras de protocolos: <https://tokenterminal.com/>
- Joel Monegro, "Fat Protocols" (USV, 2016): <https://www.usv.com/writing/2016/08/fat-protocols/>
- Documentación de Uniswap (fees y gobernanza): <https://docs.uniswap.org/>
- Reglamento MiCA (EUR-Lex): <https://eur-lex.europa.eu/eli/reg/2023/1114/oj>

---

## 🧭 Navegación

⬅️ [04 · Blockchain para empresas](04-blockchain-para-empresas.md) · [Índice de industria](README.md) · ➡️ [06 · Ciclo de vida de un proyecto](06-ciclo-de-vida-de-un-proyecto.md)

# 🏢 Blockchain para empresas

> **Audiencia:** Decisores, consultores y arquitectos empresariales · ⏱️ **Lectura:** 25 min · **Fuentes:** informes públicos de adopción y casos documentados
> [⬅️ Industria](README.md) · [🏠 Programa](../README.md) · [📚 Bibliografía](../docs/bibliografia.md)

---

## 🎯 Qué aporta de verdad (y qué es humo)

Una blockchain **no** hace que los datos sean "verdaderos", ni abarata por sí sola una base de datos, ni elimina intermediarios por arte de magia. Lo que sí aporta, cuando el caso de uso es el correcto, es un conjunto acotado de beneficios verificables:

- **Coordinación entre organizaciones que no confían plenamente entre sí:** un registro compartido con reglas ejecutables elimina la pregunta "¿de quién es la copia buena?".
- **Liquidación más rápida y programable:** pasar de T+2 a liquidación atómica (entrega contra pago en la misma transacción) reduce riesgo de contraparte y capital inmovilizado.
- **Auditabilidad compartida:** todas las partes ven el mismo historial firmado criptográficamente; el regulador puede tener un nodo observador.
- **Activos programables:** un bono que paga cupones solo, una stablecoin con lógica de cumplimiento embebida, un fondo cuyas participaciones se transfieren 24/7.
- **Reducción de conciliación:** si dos bancos comparten el registro, desaparecen los procesos batch de "cuadrar" sistemas que hoy consumen equipos enteros de back office.

Lo que suele ser humo: "blockchain para trazabilidad" cuando el problema real es que alguien miente al ingresar los datos (el problema del oráculo no se resuelve con hashes), "blockchain interna" de una sola empresa (eso es una base de datos con pasos extra) y proyectos donde el incentivo para que los competidores compartan infraestructura nunca existió. Kevin Werbach lo resume bien: la blockchain es una **nueva arquitectura de confianza**, no un reemplazo universal de las existentes.

## 📊 Casos reales: éxitos operativos y fracasos instructivos

La mejor vacuna contra el marketing es estudiar casos con estado verificable. Esta tabla mezcla deliberadamente éxitos y fracasos, porque ambos enseñan:

| Caso | Sector | Estado (a 2025-2026) | Lección principal |
|---|---|---|---|
| JPMorgan **Kinexys** (ex Onyx / JPM Coin) | Pagos y liquidación institucional | ✅ Operativo; procesa miles de millones de USD diarios en pagos entre clientes institucionales | La liquidación interbancaria programable funciona cuando un actor con escala la opera y hay caso de negocio claro |
| **Visa** liquidación con stablecoins (USDC) | Pagos | ✅ Operativo; liquidación de obligaciones con adquirentes sobre redes públicas | Las redes públicas pueden integrarse a infraestructura de pagos tradicional de forma incremental |
| Bonos digitales del **BEI** (con Goldman, Santander, SocGen) y bono de **Siemens** | Mercado de capitales | ✅ Emisiones reales completadas, en volúmenes aún modestos | La emisión nativa digital reduce plazos de liquidación; el cuello de botella es legal y de mercado, no técnico |
| **BlackRock BUIDL** (fondo tokenizado, vía Securitize) | Gestión de activos / RWA | ✅ Operativo; uno de los mayores fondos tokenizados del mundo (cifras: consúltalo en vivo) | La tokenización de fondos de mercado monetario encontró demanda real como colateral on-chain |
| Remesas y pagos con stablecoins en LatAm (Bitso, corredores México–EE. UU. y otros) | Remesas | ✅ Operativo y creciendo; volúmenes relevantes (consúltalo en vivo) | Donde el sistema tradicional es caro y lento, las stablecoins compiten por precio y velocidad reales |
| **TradeLens** (IBM + Maersk) | Cadena de suministro | ❌ Cerrado en 2023 pese a funcionar técnicamente | El problema fue el modelo de negocio y la gobernanza: los competidores de Maersk no querían subirse a la plataforma de Maersk |
| **Libra / Diem** (Meta) | Pagos / stablecoin | ❌ Cancelado (activos vendidos en 2022) por presión regulatoria frontal | Una stablecoin global lanzada por una big tech era políticamente inviable; el riesgo regulatorio puede ser terminal |
| Reemplazo de **CHESS** en ASX (bolsa australiana) | Post-trade | ❌ Proyecto DLT abandonado en 2022 tras años y cientos de millones invertidos | Reescribir infraestructura crítica nacional sobre tecnología inmadura y con mala gestión de proyecto es un riesgo compuesto |
| Pilotos de supply chain y trazabilidad (numerosos, 2017-2021) | Varios | ⚠️ La mayoría no pasó de PoC | Sin incentivo económico para que todos los participantes carguen datos veraces, el registro compartido no aporta valor |

El patrón de los fracasos casi nunca es tecnológico: es **gobernanza del consorcio** (¿quién manda?, ¿quién paga?, ¿por qué mi competidor operaría mi plataforma?), **modelo de negocio** ausente o **riesgo regulatorio** subestimado.

## 🏭 Sectores: tracción real vs. sobrepromesa

| Sector | Tracción a 2025-2026 | Comentario honesto |
|---|---|---|
| Pagos, liquidación y stablecoins | 🟢 Alta | El caso de uso más probado; marcos regulatorios avanzando en varias jurisdicciones |
| Tokenización de activos (RWA) | 🟢 Alta y creciente | Fondos de mercado monetario, deuda y crédito privado lideran; volúmenes en vivo en agregadores públicos |
| Mercado de capitales (bonos, repos) | 🟡 Media | Emisiones reales pero volumen marginal frente al mercado tradicional |
| Cadena de suministro | 🔴 Baja | Cementerio de pilotos; el problema del oráculo y los incentivos siguen sin resolverse |
| Identidad digital | 🟡 Emergente | Estándares (credenciales verificables) maduran, adopción masiva aún pendiente |
| Salud | 🔴 Baja | Regulación de datos y sistemas legacy hacen el caso de uso muy difícil |

### 💎 Tokenización de activos del mundo real (RWA)

La tendencia dominante de 2024-2026 en el segmento empresarial es la **tokenización de activos del mundo real**: representar en una red blockchain instrumentos financieros tradicionales (cuotas de fondos, bonos, crédito privado, depósitos). El atractivo es concreto: liquidación atómica, operación 24/7, uso como colateral programable y fraccionamiento. BUIDL de BlackRock es el caso emblemático, pero el ecosistema incluye a Franklin Templeton, emisores de deuda tokenizada y bancos con depósitos tokenizados. Dos advertencias profesionales: primero, el token es tan bueno como el **vínculo legal** con el activo subyacente (custodia, jurisdicción, derechos del tenedor); segundo, las cifras de mercado cambian rápido — consúltalas en vivo en agregadores como RWA.xyz o DefiLlama antes de citarlas en un informe.

## 🔀 Pública, permisionada o L2: dónde se está moviendo la industria

La conversación de 2016-2020 era "pública vs. permisionada". La de 2024-2026 es distinta: el costo de las L2 públicas cayó drásticamente tras Dencun/EIP-4844 (2024), y buena parte de la industria financiera gira hacia **redes públicas con privacidad selectiva** o hacia L2/redes propias ancladas en infraestructura pública.

| Criterio | Hyperledger Fabric | Besu (permisionada) | Corda | Rollup público (L2 de Ethereum) |
|---|---|---|---|---|
| Modelo | Permisionada, canales privados | EVM permisionada o pública | Punto a punto entre pares | Pública, ejecución barata anclada a L1 |
| Privacidad | Alta (por diseño) | Media (configurable) | Alta (solo las partes ven el acuerdo) | Baja por defecto; en desarrollo (pruebas ZK, pools privados) |
| Interoperabilidad con DeFi/RWA público | Nula | Posible si es EVM | Baja | Nativa |
| Gobernanza | Consorcio (el punto débil histórico) | Consorcio u operador | Operador de red | Protocolo público + secuenciador |
| Costo por transacción | Infraestructura propia | Infraestructura propia | Infraestructura propia | Muy bajo post-EIP-4844 (consúltalo en vivo) |
| Cuándo elegirla | Datos sensibles entre pocos actores conocidos | Consorcio que quiere compatibilidad EVM | Acuerdos bilaterales financieros | Activos que se benefician de liquidez y composabilidad públicas |

La lección de la década: las redes permisionadas resuelven la privacidad pero heredan el problema de gobernanza del consorcio (ver TradeLens); las públicas resuelven la neutralidad pero exigen resolver privacidad y cumplimiento. No hay respuesta única — hay trade-offs.

## 🧮 Matriz de decisión: cuándo sí y cuándo no

Coherente con el criterio del módulo 00 del programa (ver [currículo](../curriculum/README.md)): la pregunta no es "¿puedo usar blockchain?" sino "¿este problema necesita un registro compartido entre partes que no se confían?".

- ✅ **Considera blockchain si:** hay múltiples organizaciones escribiendo en el registro, no existe (o no conviene) un intermediario neutral, se necesita liquidación programable o el activo gana valor por ser transferible 24/7 entre terceros.
- ❌ **No la uses si:** una sola entidad controla los datos, los participantes ya confían en un operador central barato, el dato crítico nace fuera de la cadena y nadie puede verificarlo (problema del oráculo), o el volumen/latencia requerido excede lo razonable para la red elegida.
- ⚠️ **Señal de alerta:** si el proyecto sigue teniendo sentido reemplazando "blockchain" por "base de datos compartida con API", entonces eso es lo que deberías construir.

### 🗺️ Hoja de ruta de adopción por fases

Cuando la matriz da "sí", la adopción sensata avanza por puertas de decisión, no por *big bang*:

1. **Exploración (semanas):** caso de negocio cuantificado (¿qué costo de conciliación, liquidación o capital inmovilizado se reduce y en cuánto?), análisis regulatorio preliminar por jurisdicción y mapa de partes interesadas internas: legal, riesgo, TI, negocio.
2. **PoC técnico (meses):** prototipo sobre testnet o red de prueba, con datos sintéticos. El objetivo es aprender las restricciones reales de integración y custodia, no impresionar al directorio con una demo.
3. **Piloto con alcance real:** volumen limitado, contrapartes reales, custodia y cumplimiento en configuración de producción. Aquí es donde mueren los proyectos con gobernanza no resuelta — y es mejor que mueran aquí que en producción.
4. **Producción acotada:** límites de monto, monitoreo continuo, plan de reversa al proceso tradicional y expansión gradual contra métricas acordadas de antemano.

Dos disciplinas transversales separan a los equipos serios: definir desde la fase 1 los **criterios de cancelación** (qué evidencia haría abandonar el proyecto — la mayoría de los pilotos zombis de 2017-2021 nunca los escribió) y presupuestar la **operación continua** desde el inicio, no solo la construcción.

## 🏗️ Arquitectura de integración empresarial

Una empresa no "se conecta a la blockchain" desde el ERP directamente. La integración real tiene capas, cada una con responsables y controles distintos:

```text
┌─────────────────────┐   ┌──────────────────────────┐   ┌────────────────────┐   ┌─────────────────┐
│  Sistemas internos  │   │  Capa de integración      │   │  Acceso a la red   │   │   Red blockchain │
│                     │   │                           │   │                    │   │                  │
│  ERP / core         │◄─►│  Middleware / orquestador │◄─►│  Nodo propio o     │◄─►│  L1 / L2 pública │
│  bancario / CRM     │   │  Custodio o wallet        │   │  proveedor RPC     │   │  o red           │
│  Contabilidad       │   │  institucional (firmas,   │   │  Indexador para    │   │  permisionada    │
│  Cumplimiento (AML) │   │  políticas, límites)      │   │  lecturas          │   │                  │
└─────────────────────┘   └──────────────────────────┘   └────────────────────┘   └─────────────────┘
        │                          │                              │
        └── conciliación ──────────┴── monitoreo y alertas ───────┘
```

Decisiones clave de esta arquitectura: ¿custodia propia o custodio regulado?, ¿nodo propio o RPC de terceros (y con qué SLA)?, ¿cómo se reflejan los eventos on-chain en la contabilidad interna? La capa de custodia y firmas es donde se concentra el riesgo operacional — merece el mismo rigor que la tesorería.

## 💰 Costos totales y riesgos

El costo del contrato inteligente suele ser la parte menor del presupuesto. Un caso empresarial serio presupuesta:

| Partida | Comentario |
|---|---|
| Desarrollo | Contratos + backend de integración + frontend; el contrato es la punta del iceberg |
| Auditorías de seguridad | Una o más firmas externas; costo significativo y no opcional (rangos: consúltalo en vivo) |
| Integración con legacy | Frecuentemente la partida más cara: ERP, core bancario, conciliación contable |
| Cumplimiento | Licencias, asesoría legal por jurisdicción, KYC/AML, reporting al regulador |
| Operación continua | Nodos/RPC, monitoreo, gestión de claves, respuesta a incidentes, actualizaciones |

Regla de oro presupuestaria: si el plan financiero termina en el go-live, no hay plan. La operación (claves, monitoreo, cumplimiento continuo, upgrades) es un costo permanente comparable al de cualquier sistema financiero crítico, y la decisión *build vs. buy* (nodo propio vs. RPC gestionado, custodia propia vs. custodio regulado) debe evaluarse partida por partida, no por ideología.

Riesgos que un decisor debe tener en el radar:

- **Regulatorio:** en la UE, MiCA está vigente desde 2024 y regula emisores de criptoactivos y proveedores de servicios (CASP); en Chile, la Ley Fintech 21.521 (2023) somete a los proveedores de servicios de criptoactivos a registro y supervisión de la CMF — detalle local en [regulación y tributación en Chile](../docs/chile-regulacion-tributacion.md). Operar en varias jurisdicciones multiplica el trabajo legal.
- **Reputacional:** un incidente de seguridad o la asociación con actores dudosos del ecosistema daña la marca más allá del monto perdido.
- **Técnico:** bugs en contratos son pérdidas directas y frecuentemente irreversibles; la inmutabilidad corta hacia ambos lados.
- **Gobernanza del consorcio:** el asesino silencioso de los proyectos permisionados; si no está resuelto en papel antes de escribir código, el proyecto ya está en riesgo.

## ⚠️ Errores y mitos frecuentes

| Mito o error | Realidad |
|---|---|
| "Blockchain garantiza que los datos son verdaderos" | Garantiza integridad e historial del registro, no la veracidad del dato de origen (problema del oráculo) |
| "Ahorraremos eliminando intermediarios" | Se sustituyen intermediarios por otros (custodios, oráculos, operadores de red) y por costos nuevos de cumplimiento |
| "Empecemos con un piloto y la gobernanza se verá después" | TradeLens funcionó técnicamente y murió por gobernanza; es la primera conversación, no la última |
| "Permisionada = segura y sin riesgo regulatorio" | Sigue habiendo riesgo operacional, de claves y, según el activo, plena regulación financiera |
| "El éxito del piloto predice producción" | La mayoría de los PoC de 2017-2021 nunca escaló; producción exige modelo de negocio, no demo |
| "Las empresas serias solo usan redes privadas" | La tendencia 2024-2026 es la inversa: instituciones emitiendo y liquidando sobre redes públicas y L2 |

## 🔗 Referencias

- Reglamento MiCA (EUR-Lex): <https://eur-lex.europa.eu/eli/reg/2023/1114/oj>
- Bank for International Settlements — investigación sobre tokenización y dinero digital: <https://www.bis.org/>
- World Economic Forum — informes de blockchain y activos digitales: <https://www.weforum.org/>
- Kevin Werbach, *The Blockchain and the New Architecture of Trust* (MIT Press): <https://mitpress.mit.edu/9780262547161/the-blockchain-and-the-new-architecture-of-trust/>
- Securitize — infraestructura del fondo tokenizado BUIDL: <https://securitize.io/>
- Hyperledger Fabric — documentación oficial: <https://hyperledger-fabric.readthedocs.io/>
- RWA.xyz — datos en vivo de activos tokenizados: <https://www.rwa.xyz/>

---

## 🧭 Navegación

⬅️ [03 · Equipos, roles y metodología](03-equipos-roles-y-metodologia.md) · [Índice de industria](README.md) · ➡️ [05 · Modelos de negocio](05-modelos-de-negocio.md)

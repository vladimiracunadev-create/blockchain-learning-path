# Glosario del programa

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [📖 Bibliografía](bibliografia.md)

Glosario de referencia de los términos que usan los módulos 00-27, los laboratorios y el capstone. Se privilegia el término en español con el anglicismo entre paréntesis cuando el sector lo usa de forma dominante. Para profundizar en cada tema, consulta [recursos-oficiales.md](recursos-oficiales.md).

## Fundamentos y criptografía

- **Cadena de bloques (blockchain)**: registro replicado y ordenado de transacciones cuya integridad se garantiza enlazando bloques con hashes.
- **Bloque**: conjunto ordenado de transacciones y metadatos enlazado criptográficamente al bloque anterior.
- **Hash**: huella determinista de longitud fija producida por una función criptográfica; cualquier cambio en la entrada altera la salida.
- **Preimagen**: entrada original de una función hash; la resistencia a preimagen impide recuperarla desde el hash.
- **Colisión**: dos entradas distintas que producen el mismo hash; una función segura hace su búsqueda impracticable.
- **Árbol de Merkle (Merkle tree)**: estructura que permite probar la inclusión de un dato en un conjunto con pruebas logarítmicas.
- **Prueba de Merkle (Merkle proof)**: conjunto mínimo de hashes hermanos que demuestra que una hoja pertenece a la raíz.
- **Firma digital**: prueba de que el titular de una clave privada autorizó un mensaje, verificable con la clave pública.
- **Criptografía de curva elíptica (ECC)**: familia de esquemas de clave pública usada por Bitcoin y Ethereum (secp256k1) y por BLS en consenso.
- **Clave privada / clave pública**: par asimétrico; la privada firma y jamás se comparte, la pública identifica y verifica.
- **Frase semilla (seed phrase)**: secuencia mnemónica (BIP-39) de la que se derivan de forma determinista todas las claves de una billetera.
- **Billetera (wallet)**: herramienta que administra claves y firma transacciones; no "guarda monedas" literalmente, las monedas viven en el registro. Cómo usarla con seguridad: [Wallets desde cero](wallets-desde-cero.md).
- **Ruta de derivación**: camino jerárquico (BIP-32/44, p. ej. `m/44'/0'/0'/0/0`) por el que una semilla genera cada clave; explica que la misma semilla reproduzca las mismas cuentas en otra wallet compatible.
- **Nodo**: software que valida, almacena o comunica datos de la red.
- **Consenso**: reglas para acordar el estado válido entre participantes que no confían entre sí.
- **Prueba de trabajo (proof of work, PoW)**: consenso que exige gasto computacional verificable para proponer bloques.
- **Prueba de participación (proof of stake, PoS)**: consenso que selecciona proponentes según capital depositado en garantía, con penalizaciones (slashing).
- **Finalidad (finality)**: garantía de que una operación no será revertida. Tiene **tres acepciones que no deben mezclarse**: *técnica* (la probabilidad de reversión es despreciable: probabilística en PoW, con checkpoints en PoS), *económica* (revertir costaría más de lo que se gana) y **jurídica o firmeza** (una norma declara la orden irrevocable y oponible a terceros, incluso en concurso del participante). Una transacción con 100 confirmaciones tiene las dos primeras y, por sí sola, ninguna de la tercera.
- **Tolerancia a fallas bizantinas (BFT)**: capacidad de un sistema de acordar estado correcto aunque una fracción de nodos actúe de forma arbitraria o maliciosa.

## Bitcoin

- **UTXO**: salida de transacción no gastada; el modelo contable de Bitcoin, donde el "saldo" es la suma de UTXO controlados por tus claves.
- **Nonce**: valor usado una vez; en minería PoW es el campo que se itera para encontrar un hash válido, en Ethereum ordena las transacciones de una cuenta.
- **Dificultad**: parámetro que ajusta cada 2016 bloques cuán difícil es encontrar un bloque válido, apuntando a ~10 minutos por bloque.
- **Halving**: reducción a la mitad del subsidio por bloque cada 210 000 bloques (~4 años); el último ocurrió en abril de 2024.
- **Mempool**: conjunto de transacciones válidas pendientes de inclusión en un bloque; cada nodo tiene su propia vista.
- **SegWit**: actualización de 2017 que separó las firmas (witness) del cuerpo de la transacción, corrigiendo la maleabilidad y habilitando más capacidad.
- **Taproot**: actualización de 2021 que introdujo firmas Schnorr y scripts más privados y eficientes.
- **Script**: lenguaje de condiciones de gasto de Bitcoin, deliberadamente no Turing-completo.
- **Lightning Network**: red de canales de pago fuera de cadena (off-chain) para pagos rápidos y baratos liquidados en Bitcoin.
- **Regtest**: modo de red local de Bitcoin Core para desarrollo, donde tú generas los bloques (lo usa el laboratorio `04-bitcoin-regtest`).

## Ethereum y EVM

- **EVM (Ethereum Virtual Machine)**: máquina virtual determinista que ejecuta el bytecode de los contratos en cada nodo.
- **Gas**: unidad que mide trabajo computacional en la EVM; cada opcode tiene un costo y cada transacción un límite.
- **Tarifa base (base fee)**: componente de la tarifa por gas que se ajusta por bloque según demanda y se quema, introducido por EIP-1559.
- **Propina (priority fee / tip)**: componente de la tarifa que va al proponente del bloque para priorizar la transacción.
- **EIP-1559**: reforma del mercado de tarifas de 2021 que introdujo base fee quemada más propina, haciendo las tarifas más predecibles.
- **Cuenta EOA (externally owned account)**: cuenta controlada por una clave privada, sin código propio.
- **Cuenta de contrato**: cuenta con código y almacenamiento, controlada por su propia lógica.
- **Calldata**: datos de entrada de una llamada a contrato; zona de solo lectura y la más barata para pasar argumentos.
- **Storage / memory**: almacenamiento persistente del contrato (caro, sobrevive entre transacciones) frente a memoria volátil de la ejecución (barata, se descarta al terminar).
- **ABI (Application Binary Interface)**: especificación para codificar llamadas y respuestas de contratos EVM; los primeros 4 bytes del calldata son el selector de función.
- **Opcode**: instrucción elemental de la EVM (por ejemplo `SSTORE`, `CALL`, `REVERT`).
- **Revert**: aborto de la ejecución que deshace todos los cambios de estado de la llamada y devuelve el gas no consumido.
- **Evento (log)**: registro barato emitido por un contrato, legible fuera de cadena pero inaccesible desde contratos.
- **Nodo de ejecución / nodo de consenso**: desde The Merge (2022), un nodo completo de Ethereum combina un cliente de ejecución (Geth, Nethermind, Reth) y uno de consenso (Lighthouse, Prysm, Teku).
- **Sincronización por checkpoint (checkpoint sync)**: arranque de un nodo de consenso desde un estado finalizado reciente en lugar de reproducir toda la historia.
- **MEV (maximal extractable value)**: valor extraíble reordenando, insertando o censurando transacciones dentro de un bloque.

## Contratos y desarrollo

- **Contrato inteligente (smart contract)**: programa determinista desplegado en la red cuya ejecución no depende de un operador central.
- **Solidity**: lenguaje dominante para contratos EVM, compilado a bytecode.
- **Foundry**: kit de herramientas para desarrollo EVM (`forge`, `cast`, `anvil`); el estándar de pruebas de este programa.
- **Prueba de propiedad (fuzz test)**: prueba que ejecuta una función con miles de entradas aleatorias buscando violar aserciones.
- **Prueba de invariantes (invariant test)**: prueba que verifica que una propiedad global del sistema se mantiene tras secuencias arbitrarias de llamadas.
- **Fork de red (fork testing)**: pruebas contra una copia local del estado real de una red (`forge test --fork-url`).
- **Proxy / actualizabilidad (upgradeability)**: patrón que separa almacenamiento y lógica para poder reemplazar la implementación; añade riesgos propios (colisión de storage, inicializadores).
- **Interfaz / herencia**: mecanismos de Solidity para componer contratos y cumplir estándares ERC.
- **Verificación de código fuente**: publicación del código en un explorador para que cualquiera compruebe que coincide con el bytecode desplegado.
- **Cuenta abstracta (account abstraction, ERC-4337)**: estándar que permite cuentas inteligentes con validación programable, patrocinio de gas y recuperación, sin cambiar el protocolo.
- **EIP-7702**: mejora (activa desde Pectra, 2025) que permite a una EOA delegar temporalmente su comportamiento a código de contrato.

## Tokens y DeFi

- **ERC-20**: estándar de tokens fungibles (saldos, `transfer`, `approve`).
- **ERC-721**: estándar de tokens no fungibles (NFT), un identificador único por token.
- **ERC-1155**: estándar multi-token que combina fungibles y no fungibles en un solo contrato.
- **ERC-4626**: estándar de bóvedas (vaults) tokenizadas que reciben un activo y emiten participaciones; base de mucha contabilidad DeFi.
- **Stablecoin**: token diseñado para mantener paridad con un activo (habitualmente USD), con respaldo fiat, cripto-colateralizado o algorítmico (este último con historial de fracasos, como UST en 2022).
- **AMM (automated market maker)**: intercambio que fija precios con una fórmula sobre reservas (por ejemplo x·y=k) en lugar de un libro de órdenes.
- **Pool de liquidez**: reservas depositadas por usuarios que habilitan el intercambio en un AMM a cambio de comisiones.
- **Pérdida impermanente (impermanent loss)**: costo de oportunidad de proveer liquidez cuando los precios de los activos del pool divergen.
- **Préstamo relámpago (flash loan)**: préstamo sin colateral que debe devolverse dentro de la misma transacción; herramienta legítima y vector de ataque frecuente.
- **Oráculo**: mecanismo que lleva datos externos (precios, resultados) al entorno on-chain; su manipulación es una causa recurrente de exploits.
- **TWAP (time-weighted average price)**: precio promedio ponderado por tiempo, usado para resistir manipulación puntual de oráculos.
- **Gobernanza on-chain**: toma de decisiones de un protocolo mediante votación con tokens y ejecución automática de propuestas.
- **Quorum**: participación mínima requerida para que una votación de gobernanza sea válida.
- **Timelock**: contrato que impone una demora obligatoria entre aprobar una acción y ejecutarla, dando tiempo a reaccionar.
- **DAO**: organización cuyo tesoro y reglas se administran mediante contratos y gobernanza distribuida.
- **TVL (total value locked)**: valor total depositado en un protocolo; métrica de adopción (consúltala en vivo en DefiLlama), no de seguridad.
- **RWA (real-world assets)**: activos del mundo real (deuda, inmuebles, fondos) representados como tokens on-chain.
- **Tokenomics**: diseño económico de un token: emisión, distribución, incentivos y sumideros de demanda.

## Seguridad

- **Reentrancia (reentrancy)**: ataque en que un contrato externo vuelve a llamar a la función víctima antes de que actualice su estado; mitigada con el patrón checks-effects-interactions y guardas.
- **Checks-effects-interactions**: orden defensivo: validar, actualizar estado propio y solo al final interactuar con contratos externos.
- **Desbordamiento (overflow/underflow)**: exceso del rango numérico; Solidity ≥0.8 revierte por defecto, pero `unchecked` lo reintroduce.
- **Front-running**: adelantarse a una transacción visible en el mempool para obtener ventaja; caso particular del MEV.
- **Ataque sándwich**: front-run más back-run alrededor de un intercambio para extraer valor del deslizamiento (slippage) de la víctima.
- **Address poisoning (envenenamiento de direcciones)**: sembrar en el historial de la víctima direcciones que imitan el principio y el final de las suyas, esperando que copie la impostora; se previene verificando la dirección completa.
- **Blind signing (firma a ciegas)**: firmar datos que la wallet no puede mostrar en claro; la regla defensiva es no firmar lo que no se puede leer.
- **Wallet drainer**: dApp o contrato malicioso diseñado para obtener firmas o aprobaciones que vacían la wallet de la víctima.
- **Control de acceso**: restricción de funciones sensibles a roles autorizados; su ausencia o mala configuración es una causa principal de pérdidas.
- **Multifirma (multisig)**: esquema que exige M-de-N firmas para ejecutar una acción; estándar mínimo para administrar contratos con fondos.
- **MPC (multi-party computation)**: técnica que reparte una clave entre varias partes de modo que ninguna la conozca completa; usada en custodia institucional.
- **HSM (hardware security module)**: hardware certificado que genera y protege claves sin exponerlas jamás en memoria de propósito general.
- **Auditoría**: revisión experta del código antes del despliegue; reduce riesgo, no lo elimina.
- **Recompensa por vulnerabilidades (bug bounty)**: programa que paga por reportes responsables (por ejemplo, vía Immunefi).
- **Lanzamiento protegido (guarded launch)**: despliegue gradual con límites de depósito, pausas y monitoreo intensivo antes de abrir el protocolo por completo.
- **Interruptor de pausa (circuit breaker / pause)**: facultad de detener funciones críticas ante un incidente; ver [operacion-incidentes.md](operacion-incidentes.md).
- **Runbook**: procedimiento operativo escrito y ensayado para responder a un tipo de incidente.
- **Modelo de amenazas**: análisis sistemático de quién puede atacar qué, cómo y con qué impacto.
- **KYT (know your transaction)**: monitoreo de transacciones para detectar fondos vinculados a actividades ilícitas; contraparte transaccional del KYC.

## Escalabilidad e interoperabilidad

- **L1 / L2**: capa base con su propio consenso frente a sistema que escala apoyándose en la seguridad de una capa base.
- **Rollup**: L2 que ejecuta transacciones fuera de la L1 y publica en ella los datos y las pruebas necesarias para verificarlas.
- **Rollup optimista (optimistic rollup)**: asume validez y permite disputarla durante una ventana con pruebas de fraude (fraud proofs); ejemplos: Arbitrum, Optimism.
- **Rollup de validez (ZK rollup)**: demuestra cada lote con una prueba de validez (validity proof) verificada on-chain; ejemplos: zkSync, Starknet, Scroll.
- **Prueba de fraude / prueba de validez**: mecanismos opuestos de seguridad de rollups: castigar estados inválidos a posteriori frente a impedirlos a priori.
- **Disponibilidad de datos (data availability, DA)**: garantía de que los datos de un rollup están publicados y cualquiera puede reconstruir su estado.
- **Blob (EIP-4844, proto-danksharding)**: espacio de datos temporal y barato introducido en 2024 para que los rollups publiquen datos sin usar calldata permanente.
- **Canal de estado (state channel)**: acuerdo fuera de cadena entre partes que solo liquida on-chain al abrir y cerrar.
- **Cadena lateral (sidechain)**: cadena independiente conectada a otra por un puente, con su propia seguridad (no hereda la de la L1).
- **Puente (bridge)**: mecanismo para mover activos o mensajes entre cadenas; históricamente el componente más explotado del ecosistema.
- **Cliente ligero (light client)**: verificador que valida cabeceras y pruebas sin almacenar todo el estado; base de los puentes con menos confianza.
- **Compromiso (commitment)**: valor que fija datos sin revelarlos y puede abrirse después (por ejemplo, una raíz de Merkle o un compromiso de Pedersen).
- **Fragmentación de liquidez**: dispersión de activos y usuarios entre múltiples L2 y cadenas, con costos de experiencia y capital.

## Privacidad y ZK

- **Prueba de conocimiento cero (ZK proof)**: prueba criptográfica de que una afirmación es cierta sin revelar los datos que la sustentan.
- **SNARK**: prueba ZK sucinta y de verificación barata; muchas construcciones requieren una ceremonia de configuración confiable (trusted setup).
- **STARK**: prueba ZK sin configuración confiable y post-cuántica en sus supuestos, a costa de pruebas más grandes.
- **Circuito**: representación aritmética del cómputo que se quiere demostrar en un sistema ZK.
- **Testigo (witness)**: entradas privadas del circuito que el probador conoce y no revela.
- **Anulador (nullifier)**: valor único que impide usar dos veces la misma nota o compromiso privado sin revelar cuál se usó.
- **Mixer / pool de privacidad**: protocolo que rompe el vínculo entre depósitos y retiros; con implicaciones regulatorias serias (caso Tornado Cash).
- **Identidad autosoberana / credencial verificable**: identidad digital cuyo titular controla qué atributos demuestra, a menudo con pruebas selectivas ZK.

## Empresa e infraestructura

- **Cadena permisionada**: red donde los validadores y a veces los lectores requieren autorización; modelo de Hyperledger Fabric o Besu en consorcios.
- **Consorcio**: grupo de organizaciones que operan una red permisionada compartida con gobernanza contractual.
- **Tokenización**: representación de un activo o derecho como token, con el desafío central de que el vínculo legal off-chain sea exigible.
- **Custodia**: guarda de claves por un tercero regulado; alternativa a la autocustodia con otros riesgos y obligaciones.
- **RPC (remote procedure call)**: interfaz por la que aplicaciones consultan nodos (propios o de proveedores como Alchemy/Infura).
- **Indexador**: servicio que transforma eventos on-chain en datos consultables (por ejemplo, The Graph o un indexador propio).
- **IOPS**: operaciones de entrada/salida por segundo; el disco (NVMe) suele ser el cuello de botella real al operar nodos, más que la CPU.
- **Nodo de archivo (archive node)**: nodo que conserva todos los estados históricos, con requisitos de disco muy superiores a un nodo completo.
- **SLA / observabilidad**: compromisos de disponibilidad y la instrumentación (métricas, logs, alertas) para cumplirlos; ver [operacion-incidentes.md](operacion-incidentes.md).
- **MiCA**: Reglamento (UE) 2023/1114 sobre mercados de criptoactivos; marco europeo para emisores y proveedores de servicios, desarrollado en [regulación · Unión Europea](../regulation/european-union/README.md).

## Dinero, pagos y liquidación

- **Dinero de banco central**: pasivo del banco central. Efectivo (para todos) y reservas (solo entidades con cuenta); el único activo de liquidación sin riesgo de crédito.
- **Dinero bancario**: saldo en cuenta. Es un **pasivo del banco comercial** contigo, no un objeto guardado; su seguridad depende de la solvencia del banco y del seguro de depósito.
- **Dinero electrónico**: pasivo de un emisor no bancario, con obligación de respaldo y segregación; redimible a la par, pero no es un depósito.
- **Compensación (clearing)**: cálculo de cuánto debe cada participante a cada uno, normalmente neteando. **No mueve dinero.**
- **Liquidación (settlement)**: transferencia efectiva del activo de liquidación. Aquí sí se mueve.
- **LBTR (liquidación bruta en tiempo real)**: cada orden se liquida individualmente y al instante en dinero de banco central. Máxima seguridad, máxima necesidad de liquidez.
- **Neto diferido (SNLD)**: se netea durante el día y se liquida el saldo al cierre. Mínima liquidez, exposición hasta liquidar.
- **Firmeza**: ver *finalidad*, acepción jurídica. La declara la norma del sistema de pagos, no el protocolo.
- **Riesgo de contraparte**: que la otra parte no cumpla. **Riesgo de liquidación**: que entregues tu pata y no recibas la suya.
- **Riesgo Herstatt**: riesgo de liquidación en divisas por desfase horario; se pierde el **principal íntegro**, no el margen.
- **DvP (delivery versus payment)**: entrega del activo condicionada al pago, de forma que ocurren ambas o ninguna.
- **PvP (payment versus payment)**: lo mismo entre dos monedas: la entrega de una ocurre si y solo si ocurre la de la otra.
- **Banca corresponsal**: acuerdo por el que un banco mantiene cuentas y presta servicios a otro en su jurisdicción o moneda.
- **Nostro / vostro**: «nuestra cuenta en su banco» / «su cuenta en nuestro banco»; son la misma cuenta vista desde cada lado.
- **Prefondeo**: saldo mantenido por adelantado en la cuenta nostro para poder pagar; capital inmovilizado dimensionado para el pico. Es el mayor coste oculto de un pago transfronterizo.
- **Margen de cambio (FX spread)**: diferencia entre el tipo aplicado al cliente y el tipo medio de mercado. En remesas suele ser el mayor componente del coste y el menos visible.
- **Intercambio atómico**: operación en la que todas las patas se ejecutan o ninguna, garantizado por el propio mecanismo de ejecución.
- **Contracargo (chargeback)**: reversión de un pago a instancia del pagador; función de protección al consumidor, no un defecto técnico.

## Dinero digital y activos tokenizados

- **Stablecoin**: token que busca mantener un valor estable. Clasifícalo siempre por **respaldo** (fiat, cripto, materia prima, algorítmica, sintética), **emisor** y **derecho de redención**.
- **Paridad (peg) / desanclaje (depeg)**: el valor objetivo y su separación sostenida del precio de mercado.
- **Participante autorizado**: entidad con derecho contractual a emitir y redimir directamente con el emisor. De ella depende el arbitraje que sostiene la paridad.
- **Atestación (attestation)**: informe de un tercero sobre el saldo de las reservas en una fecha. **No es una auditoría**, que emite opinión sobre los estados financieros.
- **Depósito tokenizado**: representación en un registro distribuido de un depósito bancario; sigue siendo pasivo del banco emisor, con su régimen y su supervisión.
- **Singularidad del dinero**: propiedad por la que un peso vale un peso esté en el banco que esté; la sostienen la convertibilidad a la par y la liquidación en dinero de banco central.
- **CBDC / MDBC**: moneda digital de banco central. **Minorista** (público general) o **mayorista** (solo entidades con cuenta en el banco central).
- **Modelo de dos niveles**: el banco central emite y liquida; intermediarios privados distribuyen e identifican clientes.
- **Límite de tenencia**: tope de MDBC que una persona puede mantener; freno explícito a la fuga de depósitos, no una restricción técnica.
- **Dinero programable vs. pagos programables**: la regla vive en el dinero (puede restringir su uso) o en la aplicación (el dinero sigue siendo fungible). La distinción ordena casi todo el debate público.
- **Tokenizar**: representar en un registro un **derecho** sobre un activo. No se tokeniza una cosa: se tokeniza un derecho sobre ella.
- **Envoltorio jurídico (legal wrapper)**: estructura que vincula el token con el derecho; sin ella el token no significa nada.
- **SPV (vehículo de propósito especial)**: sociedad creada para aislar un activo y sus riesgos; aporta separación patrimonial y añade riesgo de gobierno del propio vehículo.
- **RWA (real world assets)**: activos del mundo real representados on-chain; su riesgo dominante vive en la junta entre ambos mundos.
- **NAV (valor liquidativo)**: activos menos pasivos por participación. **No es** el precio de mercado del token ni el precio al que puedes vender hoy.
- **Transferencia restringida**: capacidad del token de rechazar transferencias a direcciones no autorizadas; requisito habitual cuando el instrumento es un valor (ERC-1400, ERC-3643).
- **CSD (depositario central de valores)**: entidad que mantiene el registro autoritativo de titularidad de los valores.
- **CCP (contraparte central)**: se interpone entre comprador y vendedor; netea y **concentra** el riesgo, por eso está fuertemente regulada.
- **T+n**: días hábiles entre operación y liquidación. Cada día es un día de exposición.
- **Fecha de registro (record date)**: momento que determina quién cobra un evento corporativo; en un registro compartido, un bloque concreto.
- **Eventos corporativos**: hechos del emisor que afectan al valor — cupón, dividendo, amortización, canje.

## Custodia, identidad y cumplimiento

- **Autocustodia / custodia de tercero / custodia calificada**: quién controla la clave y quién responde ante pérdida; la última la presta una entidad autorizada con requisitos de segregación y auditoría.
- **MPC (computación multiparte)**: varias partes calculan una firma sin que la clave completa exista nunca; la cadena ve una firma normal y la política no es visible on-chain.
- **HSM**: módulo criptográfico que genera y usa claves sin exponerlas, con control de acceso y registro de uso.
- **Política M-de-N**: hacen falta M firmas de N firmantes. Tolera **M−1** compromisos y **N−M** pérdidas: los dos fallos son opuestos y ambos hay que dimensionarlos.
- **Ceremonia de claves**: procedimiento presencial documentado para generar o rotar claves, con testigos, acta y respaldo verificado.
- **Solo lectura (watch-only)**: seguimiento de saldos con la clave pública, sin capacidad de firma; imprescindible para conciliación y contabilidad.
- **Abstracción de cuenta (ERC-4337)**: la cuenta es un contrato con reglas propias — límites diarios, sesiones, recuperación social, pago de comisiones por un tercero.
- **DID (identificador descentralizado)**: identificador controlado por su titular, resoluble a un documento con sus claves públicas.
- **Credencial verificable**: afirmación firmada por un emisor sobre un sujeto. **Divulgación selectiva**: presentar solo el atributo necesario.
- **Open Finance / finanzas abiertas**: marco de interfaces y **consentimiento** para que terceros autorizados accedan a datos o inicien pagos en tu nombre. No es blockchain, y no confiere control de llaves.
- **AML / KYC / KYB / KYT**: prevención de lavado, conocer al cliente, conocer al negocio y **monitorizar la transacción** (el específico de este entorno).
- **GAFI / FATF**: organismo que fija los estándares globales de prevención. Sus Recomendaciones **no son derecho directo**: obligan a los países a incorporarlas.
- **VASP / CASP**: proveedor de servicios sobre activos virtuales (terminología GAFI) y proveedor de servicios de criptoactivos (terminología MiCA).
- **Regla de Viaje (travel rule)**: obligación de que la información de ordenante y beneficiario acompañe a la transferencia entre proveedores. **No tiene destinatario cuando el destino es una wallet autoalojada.**
- **Wallet autoalojada**: la que controla directamente su titular, sin intermediario.
- **ART / EMT**: bajo MiCA, ficha referenciada a activos (cesta o varias monedas) y ficha de dinero electrónico (una sola moneda oficial), con regímenes distintos.
- **Enfoque basado en riesgo**: asignar controles en proporción al riesgo evaluado. Aplicar el máximo a todos es caro, excluyente y desplaza la atención.
- **Jerarquía normativa**: ley → reglamento/norma → circular → guía → consulta pública → propuesta. Solo las tres primeras obligan; confundirlas es el error más frecuente del sector.

## Cómo usar este glosario

- Los cuestionarios de [evaluación](evaluacion.md) asumen que manejas estos términos al nivel de la definición dada.
- Si un término te resulta opaco, el módulo correspondiente del [currículo](../curriculum/README.md) lo desarrolla con laboratorios.
- Los términos regulatorios se desarrollan, con su rango y su fuente oficial, en [regulación](../regulation/README.md).
- Las cifras asociadas (tarifas, TVL, número de validadores) cambian constantemente: consúltalas en vivo en las fuentes de [recursos-oficiales.md](recursos-oficiales.md).

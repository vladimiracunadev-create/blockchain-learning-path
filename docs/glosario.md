# Glosario del programa

> [⬅️ Volver al programa](../README.md) · [📚 Currículo](../curriculum/README.md) · [📖 Bibliografía](bibliografia.md)

Glosario de referencia de los términos que usan los módulos 00-18, los laboratorios y el capstone. Se privilegia el término en español con el anglicismo entre paréntesis cuando el sector lo usa de forma dominante. Para profundizar en cada tema, consulta [recursos-oficiales.md](recursos-oficiales.md).

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
- **Billetera (wallet)**: herramienta que administra claves y firma transacciones; no "guarda monedas" literalmente, las monedas viven en el registro.
- **Nodo**: software que valida, almacena o comunica datos de la red.
- **Consenso**: reglas para acordar el estado válido entre participantes que no confían entre sí.
- **Prueba de trabajo (proof of work, PoW)**: consenso que exige gasto computacional verificable para proponer bloques.
- **Prueba de participación (proof of stake, PoS)**: consenso que selecciona proponentes según capital depositado en garantía, con penalizaciones (slashing).
- **Finalidad (finality)**: garantía de que un bloque no será revertido; puede ser probabilística (PoW) o económica/absoluta (PoS con checkpoints).
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
- **MiCA**: reglamento europeo de mercados de criptoactivos, en aplicación plena desde diciembre de 2024; referencia regulatoria para emisores y proveedores de servicios.

## Cómo usar este glosario

- Los cuestionarios de [evaluación](evaluacion.md) asumen que manejas estos términos al nivel de la definición dada.
- Si un término te resulta opaco, el módulo correspondiente del [currículo](../curriculum/README.md) lo desarrolla con laboratorios.
- Las cifras asociadas (tarifas, TVL, número de validadores) cambian constantemente: consúltalas en vivo en las fuentes de [recursos-oficiales.md](recursos-oficiales.md).

# 📖 Glosario de la especialización

> 🧭 [🛡️ Especialización](README.md) · [📖 Glosario general del programa](../docs/glosario.md) · [🧪 Laboratorios](laboratorios/README.md) · [🧮 Matriz](MATRIZ-INTEGRACION.md)

Términos de la especialización de seguridad y custodia. Cada definición aclara **qué es**, **qué no demuestra** y, cuando importa, **con qué se confunde**. Los términos generales (hash, blockchain, wallet) están en el [glosario del programa](../docs/glosario.md).

## Criptografía y firmas

- **ECDSA**: esquema de firma sobre curvas elípticas que usan Bitcoin y las cuentas de Ethereum. Una firma es un par `(r, s)`. No prueba identidad: prueba conocimiento de una clave.
- **secp256k1**: la curva elíptica de Bitcoin y Ethereum. Su generador `G` y su orden `n` son constantes públicas.
- **Nonce de firma (`k`)**: número secreto y único de cada firma ECDSA. Repetirlo o hacerlo predecible revela la clave privada. **No es un contador.** No confundir con el nonce de cuenta.
- **RFC 6979**: derivación determinista del nonce de firma a partir de la clave y del mensaje; elimina la dependencia de un generador aleatorio.
- **Maleabilidad**: propiedad por la que `(r, s)` y `(r, n − s)` validan el mismo mensaje. Ethereum la limita exigiendo `s ≤ n/2` (*low-s*).
- **`ecrecover`**: función que recupera la clave pública (y la dirección) desde un hash y una firma `(r, s, v)`. Devuelve siempre algún resultado; **verificar es compararlo** con la dirección esperada.
- **`v` (bit de recuperación)**: la paridad de la coordenada `y` del punto `R`; permite recuperar la clave pública.
- **Mensaje personal (EIP-191)**: texto firmado con el prefijo `"\x19Ethereum Signed Message:\n" + longitud`, para que no pueda ser una transacción válida.
- **Datos tipados (EIP-712)**: estructura firmada con un dominio (cadena, contrato, versión) que un contrato puede verificar.
- **Dominio de firma**: el contexto que ata una firma a un uso: cadena, contrato destino, nonce y caducidad. Sin él, la firma es reutilizable.
- **Firma de Schnorr (BIP-340)**: esquema de Bitcoin (Taproot) cuya estructura lineal permite agregar firmas.
- **FROST**: protocolo de firma por umbral para Schnorr ([RFC 9591](https://www.rfc-editor.org/rfc/rfc9591)).
- **Checksum EIP-55**: uso de mayúsculas y minúsculas de una dirección como suma de verificación. Una dirección en minúsculas es válida pero no comprobable.
- **Keccak-256**: función hash de Ethereum. **No es idéntica a SHA3-256**: difiere en el relleno.
- **RLP**: formato binario de serialización de transacciones y autorizaciones de Ethereum.

## Cuentas, contratos y delegación

- **EOA (cuenta de propiedad externa)**: cuenta de Ethereum controlada por una clave y, hasta EIP-7702, sin código.
- **Cuenta de contrato**: cuenta con código, sin clave propia. Reacciona a llamadas; no inicia transacciones.
- **Nonce de cuenta**: contador de transacciones de una EOA (o de contratos creados por un contrato). Impide repetir una transacción. Puede consumirlo quien tenga la clave, también mediante una autorización EIP-7702.
- **Abstracción de cuentas**: familia de diseños en los que una cuenta valida sus operaciones con reglas programables (multifirma, recuperación, límites) en vez de una sola clave.
- **ERC-4337**: abstracción de cuentas sin cambiar el protocolo, mediante `UserOperation`, *bundlers* y un `EntryPoint`.
- **`UserOperation`**: orden firmada de ERC-4337 que no es una transacción. Su nonce tiene una clave de 192 bits y una secuencia de 64.
- **Bundler**: nodo que agrupa `UserOperation` y las envía como una transacción normal.
- **Paymaster**: contrato que paga el gas en nombre del usuario según sus condiciones.
- **EIP-7702**: estándar que permite a una EOA adoptar el código de un contrato mediante una autorización firmada, incluida en una transacción de tipo 4.
- **Transacción tipo 4**: transacción de EIP-7702; lleva una lista de autorizaciones, no vacía.
- **Autorización (EIP-7702)**: tupla `[chain_id, address, nonce, y_parity, r, s]` firmada sobre `keccak256(0x05 ‖ rlp([chain_id, address, nonce]))`. Es una firma suelta: la puede publicar cualquiera.
- **Autoridad**: la cuenta que firma una autorización. Se recupera de la firma; no tiene por qué ser el remitente de la transacción.
- **Delegado**: el contrato cuyo código adopta una cuenta delegada.
- **Designador de delegación**: el código `0xef0100 ‖ dirección` (23 bytes) que EIP-7702 escribe en la cuenta delegante.
- **Ventana de nonces**: lista de autorizaciones de una misma cuenta con nonces consecutivos, firmadas para acertar con el vigente. Con orden descendente se aplica una; con ascendente pueden encadenarse varias.
- **Revocar una delegación**: firmar una autorización a la dirección cero, que restituye la cuenta a EOA. Requiere la clave.
- **Patrocinio (*sponsored transaction*)**: un tercero paga el gas de una operación ajena.
- **`approve` / `allowance`**: permiso ERC-20 para que un contrato mueva hasta cierto importe de tus tokens.
- **`setApprovalForAll`**: permiso ERC-721/1155 para mover cualquier token de una colección.
- **`permit` (EIP-2612)**: aprobación ERC-20 firmada fuera de cadena; no deja evento hasta que se usa.
- **ERC-1271**: interfaz con la que un contrato valida una firma en nombre de una cuenta inteligente.

## Custodia y claves

- **Hot, warm y cold wallet**: capas de custodia por propósito y exposición. La hot atiende retiros inmediatos; la cold guarda la reserva.
- **Tope (*cap*)**: saldo máximo permitido en una billetera caliente. **Su valor es la pérdida máxima** si la billetera se compromete.
- **Multisig**: política `m` de `n` firmas, nativa en Bitcoin o implementada con un contrato en Ethereum.
- **MPC / firma por umbral**: reparto de la clave en fragmentos de modo que `t` de `n` produzcan una firma sin que la clave completa exista en un lugar. No protege contra el abuso del flujo de firma.
- **HSM**: dispositivo certificado que genera claves no exportables y firma bajo una política.
- **Billetera de hardware**: dispositivo aislado con pantalla propia para que el firmante vea lo que firma.
- **Política de firma**: reglas que se aplican **antes** de producir una firma: tipo de contenido, destinos, importes, aprobaciones y retardos.
- **Firma ciega (*blind signing*)**: firmar datos que el aprobador no puede interpretar.
- **Separación de funciones**: quien solicita no aprueba; quien aprueba no firma.
- **Conocimiento dividido**: ninguna persona conoce el material completo de una clave.
- **Independencia real de firmantes**: que los firmantes no compartan máquina, red, administrador, proveedor ni credenciales. Sin ella, un cuórum es decorativo.
- **Freno de emergencia (*circuit breaker*)**: pausa automática del servicio de retiros ante señales críticas. **Solo detiene lo que pasa por tus sistemas.**
- **Ceremonia de claves**: procedimiento controlado, con testigos, para generar o restaurar material de clave.
- **Rotación**: sustitución periódica o tras un incidente de una clave. Debe acompañarse de la revocación de lo que la clave anterior concedió.

## Trazabilidad y análisis

- **UTXO**: salida de transacción sin gastar; unidad de contabilidad de Bitcoin.
- **Heurística de entradas comunes**: inferencia de que las entradas de una transacción pertenecen a una misma entidad. Falla ante *coinjoins*.
- **Cadena de pelado (*peel chain*)**: secuencia en la que el grueso avanza a una nueva dirección y una porción menor sale en cada paso. **Indicador, no prueba.**
- **Dirección de cambio**: salida que vuelve al remitente en una transacción UTXO; su identificación es una inferencia.
- **Polvo semilla**: cantidad mínima enviada a una dirección como primera entrada; convención de preparación, indicador débil.
- **Puente (*bridge*)**: sistema que representa en una cadena un activo bloqueado o quemado en otra. Emparejar sus dos extremos es una inferencia.
- **Rollup / L2**: cadena que ejecuta transacciones aparte y publica datos en otra (L1).
- **Registro (*log*) y evento**: dato que un contrato decide emitir; incluye `topics` indexados y `data`. **Puede ser falso.**
- **`topics[0]`**: hash Keccak-256 de la firma del evento.
- **Traza interna (*call trace*)**: registro de las llamadas entre contratos, necesario para ver ETH movido por contratos.
- **Propagación de contaminación**: método para atribuir qué parte de lo que sale de una dirección procede de fondos de interés. Hay tres: *poison*, *haircut* y *FIFO*.
- **Poison**: toda salida de una cuenta con algo contaminado se considera contaminada. Sobrestima.
- **Haircut**: la contaminación sale en proporción a la que hay en el saldo.
- **FIFO**: el primero que entra es el primero que sale. Depende del orden.
- **Hecho / indicador / inferencia / hipótesis**: los cuatro niveles de certeza de un análisis. Una dirección no es una persona.
- **Finalidad**: grado en que un bloque ya no puede revertirse. En Ethereum: `latest`, `safe`, `finalized`.
- **Reorganización**: sustitución de bloques recientes por otros.

## Stablecoins, congelamiento y recuperación

- **Lista de bloqueo (*blacklist*)**: función de un token por la que su emisor impide transferir desde una dirección.
- **Congelamiento**: inmovilización de fondos por el emisor. **No es devolución.**
- **Quemar y reemitir**: destruir los tokens bloqueados y emitir el mismo importe a su titular legítimo; permite la restitución.
- **Activo congelable**: el que tiene un emisor con función de bloqueo. ETH, BTC y similares no lo son.
- **Control compensatorio**: el que actúa después del hecho (el congelamiento); complementa, no sustituye, a los preventivos.
- **Reloj de la defensa**: tiempo desde la salida de fondos hasta que se detecta, se identifica, se contacta al emisor y este bloquea.

## Reservas y solvencia

- **Prueba de reservas (PoR)**: demostración de control de activos y de inclusión de pasivos en un conjunto comprometido. No es una auditoría ni una prueba de solvencia.
- **Firma de desafío**: firma de un mensaje fijado por el verificador que acredita control de una clave en ese instante.
- **Árbol de Merkle de pasivos**: compromiso con los saldos de los clientes; cada cliente verifica su hoja contra la raíz.
- **Cobertura por activo**: activos entre pasivos calculado activo a activo, sin compensar entre ellos.
- **Maquillaje temporal (*window dressing*)**: preparar una foto con fondos temporales justo antes del corte.
- **Perímetro de la prueba**: qué cubre exactamente la prueba y qué queda fuera.

## Método del estudio de caso

- **Hecho confirmado**: verificable en cadena, declarado en el registro por la entidad, o coincidente en fuentes independientes.
- **Hipótesis**: inferencia razonada de un tercero, sin confirmación de quien tiene la información.
- **Desconocido**: dato que nadie ha publicado; se registra, no se rellena.
- **No verificado**: afirmación que circula pero no se localiza en una fuente primaria.
- **Fecha de corte**: momento hasta el cual se considera la información; un estudio de un caso vivo siempre la declara.

## 🧭 Navegación

[🛡️ Especialización](README.md) · [📖 Glosario general del programa](../docs/glosario.md) · [🧪 Laboratorios](laboratorios/README.md) · [🧮 Matriz](MATRIZ-INTEGRACION.md) · [🏠 Programa](../README.md)

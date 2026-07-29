# 05 · Ethereum y EVM

> **Nivel:** Intermedio · ⏱️ **Duración estimada:** 150 min · **Fuente:** *Mastering Ethereum* (Antonopoulos, Wood) y *Ethereum Yellow Paper* (Wood)
> [⬅️ Currículo](../README.md) · [📚 Bibliografía](../../docs/bibliografia.md)

---

## 🎯 Objetivos

- Distinguir cuentas EOA y de contrato por su nonce, código y forma de iniciar transacciones.
- Explicar el modelo de gas y la estructura de comisiones EIP-1559 (base fee y priority fee).
- Codificar y decodificar una llamada mediante ABI y su selector de función.
- Diferenciar storage, memory y stack, y relacionar una variable de storage con un evento.
- Seguir una transacción desde la firma en la wallet hasta el cambio de estado, identificando dónde puede fallar.

## 📚 Resultados de aprendizaje

Al finalizar, el estudiante podrá:

1. **Clasificar** una cuenta como EOA o contrato a partir de sus atributos observables.
2. **Descomponer** la calldata de una llamada en selector y argumentos codificados.
3. **Calcular** el coste aproximado de una transacción con base fee y priority fee.
4. **Explicar** por qué la estimación de gas no es una promesa exacta del coste final.
5. **Relacionar** un cambio de estado en storage con el evento emitido que lo registra.
6. **Rastrear** el recorrido de una transacción y ubicar los puntos de fallo (revert, gas insuficiente, nonce).

## 🗺️ Temas

| # | Tema | Por qué importa |
|---|---|---|
| 1 | EOA vs. contrato | Define quién puede firmar y quién solo ejecuta código. |
| 2 | Nonce | Ordena las transacciones de una cuenta y evita repeticiones. |
| 3 | Gas y EIP-1559 | Determina el coste y la inclusión de una transacción. |
| 4 | Calldata y ABI | Es el contrato de interfaz entre quien llama y el código. |
| 5 | Eventos y logs | Permiten observar cambios de estado de forma barata e indexable. |
| 6 | Storage, memory y stack | Explican dónde vive cada dato y cuánto cuesta usarlo. |
| 7 | Llamadas y revert | Modelan la composición entre contratos y el manejo de errores. |
| 8 | Estado como Merkle-Patricia | Garantiza integridad y pruebas eficientes del estado global. |

## 🧠 Modelo mental

Imagina la EVM como una calculadora mundial compartida en la que cada operación tiene un precio en fichas (gas). Antes de ejecutar, cargas suficientes fichas; si se agotan a mitad de camino, la máquina deshace todo el trabajo pero se queda con las fichas gastadas. El estado global es un gran libro contable cuyo resumen (la raíz de Merkle-Patricia) cabe en una sola huella verificable.

La analogía se rompe en un punto clave: a diferencia de una calculadora aislada, aquí miles de nodos reejecutan la misma operación para acordar el resultado, y el precio por ficha varía en cada bloque según la demanda (la base fee). Por eso la estimación de gas es una previsión, no una garantía: el consumo real depende del estado en el momento exacto de la ejecución.

## 📖 Conceptos y definiciones

- **EOA**: cuenta controlada por una clave privada; es la única que puede iniciar y firmar transacciones.
- **Cuenta de contrato**: cuenta con código asociado que se ejecuta cuando la invocan; no firma por sí misma.
- **Nonce**: contador por cuenta que ordena las transacciones y previene su repetición.
- **Gas**: unidad que mide el trabajo computacional; cada operación de la EVM tiene un coste fijo en gas.
- **Base fee**: comisión por gas que se quema en cada bloque; se ajusta según la ocupación (EIP-1559).
- **Priority fee**: propina por gas para el validador que incentiva la inclusión rápida.
- **Calldata**: datos de entrada de una llamada; comienza con el selector de 4 bytes y sigue con los argumentos.
- **ABI**: especificación que describe funciones y tipos para codificar y decodificar llamadas y respuestas.
- **Evento (log)**: registro barato e indexable que un contrato emite para señalar un cambio de estado.
- **Storage / memory / stack**: almacenamiento persistente por contrato, memoria temporal por llamada y pila de trabajo de la EVM.
- **Revert**: aborto de una ejecución que deshace los cambios de estado pero consume el gas gastado.

## 🧪 Laboratorio guiado

1. Inicia un nodo local de desarrollo con Foundry en una terminal aparte.

```bash
anvil
```

2. Consulta bloque actual, chain id y el balance de una cuenta con `cast`.

```bash
cast block-number
cast chain-id
cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

3. Ejecuta el laboratorio de selector ABI para codificar una llamada y decodificar su respuesta.

```bash
pnpm lab:abi
```

4. Compara el valor de una variable en storage con el evento que se emitió al modificarla.
5. Estima el gas de una llamada y explica por qué el coste final puede diferir.
6. Ejecuta la batería de pruebas del repositorio con `pnpm test` para validar tu entorno.

## 📝 Reto verificable

Sigue una transacción de principio a fin: firma en la wallet, propagación, inclusión en bloque y cambio de estado. Redacta el recorrido señalando dónde podría fallar.

**Criterio de aceptación:** el recorrido nombra el selector y los argumentos de la calldata, muestra el desglose base fee más priority fee y enumera al menos tres puntos de fallo posibles (revert, gas insuficiente y nonce incorrecto).

## ⚠️ Errores frecuentes

| Síntoma | Causa y cómo comprobarlo |
|---|---|
| "La transacción se quedó pendiente" | Nonce con hueco o gas price bajo; revisa el nonce esperado y la base fee actual. |
| El coste no coincide con la estimación | Confundiste estimación con promesa; el consumo depende del estado en ejecución. |
| No encuentras el cambio de estado | Buscaste en logs en vez de storage; el evento describe, el storage guarda. |
| La llamada revierte sin motivo claro | Argumentos mal codificados; verifica selector y tipos contra la ABI. |
| Mezclas base fee y priority fee | Sumaste mal la comisión; sepáralas y recuerda que la base fee se quema. |

## 🛡️ Seguridad y ética

- Trabaja en local con Anvil o en testnet; nunca uses fondos ni claves reales.
- No pegues claves privadas de mainnet en scripts ni variables de entorno del laboratorio.
- Trata la estimación de gas como orientación, no como compromiso, al diseñar interfaces.
- Los valores de base fee y de red varían minuto a minuto: consúltalo en vivo antes de concluir.
- Recuerda que Ethereum opera bajo Proof of Stake desde The Merge; describe el consenso con precisión.

## 🔗 Referencias

- Antonopoulos y Wood, *Mastering Ethereum*, caps. sobre la EVM y transacciones — <https://github.com/ethereumbook/ethereumbook>
- Wood, *Ethereum Yellow Paper*, secciones de ejecución y estado — <https://ethereum.github.io/yellowpaper/paper.pdf>
- Documentación para desarrolladores de ethereum.org — <https://ethereum.org/developers/docs/>
- Fuente primaria: EIP-1559 — <https://eips.ethereum.org/EIPS/eip-1559>

## ✅ Criterio de dominio

- Explicas el recorrido completo de una transacción y ubicas sus puntos de fallo.
- Codificas y decodificas una llamada por su selector y argumentos ABI.
- Justificas la diferencia entre estimación y coste final de gas con base fee y priority fee.

---

## 🧭 Navegación

⬅️ [Módulo 04 · Bitcoin](../04-bitcoin/README.md) · [📚 Índice del currículo](../README.md) · ➡️ [Módulo 06 · Solidity y Foundry](../06-solidity-foundry/README.md)

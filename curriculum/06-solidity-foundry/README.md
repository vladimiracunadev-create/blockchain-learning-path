# 06 · Solidity y Foundry

> **Nivel:** Intermedio-Avanzado · ⏱️ **Duración estimada:** 180 min · **Fuente:** documentación de Solidity y *The Foundry Book*
> [⬅️ Currículo](../README.md) · [📚 Bibliografía](../../docs/bibliografia.md)

---

## 🎯 Objetivos

- Escribir un contrato en Solidity con tipos, visibilidad, modifiers, custom errors y eventos correctos.
- Diseñar invariantes de una bóveda antes de implementar su lógica.
- Ejecutar el flujo de Foundry: compilar, probar con detalle y aplicar fuzzing e invariantes.
- Aplicar el patrón checks-effects-interactions y control de acceso para prevenir reentrancy.
- Razonar sobre transferencias forzadas (selfdestruct/force-send) y su efecto en la contabilidad interna.

## 📚 Resultados de aprendizaje

Al finalizar, el estudiante podrá:

1. **Estructurar** un contrato con herencia, interfaces y librerías de forma clara.
2. **Formular** invariantes verificables antes de escribir la implementación.
3. **Ejecutar** pruebas unitarias, de fuzzing y de invariantes con Foundry.
4. **Aplicar** checks-effects-interactions para ordenar validaciones, efectos e interacciones externas.
5. **Distinguir** el saldo real del contrato de su contabilidad interna ante force-send.
6. **Justificar** el uso de custom errors y de patrones de control de acceso.

## 🗺️ Temas

| # | Tema | Por qué importa |
|---|---|---|
| 1 | Tipos y visibilidad | Definen qué es accesible y cómo se comporta cada dato. |
| 2 | Modifiers y control de acceso | Centralizan las precondiciones y protegen funciones sensibles. |
| 3 | Custom errors y eventos | Abaratan el manejo de errores y hacen auditable el estado. |
| 4 | Herencia, interfaces y librerías | Permiten componer y reutilizar código de forma segura. |
| 5 | receive / fallback | Controlan cómo el contrato recibe ether y llamadas sin datos. |
| 6 | Layout de storage | Determina el coste y la seguridad de las variables persistentes. |
| 7 | Fuzzing e invariantes | Exploran estados inesperados que las pruebas de ejemplo no cubren. |
| 8 | checks-effects-interactions | Es la defensa base contra reentrancy. |

## 🧠 Modelo mental

Trata el contrato como la caja fuerte de un banco con reglas grabadas en acero: una vez desplegado, nadie cambia las reglas, así que deben ser correctas desde el primer día. Antes de instalar la cerradura defines las promesas que jamás pueden romperse (las invariantes): "nadie retira más de lo que depositó" y "la suma de las cuentas cuadra con el dinero administrado". Luego el fuzzing actúa como un ladrón incansable que prueba millones de combinaciones buscando una promesa rota.

El límite de la analogía está en el force-send: alguien puede empujar ether al contrato sin pasar por la puerta (por ejemplo, mediante selfdestruct), de modo que el saldo real puede superar la contabilidad interna. Por eso una invariante nunca debe confiar en que `address(this).balance` iguale la suma contable; hay que separar lo que el contrato registra de lo que físicamente contiene.

## 📖 Conceptos y definiciones

- **Visibilidad**: `public`, `external`, `internal` o `private`; define quién puede invocar una función o leer una variable.
- **Modifier**: bloque reutilizable de precondiciones que envuelve a una función, por ejemplo un `onlyOwner`.
- **Custom error**: error tipado y barato declarado con `error`; reemplaza cadenas de `require` en revert.
- **Evento**: registro indexable que documenta cambios de estado para observadores externos.
- **Interfaz**: declaración sin implementación que fija cómo interactuar con otro contrato.
- **Librería**: código sin estado propio, reutilizable, que se enlaza o incrusta en contratos.
- **receive / fallback**: funciones especiales que gestionan ether entrante y llamadas sin coincidencia de selector.
- **Layout de storage**: disposición de variables en ranuras de 32 bytes; un orden incorrecto encarece o rompe upgrades.
- **Invariante**: propiedad que debe mantenerse cierta en todo estado alcanzable, verificada por Foundry.
- **checks-effects-interactions**: patrón que valida primero, actualiza el estado después e interactúa con el exterior al final.

## 🧪 Laboratorio guiado

1. Antes de programar, redacta por escrito las dos invariantes de la bóveda: retiros nunca superiores al saldo del usuario y suma contable igual a los fondos administrados, considerando force-send.
2. Sitúate en el laboratorio, compila y ejecuta las pruebas con detalle, luego aumenta el fuzzing.

```bash
cd labs/06-solidity-vault
forge build
forge test -vv
forge test --fuzz-runs 1000
```

3. Observa la salida del fuzzing y anota qué entradas exploró el motor.
4. Añade o revisa una prueba de invariante que modele transferencias forzadas al contrato.
5. Revisa que cada función que toca fondos siga el orden checks-effects-interactions.
6. Consulta el catálogo de laboratorios en [`../../labs/CATALOG.md`](../../labs/CATALOG.md) y la guía en [`../../labs/guides/README.md`](../../labs/guides/README.md) para contexto adicional.

## 📝 Reto verificable

Implementa (o corrige) la bóveda para que respete ambas invariantes y pase el fuzzing con al menos 1000 corridas, incluyendo un escenario de force-send.

**Criterio de aceptación:** `forge test --fuzz-runs 1000` termina sin fallos, existe una prueba de invariante que introduce fondos por force-send y ninguna función viola el orden checks-effects-interactions.

## ⚠️ Errores frecuentes

| Síntoma | Causa y cómo comprobarlo |
|---|---|
| El fuzzing rompe la invariante de saldo | La contabilidad confía en `address(this).balance`; sepárala del registro interno. |
| Reentrancy vacía la bóveda | Interactúas antes de actualizar estado; reordena a checks-effects-interactions. |
| El upgrade corrompe datos | Cambiaste el orden del layout de storage; compara las ranuras antes y después. |
| El revert no informa nada útil | Usas cadenas caras o vacías; declara custom errors descriptivos. |
| Cualquiera ejecuta una función crítica | Falta control de acceso; añade un modifier y verifica el propietario. |

## 🛡️ Seguridad y ética

- Trabaja siempre en local o testnet; nunca despliegues con fondos ni claves reales.
- Reutiliza componentes auditados como los de OpenZeppelin antes de reinventar primitivas de seguridad.
- Escribe las invariantes antes que el código para no ajustar las pruebas a errores existentes.
- Considera siempre las transferencias forzadas: el saldo real puede exceder la contabilidad interna.
- No publiques como seguro un contrato sin fuzzing ni revisión; los costes de gas y las prácticas cambian, consúltalo en vivo.

## 🔗 Referencias

- Documentación de Solidity, secciones de tipos, contratos y patrones — <https://docs.soliditylang.org/>
- *The Foundry Book*, capítulos de testing, fuzzing e invariantes — <https://book.getfoundry.sh/>
- OpenZeppelin Contracts, guía de control de acceso y seguridad — <https://docs.openzeppelin.com/contracts/>
- Fuente primaria: EIP-4626, estándar de bóvedas tokenizadas — <https://eips.ethereum.org/EIPS/eip-4626>

## ✅ Criterio de dominio

- Enuncias las invariantes de la bóveda antes de implementarla y las verificas con Foundry.
- Justificas el orden checks-effects-interactions en cada función que mueve fondos.
- Explicas cómo el force-send desacopla el saldo real de la contabilidad interna.

---

## 🧭 Navegación

⬅️ [Módulo 05 · Ethereum y EVM](../05-ethereum-evm/README.md) · [📚 Índice del currículo](../README.md) · ➡️ [Módulo 07 · Aplicaciones descentralizadas](../07-dapps/README.md)

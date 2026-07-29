# Guías 01–10 · Fundamentos

Este cuaderno cubre criptografía aplicada y sistemas distribuidos: hashes, cadenas encadenadas, Merkle, firmas Ed25519 y propagación P2P. Acompaña a los módulos [criptografía](../../curriculum/01-criptografia/README.md), [sistemas distribuidos](../../curriculum/02-sistemas-distribuidos/README.md) y [consenso](../../curriculum/03-consenso/README.md).

> [⬅️ Cuaderno de laboratorios](README.md) · [🧪 Catálogo](../CATALOG.md) · [📚 Currículo](../../curriculum/README.md)

Cada práctica exige una entrada de bitácora con hipótesis, procedimiento, resultado, explicación y límite de lo demostrado. La bitácora es la evidencia; el comando solo la produce.

| # | Práctica | Tipo | Comando/entrega |
|---:|---|---|---|
| 01 | Matriz blockchain vs. base tradicional | concepto | ADR con tres matrices |
| 02 | Historia anotada del dinero digital | concepto | línea temporal de 10 hitos |
| 03 | Propiedades y límites de SHA-256 | auto | `node -e` con `sha256` |
| 04 | Cadena de hashes manipulada | auto | `pnpm lab:hash` |
| 05 | Árbol y raíz de Merkle | auto | `pnpm lab:merkle` |
| 06 | Prueba de inclusión Merkle | auto | `node --test merkle-proof.test.mjs` |
| 07 | Firma y verificación Ed25519 | auto | `node digital-signature.mjs` |
| 08 | Amenazas de custodia de claves | concepto | threat model |
| 09 | Propagación P2P con retrasos | concepto | simulación de 5 nodos |
| 10 | Partición y reconciliación | concepto | informe de rama |

## 01 · Blockchain o base tradicional

- **Objetivo:** justificar cuándo una blockchain aporta sobre una base tradicional.
- **Cómo se resuelve:**
  1. Toma los tres casos (salud, puntos internos, pagos internacionales) y aplica el ADR 001.
  2. Para cada uno completa seis ejes: autoridad, quiénes escriben, privacidad, corrección de errores, costo y estrategia de salida.
  3. Decide por caso: si hay un único escritor confiable y la privacidad es dura, una base tradicional gana; blockchain solo justifica su costo cuando hay múltiples escritores sin confianza mutua.
- **Estructura de la respuesta:** tres matrices de 6 filas y una línea de decisión por caso ("elijo X porque el eje autoridad/salida pesa más").
- **Criterio de aceptación:** cada decisión nombra el eje que la determinó, no solo la conclusión.
- **Error común:** elegir blockchain "porque es moderno" → falta el eje de autoridad que lo descarta.

## 02 · Historia anotada del dinero digital

- **Objetivo:** relacionar cada avance con el problema previo que resolvió.
- **Cómo se resuelve:**
  1. Ordena diez hitos desde firmas digitales y dinero electrónico hasta Bitcoin, Ethereum y rollups.
  2. Para cada hito cita una fuente primaria (paper o especificación original).
  3. Redacta una frase que enlace el hito con el defecto que corrige del anterior (p. ej. doble gasto → PoW).
- **Estructura de la respuesta:** tabla de 10 filas con `año | hito | fuente | problema que resuelve`.
- **Criterio de aceptación:** cada hito explica qué problema anterior aborda, no solo qué es.
- **Error común:** listar tecnologías sueltas → se pierde la cadena causa-efecto que se evalúa.

## 03 · Propiedades y límites de SHA-256

- **Objetivo:** observar determinismo y efecto avalancha, y ubicar los límites del hash.
- **Cómo se resuelve:** la función `sha256` de [`hash-chain.mjs`](../01-cryptography/hash-chain.mjs) envuelve `createHash("sha256")`. Calcula el hash de dos mensajes que difieren en un solo carácter y compara.

```bash
node -e "import('./labs/01-cryptography/hash-chain.mjs').then(m=>{console.log(m.sha256('hola'));console.log(m.sha256('holA'))})"
```

```text
4d186321c1a7f0f354b297e8914ab240...   # 64 hex, siempre igual para 'hola'
a7c4f...totalmente distinto...          # un solo bit de entrada cambia ~la mitad de los bits
```

- Cada salida es de 256 bits (64 caracteres hex) e idéntica en cada corrida: determinismo.
- Cambiar un carácter reescribe cerca de la mitad de los bits: efecto avalancha, sin correlación con el original.
- **Criterio de aceptación:** distingue integridad (hash) de contraseña (KDF con sal) y de cifrado (reversible con clave).
- **Error común:** llamar "cifrado" al hash → SHA-256 no es reversible, no hay clave que lo deshaga.

## 04 · Cadena de hashes manipulada

- **Objetivo:** demostrar que alterar un registro rompe toda la cadena posterior.
- **Cómo se resuelve:** `buildHashChain` enlaza cada registro con `previousHash` y `verifyHashChain` recomputa. Ejecuta el lab, luego edita un registro en tu bitácora y vuelve a verificar.

```bash
pnpm lab:hash
```

```text
┌─────────┬───────┬────────────────┬──────────────────┬────────┐
│ (index) │ index │ data           │ previousHash     │ hash   │
├─────────┼───────┼────────────────┼──────────────────┼────────┤
│ 0       │ 0     │ 'A paga 2 a B' │ '000...0' (64)   │ '9f..' │
│ 1       │ 1     │ 'B paga 1 a C' │ '9f..' (hash #0) │ 'c3..' │
└─────────┴───────┴────────────────┴──────────────────┴────────┘
Cadena válida: true
```

- `previousHash` del bloque 0 es 64 ceros (génesis); el del bloque 1 es exactamente el `hash` del bloque 0.
- Si cambias `data` del registro 0 sin reminar, su `hash` recalculado ya no coincide y `verifyHashChain` devuelve `false`.
- **Criterio de aceptación:** explica por qué recalcular solo el hash local no basta: el enlace `previousHash` del siguiente delata la alteración.
- **Error común:** "recalculé el hash y sigue válido" → olvidaste que el bloque siguiente guarda el hash viejo.

## 05 · Árbol y raíz de Merkle

- **Objetivo:** resumir un conjunto de transacciones en una sola raíz.
- **Cómo se resuelve:** `merkleRoot` en [`merkle-tree.mjs`](../01-cryptography/merkle-tree.mjs) hashea cada hoja y combina pares por nivel hasta quedar una raíz. Compara la raíz con 3, 4 y 5 hojas.

```bash
pnpm lab:merkle
```

```text
{
  transactions: [ 'A→B:2', 'B→C:1', 'C→D:0.5' ],
  root: '<64 caracteres hex>'
}
```

- Con número impar de hojas, la última se duplica (`level.push(level.at(-1))`) para poder emparejar.
- La raíz es un único hash de 64 hex: cambiar cualquier hoja cambia la raíz por completo.
- **Criterio de aceptación:** explica la duplicación de hoja impar de esta implementación y su efecto en la raíz.
- **Error común:** esperar raíces iguales con 3 y 4 hojas → el número de hojas y la duplicación cambian el árbol.

## 06 · Prueba de inclusión Merkle

- **Objetivo:** demostrar que un elemento pertenece a la raíz sin revelar los demás.
- **Cómo se resuelve:** `buildProof` recolecta los hermanos con su lado (`left`/`right`); `verifyProof` recompone hasta la raíz. La prueba incluida verifica el índice 2 de `["a","b","c","d","e"]`.

```bash
node --test labs/01-cryptography/merkle-proof.test.mjs
```

```text
✔ verifica inclusión sin revelar todos los elementos
# tests 1
# pass 1
```

- `verifyProof("c", proof, root)` es `true`; `verifyProof("C", proof, root)` es `false`: un solo bit invalida la prueba.
- La prueba solo demuestra pertenencia; no revela el valor de las otras hojas ni su orden.
- **Criterio de aceptación:** identifica qué NO demuestra la prueba (contenido de las demás hojas, posición absoluta).
- **Error común:** invertir `left`/`right` al recomponer → la raíz no cuadra aunque el elemento sí pertenezca.

## 07 · Firma y verificación Ed25519

- **Objetivo:** separar clave, control de clave e identidad legal.
- **Cómo se resuelve:** `signMessage` en [`digital-signature.mjs`](../01-cryptography/digital-signature.mjs) genera un par Ed25519, firma un mensaje y expone `verify`. Prueba a alterar el mensaje verificado.

```bash
node labs/01-cryptography/digital-signature.mjs
```

```text
Mensaje original: true
Mensaje alterado: false
La firma autentica una clave, no una identidad legal.
```

- `verify("Autorizo la práctica local")` es `true` porque es el mensaje firmado; cualquier otro texto da `false`.
- La firma prueba que quien firmó controlaba la clave privada, no quién es esa persona.
- **Criterio de aceptación:** distingue "esta clave firmó" de "esta persona autorizó legalmente".
- **Error común:** asumir identidad → una firma válida solo vincula a una clave, transferible o robable.

## 08 · Amenazas de custodia de claves

- **Objetivo:** modelar riesgos de custodia en tres esquemas de wallet.
- **Cómo se resuelve:**
  1. Modela wallet móvil, hardware wallet y multisig.
  2. Por esquema lista activos, amenazas, controles y plan de recuperación.
  3. Cubre explícitamente pérdida, phishing, malware y coerción física.
- **Estructura de la respuesta:** tabla `esquema | activo | amenaza | control | recuperación` con las cuatro amenazas presentes en cada fila relevante.
- **Criterio de aceptación:** incluye las cuatro amenazas y un plan de recuperación por esquema.
- **Error común:** olvidar coerción ("llave de $5") → el multisig con umbral geográfico es su mitigación.

## 09 · Propagación P2P con retrasos

- **Objetivo:** distinguir propagar un mensaje de acordar un estado.
- **Cómo se resuelve:**
  1. Representa cinco nodos y entrega el mismo mensaje con latencias distintas por enlace.
  2. Registra el orden en que cada nodo lo recibe y su estado intermedio.
  3. Muestra un instante en que los nodos difieren aunque todos acabarán viendo el mensaje.
- **Estructura de la respuesta:** tabla de orden de recepción por nodo + una frase que separe propagación de consenso.
- **Criterio de aceptación:** diferencia propagación (llegar a todos) de consenso (acordar un orden).
- **Error común:** creer que recibir el mensaje ya es acordarlo → falta la regla de decisión.

## 10 · Partición y reconciliación

- **Objetivo:** razonar seguridad y vivacidad ante una partición de red.
- **Cómo se resuelve:**
  1. Divide la red 3/2 y deja que cada lado produzca propuestas en paralelo.
  2. Reconecta y reconcilia eligiendo una rama según una regla explícita (p. ej. más trabajo acumulado).
  3. Decide qué prioriza tu regla: seguridad (no bifurcar) o vivacidad (seguir avanzando).
- **Estructura de la respuesta:** informe con las dos ramas, la regla de reconciliación y la decisión seguridad/vivacidad.
- **Criterio de aceptación:** explica cuándo una rama puede descartarse sin violar seguridad.
- **Error común:** descartar la rama minoritaria sin regla → reorganización arbitraria, no consenso.

## 🧭 Navegación

- Siguiente: [Guías 11–20 · Consenso y Bitcoin](02-consensus-bitcoin.md)
- [Cuaderno de laboratorios](README.md) · [Catálogo](../CATALOG.md) · [Currículo](../../curriculum/README.md)

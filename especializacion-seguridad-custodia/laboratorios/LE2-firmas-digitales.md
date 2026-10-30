# LE2 · Explicar y verificar firmas digitales

> 🧭 [🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE1](LE1-billeteras-de-prueba.md) · ➡️ [LE3 · Transferencias](LE3-transferencias-simuladas.md) · [Bloque 1](../bloques/01-criptografia-asimetrica-y-firmas.md)

**Nivel:** avanzado · **Duración:** 60–90 min · **Código:** [le2-firmas-digitales.mjs](../../labs/especializacion-seguridad/le2-firmas-digitales.mjs) · **Pruebas:** 11

## Prerrequisitos

- LE1 completado y el [bloque 1](../bloques/01-criptografia-asimetrica-y-firmas.md) leído.
- Entender que una firma ECDSA es un par `(r, s)` y que `ecrecover` devuelve una clave pública.

## Teoría

Una firma prueba que quien la produjo conocía la clave privada de una dirección en el momento de firmar **esos bytes exactos**. No prueba identidad, comprensión ni intención, y no caduca. Este laboratorio ejercita cuatro consecuencias:

1. **Verificar = recuperar + comparar.** `ecrecover` siempre devuelve alguna dirección; verificar es compararla con la esperada.
2. **Maleabilidad.** `(r, s)` y `(r, n − s)` validan el mismo mensaje; Ethereum solo acepta la forma `s ≤ n/2`.
3. **Repetición.** Una firma sin contexto sirve en cualquier cadena, contrato o momento. El dominio (cadena, contrato, nonce, caducidad) la ata a un uso.
4. **Fuga por nonce repetido.** Dos firmas con el mismo `k` (mismo `r`) revelan la clave privada.

## Instrucciones

1. Ejecuta el laboratorio y lee las cinco líneas que imprime:

   ```bash
   node labs/especializacion-seguridad/le2-firmas-digitales.mjs
   ```

2. **Firma y verifica.** Con `firmarMensaje` y `verificarFirma`, firma el texto `"Autorizo la práctica LE2"`. Comprueba que verifica contra el firmante y que **no** verifica si cambias una letra del mensaje.
3. **Recupera sin comparar.** Llama a `recuperarFirmante` con un mensaje alterado y comprueba que devuelve una dirección *distinta pero válida*. Anota por qué esto es peligroso en un contrato.
4. **Maleabilidad.** Ejecuta `analizarMaleabilidad` y explica las tres banderas que devuelve.
5. **Dominio.** Construye con `construirMensajeConDominio` un mensaje con cadena, contrato, nonce y caducidad. Pásalo dos veces al verificador y comprueba que la segunda se rechaza.
6. **Fuga de clave.** Firma dos mensajes con `firmarConNonceFijo` y el mismo `k`; recupera la clave con `recuperarClaveDeNonceRepetido`.
7. Ejecuta las pruebas:

   ```bash
   node --test labs/especializacion-seguridad/le2-firmas-digitales.test.mjs
   ```

## Código comentado

- `hashMensajePersonal`: aplica el prefijo EIP-191 con la longitud en **bytes** UTF-8 (no en caracteres: `ñ` ocupa dos).
- `firmarMensaje`: devuelve la firma compacta de 65 bytes `r ‖ s ‖ v`, con `v` en 27 o 28.
- `recuperarFirmante` / `verificarFirma`: separan la recuperación de la comparación.
- `crearGemelaMaleable` / `analizarMaleabilidad`: construyen la firma gemela y comprueban que valida matemáticamente pero Ethereum la rechaza.
- `crearVerificadorConDominio`: rechaza otra cadena, otro contrato, caducidad y repetición de nonce.
- `firmarConNonceFijo` / `recuperarClaveDeNonceRepetido`: **solo demostración**. Resuelven `k = (z₁ − z₂)/(s₁ − s₂)` y `d = (s₁k − z₁)/r`, probando los signos de `s` porque la normalización low-s pudo invertir alguno.

## Pruebas

Las 11 pruebas cubren: firma y verificación; el prefijo con longitud en bytes; mensaje alterado; recuperación que devuelve otra dirección; firma de otra clave; longitud incorrecta; maleabilidad; repetición entre contextos (cadena, contrato, caducidad, nonce); fuga con nonce repetido; ausencia de fuga con nonces distintos; y determinismo RFC 6979.

## Resultados esperados

```text
Verifica contra el firmante: true
Mensaje alterado: false
Maleabilidad: {
  originalEsLowS: true,
  gemelaValidaMatematicamente: true,
  gemelaAceptadaPorEthereum: false,
  leccion: 'Si identificas una transacción por el hash de su firma en vez de por su contenido, la gemela te engaña.'
}
Clave recuperada con nonce repetido: true
```

## Ejercicios adicionales

1. **Bytes frente a caracteres.** Firma `"año"` y `"ano"` y compara los hash. ¿Por qué cambia la longitud del prefijo?
2. **Repetición entre cadenas.** Firma el mismo texto *sin* dominio y *con* dominio para dos `chainId` distintos. ¿En cuál de los casos se puede reutilizar?
3. **Huella del fallo.** Dadas dos firmas, ¿qué comprobación visual delata un nonce repetido sin necesidad de calcular nada?
4. **Defensa.** Explica por qué RFC 6979 evita el fallo aunque el generador aleatorio del sistema sea defectuoso.

## Soluciones

1. `"año"` ocupa 4 bytes UTF-8 y `"ano"` 3, así que el prefijo es `\n4` frente a `\n3` y los hash difieren.
2. Sin dominio, la misma firma sirve en ambas cadenas. Con dominio, el verificador de una cadena rechaza el mensaje de la otra (`"otra cadena"`).
3. Que las dos firmas tengan **el mismo `r`**.
4. Porque `k` se deriva con HMAC de la clave y del mensaje: depende de datos que ya se tienen, no de una fuente aleatoria. Mensajes distintos dan `k` distintos y el mismo mensaje da siempre el mismo `k`.

## 🧭 Navegación

[🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · [⬅️ LE1](LE1-billeteras-de-prueba.md) · ➡️ [LE3 · Transferencias](LE3-transferencias-simuladas.md) · [📖 Glosario](../glosario.md) · [🏠 Programa](../../README.md)

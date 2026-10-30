# LE1 · Crear billeteras de prueba

> 🧭 [🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · ➡️ [LE2 · Firmas digitales](LE2-firmas-digitales.md) · [Bloque 1](../bloques/01-criptografia-asimetrica-y-firmas.md)

**Nivel:** inicial-avanzado · **Duración:** 45–60 min · **Código:** [le1-billeteras-de-prueba.mjs](../../labs/especializacion-seguridad/le1-billeteras-de-prueba.mjs) · **Pruebas:** 8 (más 18 del núcleo criptográfico compartido)

## Prerrequisitos

- Haber leído el [bloque 1](../bloques/01-criptografia-asimetrica-y-firmas.md).
- Node.js 22.12 o superior. **No** necesitas instalar nada más: el laboratorio usa solo la biblioteca estándar de Node.
- Conocer la diferencia entre clave privada, clave pública y dirección ([Wallets desde cero](../../docs/wallets-desde-cero.md)).

## Teoría

Una cuenta de Ethereum es un número secreto `d`. De `d` se obtiene la clave pública `Q = d·G` y, de `Q`, la dirección (los últimos 20 bytes de `keccak256(Q)`). Nada de eso se registra: la cuenta **se calcula**.

Una **billetera de prueba** se define aquí como una cuya clave se **deriva de una etiqueta pública** (`"alice"`). Esa clave la puede recalcular cualquiera, así que no protege nada y es segura en un laboratorio. Una clave real es lo contrario: no se puede recomputar. Esa diferencia se convierte en una comprobación (`verificarEsDePrueba`) que impide mezclar ambos mundos.

El laboratorio también mide la **suma de verificación EIP-55**: cambiar la capitalización de una sola letra de una dirección invalida el checksum.

## Instrucciones

1. Ejecuta el laboratorio:

   ```bash
   node labs/especializacion-seguridad/le1-billeteras-de-prueba.mjs
   ```

2. Observa que la salida **nunca imprime la clave privada** (`••••••••`). Ese es el formato correcto para una bitácora.
3. Ejecuta las pruebas:

   ```bash
   node --test labs/especializacion-seguridad/le1-billeteras-de-prueba.test.mjs labs/especializacion-seguridad/nucleo/nucleo.test.mjs
   ```

4. Abre el código y localiza: la derivación de la clave desde la etiqueta, la comprobación `verificarEsDePrueba` y la medición de errores de checksum.
5. En tu bitácora anota, para cada billetera de la familia `custodio`: etiqueta, dirección y por qué su clave es pública.

## Código comentado

El archivo está comentado línea a línea. Los puntos clave:

- `crearBilleteraDePrueba(etiqueta)`: calcula `sha256(dominio + etiqueta)` y lo reduce al rango válido `[1, n−1]`. El dominio (`blockchain-learning-path/le1/...`) evita que una etiqueta coincida con una clave de otro sistema.
- `verificarEsDePrueba(billetera)`: recalcula la clave desde la etiqueta y la compara. Una clave aleatoria no la supera.
- `crearBilleteraAleatoria()`: usa `crypto.randomBytes` y sirve de **contraste**: su clave no se puede recomputar.
- `describirParaBitacora(billetera)`: devuelve la dirección y censura la clave.
- `medirDeteccionDeErrores(direccion)`: cambia la capitalización de cada letra, una a una, y cuenta cuántas alteraciones detecta el checksum.

El núcleo compartido (`nucleo/`) implementa Keccak-256, secp256k1 y EIP-55 desde cero. Compruébalo contra los vectores públicos: las claves privadas `1`, `2` y `3` producen las direcciones conocidas `0x7E5F…5Bdf`, `0x2B5A…D6cF` y `0x6813…BA69`.

## Pruebas

| Prueba | Qué garantiza |
|---|---|
| Misma etiqueta, misma billetera | Reproducibilidad entre equipos |
| Dirección válida con checksum | El cálculo de Keccak y EIP-55 es correcto |
| Una de prueba se recomputa; una aleatoria no | La frontera entre clave pública-derivada y secreta |
| Clave que no corresponde a su etiqueta se rechaza | No se puede disfrazar una clave real de prueba |
| Etiqueta vacía se rechaza | Validación de entrada |
| Familia con direcciones distintas y tamaño validado | Límites del generador |
| La bitácora no incluye la clave | Higiene de evidencia |
| El checksum detecta todas las alteraciones de una letra | EIP-55 funciona como se afirma |

## Resultados esperados

```text
{ etiqueta: 'custodio-1', direccion: '0x1B331fdcc4cD819291927005673F24Ebe7897F0d', clavePrivada: '••••••••', esDePrueba: true }
{ etiqueta: 'custodio-2', direccion: '0x5B038e57765F488ac6D64C2363405309fbd1B97d', ... }
{ etiqueta: 'custodio-3', direccion: '0xCC3981358ef68168de38BD9803F10Caa7fd2643C', ... }

¿'alice' es de prueba? true
¿Una aleatoria es de prueba? false
Checksum EIP-55 (mutaciones de mayúscula detectadas): { mutaciones: 14, detectadas: 14 }
```

Las direcciones de las billeteras de prueba son **idénticas en cualquier equipo**. La billetera aleatoria cambia en cada ejecución.

## Ejercicios adicionales

1. **Familia propia.** Crea una familia `tesoreria` de cuatro billeteras y comprueba que ninguna dirección se repite.
2. **Cambio de dominio.** Cambia la constante `DOMINIO` y observa qué ocurre con las direcciones. ¿Qué dice esto sobre por qué una etiqueta pública no basta como secreto?
3. **Cuenta de letras.** Predice cuántas mutaciones medirá `medirDeteccionDeErrores` para `"bob"` sin ejecutarlo.
4. **Colisiones.** Escribe una prueba que genere 1 000 etiquetas distintas y verifique que no hay direcciones repetidas.

## Soluciones

1. `crearFamilia("tesoreria", 4)` devuelve cuatro billeteras; `new Set(familia.map(b => b.direccion)).size === 4`.
2. Todas las direcciones cambian: la clave depende del dominio. Quien conozca el dominio y la etiqueta recalcula la clave, así que la derivación **no aporta ningún secreto**: solo reproducibilidad.
3. Es el número de caracteres alfabéticos (`a`–`f`) de la dirección, porque los dígitos no tienen mayúscula. Cuéntalos en la dirección de `bob` y compara con la medición.
4. `const dirs = new Set(Array.from({length: 1000}, (_, i) => crearBilleteraDePrueba("e" + i).direccion)); assert.equal(dirs.size, 1000)`.

## 🧭 Navegación

[🧪 Laboratorios](README.md) · [🛡️ Especialización](../README.md) · ➡️ [LE2 · Firmas digitales](LE2-firmas-digitales.md) · [📖 Glosario](../glosario.md) · [🏠 Programa](../../README.md)

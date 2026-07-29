# 01 · Criptografía aplicada

> **Nivel:** Inicial · ⏱️ **Duración estimada:** 120 min · **Fuente:** *Serious Cryptography* (Aumasson) y *Introduction to Modern Cryptography* (Katz, Lindell)
> [⬅️ Currículo](../README.md) · [📚 Bibliografía](../../docs/bibliografia.md)

---

## 🎯 Objetivos

- Explicar las propiedades de una función hash: resistencia a preimagen, a colisiones y efecto avalancha.
- Diferenciar cifrado (confidencialidad) de firma digital (autenticación e integridad).
- Construir y verificar una prueba de inclusión sobre un árbol de Merkle.
- Identificar los riesgos operativos de la gestión de claves privadas.
- Justificar por qué un hash rápido es inadecuado para almacenar contraseñas.

## 📚 Resultados de aprendizaje

Al finalizar, el estudiante podrá:

1. **Describir** qué garantiza y qué no garantiza una función hash criptográfica.
2. **Distinguir** una firma digital de un cifrado, y clave pública de clave privada.
3. **Generar** una raíz de Merkle y **verificar** una prueba de inclusión.
4. **Diagnosticar** vulnerabilidades por reutilización de claves o aleatoriedad débil.
5. **Seleccionar** la primitiva adecuada (SHA-256, Keccak-256, ECDSA, Argon2) según el objetivo.

## 🗺️ Temas

| # | Tema | Por qué importa |
|---|------|-----------------|
| 1 | Funciones hash | Detectan cualquier cambio en los datos y anclan la integridad. |
| 2 | Preimagen y colisiones | Definen la seguridad real de un hash frente a ataques. |
| 3 | Criptografía asimétrica | Permite firmar y verificar sin compartir secretos. |
| 4 | Firmas ECDSA (secp256k1) | Es el esquema de firma usado por Bitcoin y Ethereum. |
| 5 | Árboles de Merkle | Resumen muchos elementos con pruebas pequeñas y verificables. |
| 6 | Derivación de contraseñas | Un hash rápido es inseguro; se necesitan funciones lentas. |
| 7 | Gestión de claves | La mayoría de los incidentes reales nacen de claves mal manejadas. |

## 🧠 Modelo mental

Imagina un sello de lacre sobre un sobre. El hash es como una huella del contenido: si alguien altera una sola letra, la huella cambia por completo (efecto avalancha) y se nota la manipulación. La firma digital es como un sello personal imposible de falsificar sin tu anillo (clave privada), que cualquiera puede reconocer con la impronta pública. El árbol de Merkle es como un índice que permite probar que una carta está dentro de un archivo enorme mostrando solo unos pocos sellos, sin abrir todas las cajas.

El límite de la analogía es que ninguna de estas primitivas decide qué historia es la verdadera. El hash detecta cambios pero no dice cuál versión debe prevalecer; la firma prueba quién autorizó un mensaje pero no si ese mensaje es la transacción correcta del sistema. Ordenar y validar el historial es tarea del consenso (módulo 03), no de la criptografía por sí sola.

## 📖 Conceptos y definiciones

- **Función hash criptográfica**: transforma datos de longitud arbitraria en un valor fijo; ejemplo: SHA-256, Keccak-256.
- **Resistencia a preimagen**: dado un hash, es inviable hallar una entrada que lo produzca.
- **Resistencia a colisiones**: es inviable hallar dos entradas distintas con el mismo hash.
- **Efecto avalancha**: un cambio mínimo en la entrada altera radicalmente la salida.
- **Clave pública / privada**: par asimétrico; la privada firma y descifra, la pública verifica y cifra.
- **Firma digital**: prueba de que el poseedor de una clave privada autorizó un mensaje concreto; ejemplo: ECDSA sobre secp256k1.
- **Cifrado**: protege la confidencialidad; no garantiza por sí solo autenticidad.
- **Árbol de Merkle**: árbol binario de hashes cuya raíz resume todo el conjunto de hojas.
- **Prueba de inclusión**: conjunto mínimo de hashes que demuestra que un elemento pertenece al árbol.
- **KDF (Argon2, bcrypt)**: función lenta y con sal para derivar claves de contraseñas y frenar la fuerza bruta.

## 🧪 Laboratorio guiado

1. Ejecuta el laboratorio de hashing y observa el efecto avalancha al cambiar un byte:

```bash
pnpm lab:hash
```

2. Ejecuta el laboratorio de árboles de Merkle para construir una raíz y una prueba de inclusión:

```bash
pnpm lab:merkle
```

3. Modifica una transacción de una hoja y vuelve a calcular la raíz; anota cómo cambia respecto de la original.
4. Verifica que una prueba de inclusión válida deja de serlo tras la modificación.
5. Ejecuta la batería de pruebas del repositorio para confirmar tu implementación:

```bash
pnpm test
```

## 📝 Reto verificable

Toma un conjunto de transacciones, construye su raíz de Merkle, altera una transacción y documenta el cambio de raíz junto con una prueba de inclusión antes y después.

**Criterio de aceptación:** demuestras que al modificar una transacción cambia la raíz de Merkle y que la prueba de inclusión original ya no valida contra la nueva raíz; `pnpm test` pasa sin errores.

## ⚠️ Errores frecuentes

| Síntoma | Causa y cómo comprobarlo |
|---------|--------------------------|
| Confundir cifrar con firmar | Usas la primitiva equivocada; verifica si buscas confidencialidad o autenticación. |
| Contraseñas con SHA-256 "a secas" | Hash rápido sin sal; comprueba tiempo de cómputo y adopta Argon2/bcrypt. |
| Firmar bytes distintos a lo mostrado | La interfaz muestra algo y firmas otra cosa; compara el mensaje real byte a byte. |
| Reutilizar el nonce en ECDSA | Aleatoriedad débil filtra la clave privada; revisa la fuente de entropía. |
| Tratar una dirección como identidad legal | Una dirección es un pseudónimo; no prueba quién es la persona. |

## 🛡️ Seguridad y ética

- Trabaja solo en local o testnet; nunca uses claves privadas ni fondos reales en el laboratorio.
- Genera claves de práctica desechables y no las reutilices fuera del ejercicio.
- Nunca subas claves privadas, semillas ni archivos `.env` al control de versiones.
- Usa siempre aleatoriedad criptográficamente segura para generar claves y nonces.
- Recuerda que la seudonimia no es anonimato: las direcciones son trazables en cadena.

## 🔗 Referencias

- Jean-Philippe Aumasson, *Serious Cryptography*, 2.ª ed. — <https://nostarch.com/serious-cryptography-2nd-edition>
- Jonathan Katz y Yehuda Lindell, *Introduction to Modern Cryptography* — <https://www.cs.umd.edu/~jkatz/imc.html>
- Ferguson, Schneier y Kohno, *Cryptography Engineering* — <https://www.schneier.com/books/cryptography-engineering/>
- Fuente primaria: NIST, FIPS 180-4 *Secure Hash Standard (SHA)* — <https://csrc.nist.gov/>

## ✅ Criterio de dominio

- Construyes y verificas una prueba de Merkle y explicas cómo cambia la raíz ante una alteración.
- Distingues correctamente cifrado de firma y justificas la primitiva elegida.
- Argumentas por qué las contraseñas requieren una KDF lenta en lugar de un hash rápido.

---

## 🧭 Navegación

⬅️ [Módulo 00 · Orientación](../00-orientacion/README.md) · [📚 Índice del currículo](../README.md) · ➡️ [Módulo 02 · Sistemas distribuidos y redes P2P](../02-sistemas-distribuidos/README.md)

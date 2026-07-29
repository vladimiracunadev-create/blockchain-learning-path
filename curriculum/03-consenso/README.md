# 03 · Consenso

> **Nivel:** Intermedio · ⏱️ **Duración estimada:** 120 min · **Fuente:** whitepaper de Bitcoin (Nakamoto) y *Practical Byzantine Fault Tolerance* (Castro, Liskov)
> [⬅️ Currículo](../README.md) · [📚 Bibliografía](../../docs/bibliografia.md)

---

## 🎯 Objetivos

- Comparar Proof of Work, Proof of Stake, BFT y Proof of Authority más allá de energía y velocidad.
- Explicar la regla de la cadena más larga de Nakamoto y su finalidad probabilística.
- Describir el consenso de Ethereum tras The Merge (Casper FFG + LMD-GHOST, Gasper) y el slashing.
- Relacionar la cota 3f+1 de PBFT con la tolerancia a fallos bizantinos.
- Distinguir el recurso anti-Sybil de cada mecanismo y su tipo de finalidad.

## 📚 Resultados de aprendizaje

Al finalizar, el estudiante podrá:

1. **Comparar** cuatro mecanismos de consenso según recurso anti-Sybil, finalidad y uso típico.
2. **Explicar** por qué la regla de la cadena más larga ofrece finalidad probabilística.
3. **Describir** cómo el slashing genera finalidad económica en Ethereum PoS.
4. **Justificar** la cota 3f+1 de PBFT para tolerar f nodos bizantinos.
5. **Interpretar** un laboratorio de PoW sin confundirlo con la seguridad de una red real.

## 🗺️ Temas

| # | Tema | Por qué importa |
|---|------|-----------------|
| 1 | Problema del consenso | Acordar un único historial entre partes que no confían entre sí. |
| 2 | Proof of Work | Ancla la seguridad en cómputo y energía; base de Bitcoin. |
| 3 | Cadena más larga (Nakamoto) | Define cómo se resuelven las bifurcaciones sin autoridad. |
| 4 | Proof of Stake (Ethereum) | Ancla la seguridad en capital bloqueado y penalizaciones. |
| 5 | Casper FFG + LMD-GHOST (Gasper) | Combina elección de cadena con finalidad periódica. |
| 6 | PBFT y cota 3f+1 | Da finalidad rápida en conjuntos conocidos de validadores. |
| 7 | Proof of Authority | Consenso por identidades autorizadas en redes permisionadas. |

## 🧠 Modelo mental

Piensa en el consenso como el modo en que una multitud sin líder decide cuál de dos relatos contradictorios es el oficial. En Proof of Work la multitud "vota" gastando trabajo real: la versión respaldada por más esfuerzo acumulado gana, y rehacerla costaría repetir todo ese esfuerzo. En Proof of Stake los validadores ponen un depósito y firman la historia; si mienten pierden su depósito (slashing), de modo que la honestidad es la opción económicamente racional. En PBFT un grupo conocido vota en rondas y basta que más de dos tercios sean honestos para fijar el resultado de inmediato.

El límite de la analogía del "voto" es que no se trata de personas iguales: el peso proviene del recurso escaso (cómputo, capital o pertenencia autorizada), que es justamente el mecanismo anti-Sybil. Además, no todos los mecanismos dan el mismo tipo de garantía: la cadena más larga ofrece finalidad probabilística (cada bloque adicional reduce la probabilidad de reversión), mientras que Gasper y PBFT ofrecen finalidad explícita una vez alcanzado el quórum.

## 📖 Conceptos y definiciones

- **Mecanismo de consenso**: reglas para que nodos independientes acuerden un mismo historial.
- **Recurso anti-Sybil**: bien escaso que da peso a un participante (cómputo, capital o identidad autorizada).
- **Proof of Work (PoW)**: se compite resolviendo un puzle de hash; el ganador propone el bloque.
- **Regla de la cadena más larga**: se sigue la cadena con más trabajo acumulado; base de la finalidad probabilística.
- **Proof of Stake (PoS)**: los validadores depositan capital y son elegidos para proponer y atestiguar bloques.
- **Slashing**: penalización que confisca parte del depósito ante conductas maliciosas; sostiene la finalidad económica.
- **Gasper**: combinación de Casper FFG (finalidad) y LMD-GHOST (elección de cadena) usada por Ethereum.
- **PBFT**: protocolo que tolera f nodos bizantinos con al menos 3f+1 participantes y da finalidad inmediata.
- **Proof of Authority (PoA)**: validadores identificados y autorizados firman bloques; típico en redes permisionadas.
- **The Merge (2022)**: transición de Ethereum de PoW a PoS; desde entonces Ethereum es Proof of Stake.

## 🧪 Laboratorio guiado

1. Ejecuta el laboratorio pedagógico de Proof of Work:

```bash
pnpm lab:pow
```

2. Observa cuántos intentos (nonces) se requieren para hallar un hash bajo el objetivo con la dificultad inicial.
3. Aumenta la dificultad un nivel y vuelve a ejecutar; registra intentos y tiempo transcurrido.
4. Repite con varios niveles y tabula la relación entre dificultad, intentos y tiempo:

```text
Dificultad | Intentos promedio | Tiempo (s)
-----------|-------------------|-----------
1          | ...               | ...
2          | ...               | ...
3          | ...               | ...
```

5. Concluye cómo escala el costo con la dificultad, recordando que este laboratorio es pedagógico y no representa la seguridad real de una red en producción.

## 📝 Reto verificable

Completa la tabla de dificultad frente a intentos y tiempo con al menos tres niveles y redacta una breve interpretación del crecimiento observado.

**Criterio de aceptación:** muestras que al aumentar la dificultad crece de forma marcada el número de intentos y el tiempo esperado, y declaras explícitamente que el laboratorio no modela la seguridad de una red real (número de mineros, hashrate global ni incentivos).

## ⚠️ Errores frecuentes

| Síntoma | Causa y cómo comprobarlo |
|---------|--------------------------|
| Reducir el consenso a "energía vs. velocidad" | Ignoras recurso anti-Sybil y finalidad; compara las tres dimensiones. |
| Creer que Ethereum sigue en PoW | Desde The Merge (2022) es PoS; verifica en la documentación oficial. |
| Confundir finalidad probabilística con inmediata | En PoW la reversión disminuye con el tiempo; en Gasper/PBFT hay finalidad explícita. |
| Pensar que el laboratorio mide seguridad real | Es pedagógico; no incluye hashrate global ni incentivos económicos. |
| Suponer que PoS elimina toda centralización | El capital puede concentrarse; analiza la distribución de validadores. |

## 🛡️ Seguridad y ética

- Ejecuta el laboratorio solo en local; no uses claves ni fondos reales ni conectes a redes de producción.
- No presentes resultados del laboratorio como evidencia de la seguridad de una red pública.
- Reconoce las compensaciones de cada mecanismo (costo energético, concentración de capital, permisos).
- Evita el fraude de simplificación: comunica los supuestos y límites de cualquier comparación.
- Considera el impacto ambiental y de gobernanza al recomendar un mecanismo.

## 🔗 Referencias

- Fuente primaria: Satoshi Nakamoto, *Bitcoin: A Peer-to-Peer Electronic Cash System* — <https://bitcoin.org/bitcoin.pdf>
- Miguel Castro y Barbara Liskov, *Practical Byzantine Fault Tolerance*, OSDI 1999 — <https://pmg.csail.mit.edu/papers/osdi99.pdf>
- Buterin y Griffith, *Casper the Friendly Finality Gadget* — <https://arxiv.org/abs/1710.09437>
- ethereum.org, documentación sobre Proof of Stake — <https://ethereum.org/developers/docs/consensus-mechanisms/pos/>

## ✅ Criterio de dominio

- Entregas la tabla de dificultad e interpretas el crecimiento del costo.
- Comparas los cuatro mecanismos por recurso anti-Sybil, finalidad y uso típico.
- Explicas la diferencia entre finalidad probabilística y económica con ejemplos actuales.

---

## 🧭 Navegación

⬅️ [Módulo 02 · Sistemas distribuidos y redes P2P](../02-sistemas-distribuidos/README.md) · [📚 Índice del currículo](../README.md) · ➡️ [Módulo 04 · Bitcoin](../04-bitcoin/README.md)

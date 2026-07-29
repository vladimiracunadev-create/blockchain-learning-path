# 12 · Escalabilidad y capas 2

> **Nivel:** Avanzado · ⏱️ **Duración estimada:** 150 min · **Fuente:** *An Incomplete Guide to Rollups* (Buterin) y L2BEAT
> [⬅️ Currículo](../README.md) · [📚 Bibliografía](../../docs/bibliografia.md)

---

## 🎯 Objetivos

- Distinguir seis familias de escalado (canales, sidechains, optimistic rollups, ZK rollups, validiums y appchains) según dónde ejecutan y dónde publican datos.
- Comparar mecanismos de prueba de estado inválido: fraud proofs frente a validity/ZK proofs, con sus implicaciones de latencia y confianza.
- Evaluar la disponibilidad de datos (DA) de un diseño y explicar cómo EIP-4844 redujo su costo desde 2024.
- Analizar el riesgo de secuenciación, censura y retiro, incluyendo el challenge period y los mecanismos de escape.
- Argumentar por qué el TPS aislado no mide seguridad ni experiencia de usuario.

## 📚 Resultados de aprendizaje

Al finalizar, el estudiante podrá:

1. **Clasificar** una solución de capa 2 real según ejecución, publicación de datos y modelo de prueba.
2. **Comparar** optimistic y ZK rollups en tiempo de retiro, supuestos criptográficos y costo.
3. **Explicar** el papel de los blobs de EIP-4844 en el costo de DA y por qué el danksharding completo aún es roadmap.
4. **Identificar** los vectores de censura asociados a un secuenciador centralizado y sus mitigaciones.
5. **Evaluar** un puente L1↔L2 distinguiendo mensajes canónicos de puentes de liquidez de terceros.
6. **Justificar** por qué la seguridad de un rollup depende de la capa 1 y de la disponibilidad de datos, no solo del rendimiento.

## 🗺️ Temas

| # | Tema | Por qué importa |
|---|------|-----------------|
| 1 | Ejecución fuera de cadena vs. publicación en L1 | Define cuánta seguridad se hereda de Ethereum |
| 2 | Optimistic rollups y fraud proofs | El challenge period (~7 días) determina el tiempo de retiro seguro |
| 3 | ZK rollups y validity proofs | La prueba de validez habilita finalidad rápida sin periodo de disputa |
| 4 | Validiums y DA fuera de cadena | Sacrifican garantías de datos por costo; cambian el modelo de confianza |
| 5 | Disponibilidad de datos y EIP-4844 | Los blobs abarataron drásticamente publicar datos de rollup en 2024 |
| 6 | Secuenciador y riesgo de censura | Quién ordena las transacciones condiciona neutralidad y liveness |
| 7 | Puentes, forced inclusion y escape hatch | Determinan si el usuario puede salir sin permiso del operador |
| 8 | Appchains y soberanía | Ceden componibilidad a cambio de control y espacio de bloque propio |

## 🧠 Modelo mental

Piensa en la capa 1 como un juzgado lento pero incorruptible y en cada capa 2 como una oficina que tramita miles de acuerdos y solo lleva al juzgado un resumen. Un optimistic rollup entrega ese resumen dando por buena la palabra del operador, salvo que alguien presente pruebas de fraude dentro del plazo de impugnación; un ZK rollup adjunta un certificado matemático que el juzgado verifica de inmediato. En ambos casos, los datos que respaldan el resumen deben quedar disponibles para que cualquiera pueda reconstruir el estado y ejercer su defensa.

La analogía tiene límites: el "juzgado" no revisa cada caso, solo verifica pruebas o espera impugnaciones, y su garantía se evapora si los datos no están disponibles. Por eso la disponibilidad de datos es el eje del diseño, y por eso comparar cadenas solo por TPS es como juzgar un tribunal por cuántos papeles archiva sin mirar si sus sentencias son ejecutables.

## 📖 Conceptos y definiciones

- **Rollup**: esquema que ejecuta transacciones fuera de la L1 y publica en ella datos y compromisos de estado; hereda seguridad si los datos están disponibles.
- **Optimistic rollup**: asume que las transiciones son válidas y las revierte solo si un fraud proof lo demuestra dentro del challenge period (~7 días).
- **ZK rollup**: acompaña cada lote con una validity proof (SNARK/STARK) que la L1 verifica, habilitando finalidad sin periodo de disputa.
- **Validium**: como un ZK rollup pero con datos fuera de la L1; reduce costo a cambio de un supuesto adicional de disponibilidad de datos.
- **Disponibilidad de datos (DA)**: garantía de que los datos de cada lote son recuperables por cualquiera para reconstruir y auditar el estado.
- **EIP-4844 (blobs)**: mecanismo de Dencun (2024) que añadió espacio de datos efímero y barato para rollups; el danksharding completo lo amplía y sigue en roadmap.
- **Secuenciador (sequencer)**: componente que ordena y agrupa transacciones; si es único puede censurar o reordenar, salvo mecanismos de inclusión forzada.
- **Challenge period**: ventana durante la cual se pueden impugnar transiciones de un optimistic rollup; retrasa los retiros hacia la L1.
- **Forced inclusion / escape hatch**: rutas que permiten al usuario incluir transacciones o retirar fondos aun si el operador se niega a cooperar.
- **Appchain**: cadena dedicada a una aplicación; gana control y capacidad a cambio de componibilidad y, a veces, de seguridad compartida.

## 🧪 Laboratorio guiado

Este módulo es un ejercicio comparativo de análisis, sin código de repositorio. Consulta el índice de prácticas del curso en [laboratorios](../../labs/CATALOG.md).

1. Elige tres soluciones de capa 2 reales de distinta familia (por ejemplo un optimistic rollup, un ZK rollup y un validium).
2. Para cada una, abre L2BEAT y anota su categoría, su modelo de datos y sus riesgos declarados; recuerda que las cifras cambian, consúltalo en vivo.

```text
Dimensión            | L2 A        | L2 B        | L2 C
---------------------+-------------+-------------+-------------
Dónde ejecuta        | ...         | ...         | ...
Dónde publica datos  | ...         | ...         | ...
Prueba de estado     | fraude/ZK   | fraude/ZK   | fraude/ZK
Secuenciador         | ...         | ...         | ...
Tiempo de retiro     | ...         | ...         | ...
Escape hatch         | sí/no       | sí/no       | sí/no
```

3. Registra el tipo de prueba (fraud vs. validity) y el tiempo de retiro estimado de cada opción.
4. Verifica en L2BEAT si la DA es on-chain (blobs/calldata) o externa, e indica el supuesto de confianza que introduce.
5. Redacta una conclusión de un párrafo sobre cuál ofrece mejores garantías de salida sin permiso y por qué.

## 📝 Reto verificable

Entrega una tabla comparativa de las tres soluciones más un informe breve que responda, para cada una: dónde se ejecuta, dónde se publican los datos, cómo se prueba un estado inválido, quién secuencia y cuánto tarda un retiro seguro.

**Criterio de aceptación:** la tabla incluye las seis dimensiones del laboratorio para las tres soluciones, cada afirmación de datos en vivo se marca como "consúltalo en vivo" con su fuente (L2BEAT), y el informe justifica por qué el TPS no basta para evaluar seguridad.

## ⚠️ Errores frecuentes

| Síntoma | Causa y cómo comprobarlo |
|---------|--------------------------|
| Afirmar que un rollup es seguro "porque usa ZK" | Se ignora la DA; comprueba en L2BEAT si los datos están on-chain o en un comité externo |
| Comparar cadenas solo por TPS | Se confunde rendimiento con seguridad; contrasta modelo de prueba y de datos, no solo throughput |
| Suponer retiros instantáneos en optimistic rollups | Existe un challenge period (~7 días); revísalo en la documentación del proyecto |
| Tratar un puente de liquidez como el puente canónico | Son distintos; verifica si el retiro pasa por el contrato oficial de la L1 |
| Dar por hecho el danksharding completo | Hoy solo hay blobs (EIP-4844); el sharding de datos completo sigue en roadmap |
| Ignorar la centralización del secuenciador | Un secuenciador único puede censurar; busca si existe inclusión forzada |

## 🛡️ Seguridad y ética

- Trabaja siempre en local o testnet; no muevas fondos reales ni uses claves privadas reales durante el análisis.
- No firmes transacciones ni conectes wallets con activos a exploradores o dApps mientras investigas.
- Cita las cifras de rendimiento y coste como observaciones datadas ("consúltalo en vivo"); nunca las presentes como constantes.
- Distingue el marketing del proyecto de sus garantías verificables; apóyate en fuentes independientes como L2BEAT.
- Reconoce el conflicto de interés: quien opera un secuenciador puede extraer valor del orden de las transacciones.

## 🔗 Referencias

- Buterin, V., *An Incomplete Guide to Rollups* — <https://vitalik.eth.limo/general/2021/01/05/rollup.html>
- ethereum.org, documentación de escalado — <https://ethereum.org/developers/docs/scaling/>
- L2BEAT, riesgos y estado de las capas 2 (datos en vivo) — <https://l2beat.com/>
- Fuente primaria: EIP-4844 (Shard Blob Transactions) — <https://eips.ethereum.org/EIPS/eip-4844>

## ✅ Criterio de dominio

- Explicas, sin notas, cómo un optimistic y un ZK rollup prueban su estado y por qué difieren en tiempo de retiro.
- Argumentas el papel de la disponibilidad de datos y de EIP-4844 en la seguridad y el coste de un rollup.
- Detectas cuándo una comparación por TPS oculta diferencias reales de confianza.

---

## 🧭 Navegación

⬅️ [Módulo 11 · DAO y gobernanza](../11-dao-gobernanza/README.md) · [📚 Índice del currículo](../README.md) · ➡️ [Módulo 13 · Interoperabilidad y ecosistemas](../13-interoperabilidad/README.md)

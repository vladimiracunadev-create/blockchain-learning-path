# Guía conceptual para revisión

No es un solucionario para copiar. Entrega criterios con los que el estudiante puede contrastar su razonamiento.

- Un hash prueba consistencia respecto de una entrada, no verdad, autoría o disponibilidad.
- Una firma prueba control de una clave sobre bytes concretos; la interfaz y el dominio forman parte del problema.
- Una Merkle proof prueba inclusión respecto de una raíz aceptada; queda por justificar quién aceptó esa raíz.
- Consenso coordina el historial; replicación y propagación por sí solas no resuelven participantes bizantinos.
- En UTXO debe conservarse valor y distinguir receptor, cambio y comisión sin asignar identidad por intuición.
- Una estimación de gas depende de estado, calldata y condiciones de inclusión.
- Las invariantes describen propiedades del sistema completo, no ejemplos puntuales.
- CEI y guardas reducen reentrancia, pero deben revisarse llamadas cruzadas y dependencias externas.
- Un oráculo firmado puede seguir siendo incorrecto, obsoleto o capturado.
- Multisig reduce dependencia de una clave; timelock ofrece tiempo de observación; ninguno corrige una mala decisión.
- Un rollup añade confianza en secuenciación, disponibilidad y puentes aunque herede verificación de una L1.
- ZK minimiza revelación del enunciado diseñado, no toda correlación externa.
- Tokenomics debe analizar derechos, concentración, emisión, demanda, salida y gobernanza; una curva no demuestra sostenibilidad.

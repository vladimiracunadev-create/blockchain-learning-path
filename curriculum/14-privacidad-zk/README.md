# 14 · Privacidad y zero knowledge

> **Nivel:** Avanzado · ⏱️ **Duración estimada:** 180 min · **Fuente:** *Proofs, Arguments, and Zero-Knowledge* (Thaler) y ZKProof Community Reference
> [⬅️ Currículo](../README.md) · [📚 Bibliografía](../../docs/bibliografia.md)

---

## 🎯 Objetivos

- Definir con precisión compromiso, witness, circuito, prover y verifier dentro de un sistema de conocimiento cero.
- Diferenciar SNARK y STARK en tamaño de prueba, tiempo, setup, supuestos criptográficos y resistencia post-cuántica.
- Explicar qué garantiza y qué no garantiza un trusted setup, y qué aportan los setups universales o transparentes.
- Diseñar conceptualmente una prueba de "soy mayor de 18 años" que no revele la fecha de nacimiento.
- Reconocer que ZK protege el enunciado, pero no elimina automáticamente metadatos ni problemas del mundo real.

## 📚 Resultados de aprendizaje

Al finalizar, el estudiante podrá:

1. **Explicar** las propiedades de completitud, solidez y conocimiento cero en términos de prover y verifier.
2. **Comparar** SNARK y STARK y justificar cuál conviene según setup, tamaño y supuestos.
3. **Diseñar** el enunciado de un circuito de credencial de edad identificando entradas públicas y privadas.
4. **Identificar** quién certifica el dato inicial y qué información sigue expuesta como metadato.
5. **Distinguir** entre setup confiable, universal y transparente y sus implicaciones de confianza.
6. **Evaluar** cómo se revoca una credencial ZK sin comprometer la privacidad del titular.

## 🗺️ Temas

| # | Tema | Por qué importa |
|---|------|-----------------|
| 1 | Prover, verifier y las tres propiedades | Fijan qué significa "probar sin revelar" |
| 2 | Circuito, witness y entradas públicas/privadas | Definen qué se demuestra y qué queda oculto |
| 3 | Compromisos (commitments) | Permiten fijar un valor sin revelarlo hasta después |
| 4 | Trusted setup vs. universal vs. transparente | Determina cuánta confianza inicial exige el sistema |
| 5 | SNARK vs. STARK | Compensan tamaño, tiempo, supuestos y post-cuántico |
| 6 | Credenciales selectivas (prueba de edad) | Caso canónico de minimizar la información revelada |
| 7 | Metadatos y desanonimización | ZK no oculta patrones de red, tiempos ni montos por defecto |
| 8 | Aplicaciones: rollups ZK, privacidad, identidad | Muestran el alcance real y sus límites regulatorios |

## 🧠 Modelo mental

Una prueba de conocimiento cero es como demostrar que conoces la contraseña de una puerta abriéndola frente a un testigo, sin pronunciar la contraseña. El prover convence al verifier de que una afirmación es cierta —"esta persona tiene más de 18 años"— entregando solo una prueba compacta, mientras que el dato sensible (la fecha de nacimiento) permanece como witness privado del circuito. La completitud asegura que las afirmaciones ciertas se aceptan, la solidez que las falsas no, y el conocimiento cero que nada más se filtra del enunciado.

La analogía tiene un límite crucial: aunque no digas la contraseña, el testigo ve a qué hora llegaste, cuántas veces lo intentaste y qué puerta usaste. Igual ocurre con ZK: protege el contenido del enunciado, pero los metadatos —quién emitió la credencial, cuándo se usó, desde qué dirección— pueden seguir revelando información. Además, el sistema hereda un problema del mundo real: alguien debe certificar honestamente el dato inicial, y ZK no verifica esa verdad de origen.

## 📖 Conceptos y definiciones

- **Zero knowledge**: propiedad por la cual una prueba convence de la verdad de un enunciado sin revelar nada más allá de su validez.
- **Prover**: parte que posee el witness y genera la prueba; carga el mayor coste computacional del sistema.
- **Verifier**: parte que comprueba la prueba con las entradas públicas; en cadena suele ser un contrato barato de ejecutar.
- **Circuito**: representación de la computación a probar como conjunto de restricciones que el witness debe satisfacer.
- **Witness**: entrada privada (por ejemplo la fecha de nacimiento) que satisface el circuito sin hacerse pública.
- **Compromiso (commitment)**: valor que fija un dato ocultándolo, con la posibilidad de abrirlo después de forma verificable.
- **Trusted setup**: fase que genera parámetros públicos; si los secretos ("toxic waste") no se destruyen, se podrían falsificar pruebas.
- **Setup universal/transparente**: alternativas que reutilizan el setup para muchos circuitos o lo eliminan usando solo aleatoriedad pública.
- **SNARK**: prueba sucinta y de verificación rápida; suele requerir setup y apoyarse en supuestos de curvas elípticas, no post-cuánticos.
- **STARK**: prueba transparente y post-cuántica basada en hashes, con pruebas mayores pero sin trusted setup.

## 🧪 Laboratorio guiado

Este módulo es un diseño conceptual de circuito, sin código de repositorio. Consulta el índice de prácticas del curso en [laboratorios](../../labs/CATALOG.md).

1. Define el enunciado exacto a probar: "la persona nació antes de una fecha umbral" sin revelar la fecha real.
2. Separa las señales del circuito en públicas y privadas, y anota qué recibe el verifier.

```text
Elemento del circuito        | Tipo      | Visible para el verifier
-----------------------------+-----------+-------------------------
Fecha de nacimiento          | privada   | no
Fecha umbral (hoy - 18 años) | pública   | sí
Firma del emisor de la credencial | pública/compromiso | sí (compromiso)
Resultado (edad >= 18)       | pública   | sí
```

3. Identifica quién certifica el dato inicial (el emisor de la credencial) y cómo el circuito verifica su firma sin exponer la fecha.
4. Enumera qué metadatos siguen filtrando información (emisor, momento de uso, dirección) y cómo se revocaría la credencial.

## 📝 Reto verificable

Entrega el diseño conceptual completo de la prueba de mayoría de edad: enunciado, tabla de señales públicas/privadas, actor que certifica el dato, metadatos residuales y un mecanismo de revocación.

**Criterio de aceptación:** el documento indica explícitamente qué dato queda oculto (la fecha de nacimiento), qué recibe el verifier, quién certifica el dato inicial, al menos dos metadatos que siguen expuestos y un método de revocación que no revela la identidad del titular.

## ⚠️ Errores frecuentes

| Síntoma | Causa y cómo comprobarlo |
|---------|--------------------------|
| Creer que ZK anonimiza todo | Solo oculta el enunciado; revisa qué metadatos (tiempos, direcciones) siguen visibles |
| Ignorar el trusted setup | Si el toxic waste no se destruye, se falsifican pruebas; comprueba si el setup es transparente |
| Confundir witness con entrada pública | El witness debe ser privado; verifica qué señales expone el circuito al verifier |
| Suponer que ZK valida la verdad de origen | El circuito prueba una relación, no que el emisor certificó bien; identifica al certificador |
| Elegir SNARK/STARK por moda | Depende de setup, tamaño y post-cuántico; contrasta requisitos reales del caso |
| Olvidar la revocación | Una credencial sin revocación queda válida para siempre; diseña el mecanismo desde el inicio |

## 🛡️ Seguridad y ética

- Todo el diseño es conceptual y se realiza en local; no uses datos personales reales, fondos ni claves privadas reales.
- No proceses fechas de nacimiento u otros datos sensibles de personas reales; usa valores ficticios.
- Comunica con honestidad los límites de ZK: protege el enunciado, no elimina metadatos ni riesgos de correlación.
- Considera el marco legal de las credenciales de identidad; la privacidad técnica no exime del cumplimiento normativo.
- Documenta el modelo de confianza del setup; ocultar un trusted setup es una omisión relevante para el usuario.

## 🔗 Referencias

- Thaler, J., *Proofs, Arguments, and Zero-Knowledge* — <https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html>
- Least Authority, *The MoonMath Manual to zk-SNARKs* — <https://github.com/LeastAuthority/moonmath-manual>
- ZKProof, Community Reference — <https://zkproof.org/>
- circom, documentación del lenguaje de circuitos — <https://docs.circom.io/>
- Fuente primaria: Goldwasser, Micali y Rackoff, *The Knowledge Complexity of Interactive Proof-Systems* (1985), definición original de conocimiento cero.

## ✅ Criterio de dominio

- Enuncias las tres propiedades de una prueba ZK y las aplicas al caso de la mayoría de edad sin ayuda.
- Comparas SNARK y STARK y eliges uno justificando setup, tamaño y post-cuántico.
- Identificas los metadatos residuales y el mecanismo de revocación de una credencial ZK.

---

## 🧭 Navegación

⬅️ [Módulo 13 · Interoperabilidad y ecosistemas](../13-interoperabilidad/README.md) · [📚 Índice del currículo](../README.md) · ➡️ [Módulo 15 · Arquitectura avanzada](../15-arquitectura-avanzada/README.md)

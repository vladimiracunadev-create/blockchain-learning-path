# 08 · Tokens y estándares

> **Nivel:** Intermedio-Avanzado · ⏱️ **Duración estimada:** 150 min · **Fuente:** EIPs de Ethereum y OpenZeppelin Contracts
> [⬅️ Currículo](../README.md) · [📚 Bibliografía](../../docs/bibliografia.md)

---

## 🎯 Objetivos

- Distinguir con precisión los estándares ERC-20, ERC-721, ERC-1155 y ERC-4626, y cuándo elegir cada uno.
- Explicar el modelo de allowances, el riesgo del approve infinito y la alternativa de firmas con ERC-2612 (`permit`).
- Implementar un token educativo apoyado en una biblioteca auditada, documentando autoridad de mint/burn, suministro máximo y controles de emergencia.
- Analizar la distribución y concentración inicial de un suministro y justificar por qué el token debe existir.
- Ubicar la abstracción de cuenta (ERC-4337 y EIP-7702, activo desde Pectra en 2025) dentro de la experiencia de usuario de un token.

## 📚 Resultados de aprendizaje

Al finalizar, el estudiante podrá:

1. **Comparar** los estándares fungibles y no fungibles según interfaz, casos de uso y coste de gas.
2. **Implementar** un token ERC-20 con suministro máximo, pausa y recuperación usando OpenZeppelin.
3. **Justificar** la política de mint/burn y de allowances frente a los riesgos de concentración y approve infinito.
4. **Diseñar** metadata coherente para un ERC-721/1155 y explicar las royalties con ERC-2981.
5. **Explicar** cómo `permit` (ERC-2612) y la abstracción de cuenta mejoran la UX sin sacrificar seguridad.
6. **Modelar** un escenario de emisión con el simulador de tokenomics del repositorio.

## 🗺️ Temas

| # | Tema | Por qué importa |
|---|------|-----------------|
| 1 | ERC-20 y allowances | Es el estándar fungible base; sus allowances concentran el riesgo de aprobaciones. |
| 2 | ERC-721 y metadata | Define la unicidad y la referencia a atributos fuera de cadena. |
| 3 | ERC-1155 multi-token | Un solo contrato gestiona fungibles y no fungibles con transferencias por lotes. |
| 4 | ERC-2612 `permit` | Elimina la transacción de `approve` mediante firma, reduciendo fricción y coste. |
| 5 | Royalties ERC-2981 | Estandariza cómo se señala una regalía, aunque su cumplimiento sea voluntario. |
| 6 | Bóvedas ERC-4626 | Unifica la contabilidad de bóvedas tokenizadas y evita errores de conversión. |
| 7 | Abstracción de cuenta | ERC-4337 y EIP-7702 permiten cuentas programables y patrocinio de gas. |
| 8 | Autoridad y suministro | Quién puede mintar, quemar o pausar determina el poder real sobre el token. |

## 🧠 Modelo mental

Un estándar de token es como el formato de un enchufe eléctrico: no dice qué aparato conectas ni cuánta energía consume, solo garantiza que cualquier billetera o protocolo pueda "enchufarse" y hablar el mismo idioma de funciones y eventos. Gracias a esa interfaz común, un token ERC-20 recién creado ya es visible en billeteras y exploradores sin que nadie lo haya integrado a mano.

El límite de la analogía es importante: el enchufe no juzga la calidad del aparato. Que un contrato implemente correctamente `transfer` y `balanceOf` no dice nada sobre si su suministro está concentrado en una dirección, si el dueño puede mintar sin tope o si el token tiene alguna utilidad real. Crear un token es trivial; crear utilidad, seguridad y gobernanza responsable es el trabajo difícil.

## 📖 Conceptos y definiciones

- **Allowance**: monto que una dirección autoriza a que otra gaste en su nombre; el approve infinito lo fija en el máximo y expone todo el saldo si el gastador se ve comprometido.
- **Mint / burn**: creación y destrucción de unidades; su autoridad debe estar acotada por roles, tope de suministro y, si es posible, renuncia verificable.
- **Suministro máximo (cap)**: límite superior de unidades emitibles; sin él, la dilución queda a discreción del emisor.
- **`permit` (ERC-2612)**: aprobación mediante firma off-chain con `nonce` y `deadline`, que evita una transacción separada de `approve`.
- **Metadata**: descripción de un token (nombre, imagen, atributos) referenciada por URI; en NFT suele apuntar a IPFS para direccionamiento por contenido.
- **Royalty (ERC-2981)**: interfaz que indica beneficiario y porcentaje de regalía, cuyo pago depende de que el mercado decida respetarlo.
- **Bóveda ERC-4626**: estándar que tokeniza depósitos en un activo subyacente unificando `deposit`, `mint`, `withdraw` y `redeem` y su contabilidad de `shares`.
- **Abstracción de cuenta**: capacidad de que una cuenta ejecute lógica programable; ERC-4337 usa UserOperations y EIP-7702 permite a una EOA delegar temporalmente en código.
- **Hook**: función que se ejecuta antes o después de una transferencia para añadir lógica como pausas o listas de bloqueo.

## 🧪 Laboratorio guiado

1. Explora el simulador de suministro para ver el efecto de distintas políticas de emisión.

```bash
pnpm lab:tokenomics
```

2. Modela dos escenarios: uno con suministro máximo fijo y otro con emisión continua, y compara la concentración resultante en las primeras direcciones.

3. Abre los contratos del módulo en `labs/08-protocols` y ejecuta la suite de pruebas con trazas para observar transferencias, allowances y eventos.

```bash
forge test -vv
```

4. Localiza en el código de prueba una llamada a `permit` y verifica cómo la firma sustituye a una transacción de `approve`.

## 📝 Reto verificable

Implementa un token educativo ERC-20 apoyado en OpenZeppelin con: suministro máximo fijo, roles separados para mint y pausa, función de recuperación de tokens enviados por error y documentación de la autoridad de cada rol.

**Criterio de aceptación:** `forge test -vv` pasa en verde; el suministro no puede superar el cap ni siquiera por el rol de mint; existe una prueba que demuestra que una cuenta sin rol no puede mintar ni pausar; y el README del token justifica en un párrafo por qué el token debe existir y cómo se distribuye.

## ⚠️ Errores frecuentes

| Síntoma | Causa y cómo comprobarlo |
|---------|--------------------------|
| El saldo de un usuario se vacía tras firmar en un sitio | Approve infinito a un contrato malicioso; revisa las allowances activas y revócalas. |
| El `permit` falla siempre | `deadline` vencido o `nonce` reutilizado; imprime ambos valores en la prueba y compáralos. |
| La imagen del NFT desaparece | Metadata en un servidor no persistente; usa un CID de IPFS con pinning verificado. |
| Las regalías no se pagan | ERC-2981 solo señala la regalía; comprueba si el mercado la respeta antes de asumir ingresos. |
| El suministro crece sin control | Falta de `cap` o mint sin restricción; añade una prueba que intente superar el tope y espere revert. |
| Confundir `shares` con activos en la bóveda | Conversión ERC-4626 mal interpretada; valida con `convertToAssets` y `convertToShares`. |

## 🛡️ Seguridad y ética

- Trabaja siempre en local o testnet; nunca uses fondos ni claves privadas reales en los laboratorios.
- Prefiere bibliotecas auditadas (OpenZeppelin) antes que reimplementar estándares desde cero.
- Documenta y minimiza los privilegios: quién puede mintar, quemar, pausar o recuperar, y cómo se renuncia a ellos.
- Advierte sobre el approve infinito en cualquier interfaz y ofrece aprobaciones acotadas o mediante `permit`.
- Evalúa la concentración del suministro: un token con utilidad real y distribución transparente es más defendible que uno especulativo.

## 🔗 Referencias

- Ethereum Foundation, *EIPs — Ethereum Improvement Proposals* — <https://eips.ethereum.org/>
- ERC-20, *Token Standard* — <https://eips.ethereum.org/EIPS/eip-20>
- ERC-721, *Non-Fungible Token Standard* — <https://eips.ethereum.org/EIPS/eip-721>
- ERC-1155, *Multi Token Standard* — <https://eips.ethereum.org/EIPS/eip-1155>
- ERC-4626, *Tokenized Vaults* — <https://eips.ethereum.org/EIPS/eip-4626>
- OpenZeppelin, *Contracts — documentación* — <https://docs.openzeppelin.com/contracts/>
- Antonopoulos & Wood, *Mastering Ethereum*, cap. sobre tokens — <https://github.com/ethereumbook/ethereumbook>
- Fuente primaria: ERC-2612, *`permit` — aprobaciones firmadas (712)* — <https://eips.ethereum.org/EIPS/eip-2612>

## ✅ Criterio de dominio

- Entregas un token ERC-20 con cap, roles y pruebas en verde, más un README que justifica su existencia y distribución.
- Explicas sin apoyo el riesgo del approve infinito y cómo `permit` lo mitiga.
- Eliges de forma razonada entre ERC-20, ERC-721, ERC-1155 y ERC-4626 para un caso dado.

---

## 🧭 Navegación

⬅️ [Módulo 07 · Aplicaciones descentralizadas](../07-dapps/README.md) · [📚 Índice del currículo](../README.md) · ➡️ [Módulo 09 · Seguridad y auditoría](../09-seguridad/README.md)

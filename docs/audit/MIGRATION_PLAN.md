# Auditoría · Plan de migración

> [⬅️ Índice de la auditoría](README.md) · [⬅️ Arquitectura propuesta](PROPOSED_ARCHITECTURE.md)

Plan ejecutado para pasar de `0.8.1` (19 módulos) a `0.9.0` (28 módulos) **sin
romper nada**. Se documenta en pasado porque está aplicado; sirve como guion para
la próxima ampliación.

## Regla de oro

> Todo cambio debe dejar `pnpm check`, `pnpm test`, `pnpm lint:md` y `pnpm lint:js`
> en verde. **Ninguna comprobación se relaja para que pase contenido nuevo**: si
> una cifra fija deja de valer, se actualiza la cifra, nunca se borra la
> comprobación.

## Orden de ejecución y por qué ese orden

| Fase | Qué se hizo | Por qué antes que lo siguiente |
|---:|---|---|
| 0 | Auditoría (`docs/audit/`) | Sin saber qué hay, ampliar es duplicar |
| 1 | Módulo **20** (dinero, banca y liquidación) | Es la bisagra: 21–25 usan su vocabulario |
| 2 | Módulos **19, 21, 22** | DeFi da el mercado; stablecoins y CBDC, las formas de dinero |
| 3 | Módulos **23, 24, 25** | Pagos, tokenización y mercados aplican lo anterior |
| 4 | Módulos **26, 27** | Custodia y regulación cierran y atraviesan todo |
| 5 | `regulation/` y `docs/casos-reales/` | Se apoyan en el vocabulario ya fijado |
| 6 | Laboratorios y pruebas | Cada práctica cita el módulo que la sustenta |
| 7 | Catálogo, guías de resolución y quizzes | Referencian módulos y laboratorios existentes |
| 8 | Cifras, versión, CHANGELOG, ROADMAP, README | Última: cualquier cifra anterior habría quedado obsoleta |
| 9 | `pnpm check` + `pnpm test` + lint | Puerta final |

## Puntos de rotura previstos y cómo se trataron

### 1. La cadena anterior/siguiente

`check-repository.mjs` exige que cada módulo enlace a su vecino real, en cabecera
**y** al pie. El módulo `18` apuntaba a `../../capstone/README.md` como siguiente.

**Acción:** el `18` pasa a apuntar al `19`; el `27` (último) apunta al capstone.
Los siete intermedios se encadenan entre sí. Ningún otro módulo se tocó.

### 2. Cifras fijadas en el validador

| Comprobación | Antes | Ahora |
|---|---:|---:|
| Filas de práctica en `labs/CATALOG.md` | 50 | 70 |
| Guías `## NN ·` en `labs/guides/*.md` | 50 | 70 |
| Recuento de pruebas en `docs/bibliografia.md` | 80 | recalculado |
| Prácticas `**auto**` declaradas en README | 31 | recalculado |

### 3. Verificadores de las apps

`apps/android/verificar-apk.mjs` comprueba `modulos.size === 19` y el manifiesto.
**Esto funcionó como se diseñó**: es exactamente la alarma que debe sonar cuando
el bundle no lleva el curso completo. Se actualizó la cifra esperada, no se
eliminó la comprobación.

### 4. Requisitos por módulo que el validador impone

Cada módulo nuevo debía traer, **o `pnpm check` falla**:

- Cabecera con `**Fuente:**`, línea `> 🧭 …` con anterior y siguiente correctos.
- Enlaces a `../../docs/glosario.md` y `../../docs/empieza-aqui.md`.
- Sección `## 🔬 Profundización` con ≥400 palabras.
- Sección `## 🔗 Referencias` con ≥3 URL.
- Sección de navegación al pie con anterior y siguiente.
- Fila en `docs/bibliografia.md` con la ruta `../curriculum/<slug>/README.md`.
- Entrada en `assessments/module-quizzes.json` con ≥3 preguntas válidas.

### 5. Enlaces locales

El validador resuelve **todos** los enlaces relativos contra el disco. Los
módulos nuevos enlazan a laboratorios, `regulation/` y casos reales: cada destino
tuvo que existir antes de que el enlace se escribiera, lo que fijó el orden de
las fases 5 y 6.

## Lo que se propaga solo

No hizo falta tocar nada para que los módulos nuevos aparezcan en:

- el **sitio** (`build-site.mjs` descubre `curriculum/NN-*`),
- el **manual PDF** (`build-manual.mjs`, misma detección),
- la **landing** (`build-landing.mjs` calcula módulos y prácticas),
- las **apps** de escritorio y Android (empaquetan el sitio generado),
- el **panel de progreso** (cuenta los módulos del currículo).

Esa propiedad del diseño previo es la razón por la que esta ampliación fue viable
sin reescribir la tubería de publicación.

## Verificación final

```bash
pnpm check      # estructura, enlaces, cadena, fuentes, quizzes, cifras y versión
pnpm test       # pruebas de Node (incluidas las de los laboratorios nuevos)
pnpm lint:md    # markdownlint sobre todo el material
pnpm lint:js    # ESLint
forge test      # contratos (requiere Foundry instalado)
```

## Próxima ampliación: guion corto

1. Crear `curriculum/NN-slug/README.md` desde `MODULE_TEMPLATE.md`.
2. Encadenarlo con el vecino anterior (editar **su** cabecera y **su** pie).
3. Añadir su fila en `docs/bibliografia.md` y su quiz en `module-quizzes.json`.
4. Añadir sus prácticas al catálogo y su guía de resolución; actualizar las
   cifras de `check-repository.mjs`.
5. `pnpm check` hasta verde.

---

## 🧭 Navegación

[⬅️ Arquitectura propuesta](PROPOSED_ARCHITECTURE.md) · [📋 Índice](README.md) · [🏠 Programa](../../README.md)

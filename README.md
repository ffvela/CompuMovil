# Ingeniería en Informática UTEM — Landing page

Página web que presenta la carrera Ingeniería en Informática de la UTEM a estudiantes de enseñanza media y a personas que piensan estudiar o cambiarse de carrera. Toda la información tiene su fuente oficial citada.

> Proyecto académico del curso Computación Móvil. No es un sitio oficial de la Universidad Tecnológica Metropolitana.

- **Sitio publicado:** https://informatica-utem.netlify.app *(reemplazar por la URL real)*
- **Equipo:** Felipe Velasquez y Ernesto Baltierra

---

## 1. Cómo actualizar la información (sin saber programar)

Todo el texto y los datos de la página están en la carpeta **`src/content/`**, en archivos `.json`. **No hace falta tocar nada más.**

| Quiero cambiar... | Archivo |
|---|---|
| Nombre, título, duración, vacantes (portada) | `carrera.json` |
| Párrafos de cada sección | `bloques.json` |
| Ramos de la malla | `malla.json` |
| Cifras de empleabilidad e ingresos, áreas de trabajo | `campo-laboral.json` |
| Comparación con otras carreras | `comparacion.json` e `indicadores-mifuturo.json` |
| Ponderaciones y fechas de admisión | `admision.json` |
| Perfil de egreso | `perfil.json` |
| Preguntas frecuentes | `faq.json` |
| Testimonios | `testimonios.json` |
| Fuentes (sección Referencias) | `referencias.json` |

**Paso a paso para cambiar un dato:**

1. Abre el archivo en GitHub y presiona el ícono del lápiz (✏️ *Edit*).
2. Cambia solo el texto que está entre comillas, por ejemplo `"valor": "150"` → `"valor": "160"`.
3. Si el dato viene de una fuente nueva, agrégala en `referencias.json` y escribe su ID (por ejemplo `"F13"`) en el campo `cita`.
4. Presiona *Commit changes*. En unos 2 minutos, Netlify publica la página actualizada.

**Reglas que el sistema revisa solo.** Si una regla no se cumple, la página **no se publica** y Netlify muestra el error:
- Todo dato debe tener una cita (`"cita": "F01"`) que exista en `referencias.json`.
- Las cifras deben indicar el año (4 dígitos).
- Las ponderaciones deben sumar 100 %.
- No puede quedar la palabra `TODO` en ningún texto.

## 2. Cómo ver la página en tu computador

Necesitas tener instalado [Node.js](https://nodejs.org/) versión 24 o superior.

```bash
npm install        # instala Astro (solo la primera vez)
npm run dev        # abre la página en http://localhost:4321
npm run build      # genera la versión final en la carpeta dist/
npm run check      # revisa los tipos de TypeScript
```

## 3. Cómo se publica

El repositorio está conectado a **Netlify**. Cada vez que se guarda un cambio en la rama `main`, Netlify ejecuta `npm run build` y publica la carpeta `dist/`. La configuración está en `netlify.toml`.

Después del primer despliegue, hay que reemplazar la URL de ejemplo en **`astro.config.mjs`** (opción `site`) y en **`public/robots.txt`**.

## 4. Estructura del proyecto

```
src/
  content/            # datos editables (JSON)
  content.config.ts   # esquemas: las reglas que debe cumplir cada dato
  components/         # una sección por archivo (Hero, Malla, Admision...)
  layouts/
    BaseLayout.astro  # <head>, SEO, barra superior y pie
  lib/contenido.ts    # funciones de apoyo
  pages/
    index.astro       # la página: une las secciones en orden
    sitemap.xml.ts    # genera el sitemap
  styles/global.css   # estilos (colores UTEM)
public/               # favicon, imagen para redes, robots.txt, llms.txt
docs/                 # wireframes y anexos del informe
INFORME.md            # informe del proyecto
```

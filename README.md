# Ingeniería en Informática UTEM

Página que presenta la carrera de Ingeniería en Informática de la UTEM a estudiantes de 3.° y 4.° medio, a sus familias y a personas que están pensando en estudiar o cambiarse de carrera. Todos los datos tienen su fuente oficial.

Es un proyecto del ramo Computación Móvil, **no es un sitio oficial de la UTEM**.

- **Página publicada:** https://sitiocompumovil.netlify.app
- **Hecho por:** Felipe Velasquez y Ernesto Baltierra

---

## Cómo cambiar la información de la página

No hace falta saber programar. Todo lo que se lee en la página está en la carpeta **`src/content/`**, en archivos `.json`. Lo demás no hay que tocarlo.

| Si quieres cambiar... | Abre este archivo |
|---|---|
| Lo de la portada (título, duración, vacantes) | `carrera.json` |
| Los párrafos de cada sección | `bloques.json` |
| Los ramos de la malla | `malla.json` |
| Empleabilidad, sueldos y áreas de trabajo | `campo-laboral.json` |
| La comparación con otras carreras | `comparacion.json` e `indicadores-mifuturo.json` |
| Ponderaciones y fechas de postulación | `admision.json` |
| El perfil de egreso | `perfil.json` |
| Las preguntas frecuentes | `faq.json` |
| Los testimonios | `testimonios.json` |
| Las fuentes (sección Referencias) | `referencias.json` |

### Pasos

1. Entra al archivo en GitHub y aprieta el lápiz.
2. Cambia solo lo que está entre comillas. Por ejemplo, `"valor": "150"` pasa a `"valor": "160"`.
3. Si el dato sale de una fuente nueva, agrégala primero en `referencias.json` con un id nuevo (por ejemplo `"F13"`) y después pon ese id en el campo `cita` del dato.
4. Aprieta *Commit changes*. En un par de minutos Netlify publica la página actualizada.

### Ojo: la página no se publica si...

Para que no se suba información incompleta por error, el sistema revisa algunas cosas antes de publicar. Si algo falla, Netlify muestra el error y la página anterior sigue igual. No se publica si:

- un dato no tiene cita, o la cita usa un id que no está en `referencias.json`;
- una cifra no dice de qué año es;
- las ponderaciones no suman 100 %;
- quedó escrita la palabra `TODO` en algún texto.

---

## Cómo abrir la página en tu computador

Necesitas [Node.js](https://nodejs.org/) versión 24 o más nueva. En una terminal, dentro de la carpeta del proyecto:

```bash
npm install        # instala lo necesario (solo la primera vez)
npm run dev        # abre la página en http://localhost:4321
npm run build      # arma la versión final en la carpeta dist/
npm run check      # revisa que no haya errores de tipos
```

---

## Dónde está publicada

La página está en **Netlify**, conectada a este repositorio. Cada vez que se sube un cambio a la rama `main`, Netlify vuelve a armar y publicar la página sola. La configuración está en `netlify.toml`.

Si la página cambia de dirección, hay que actualizar la URL en `astro.config.mjs` (en `site`) y en `public/robots.txt`.

---

## Qué hay en cada carpeta

```
src/
  content/            datos y textos de la página (los .json)
  content.config.ts   reglas que tiene que cumplir cada dato
  components/         una sección de la página por archivo
  layouts/            estructura común (encabezado, menú y pie)
  lib/                funciones de apoyo
  pages/              la página principal y el sitemap
  styles/             colores y estilos
public/               ícono, imagen para redes sociales, robots.txt y llms.txt
docs/                 wireframes y gráficos de la encuesta (para el informe)
INFORME.md            informe del proyecto
```

// ─────────────────────────────────────────────────────────────────
// src/content.config.ts — Esquemas de las colecciones de contenido.
//
// Idea central: TODO el texto y los datos del sitio viven en archivos
// JSON dentro de src/content/. Los componentes solo los muestran.
// Este archivo define qué forma debe tener cada JSON. Si un dato no
// cumple su esquema (falta un campo, un número viene como texto, una
// cita apunta a una fuente que no existe o quedó un "TODO"), el
// comando `npm run build` FALLA y el sitio no se publica.
// Así protegemos el principio del encargo: ningún dato sin fuente.
// ─────────────────────────────────────────────────────────────────

// defineCollection registra una colección; `file` es el cargador de
// Astro que lee un archivo JSON con un arreglo de objetos (cada uno
// con un campo `id` único).
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
// Zod es la librería de validación que usa Astro para los esquemas.
import { z } from 'astro/zod';

// Importamos las referencias directamente para saber qué IDs de
// fuente existen (F01, F02, ...) y validar las citas contra ellos.
import referenciasJson from './content/referencias.json';

// Lista de IDs válidos de fuentes, por ejemplo ["F01", "F02", ...].
const idsFuentes: string[] = referenciasJson.map((r) => r.id);

// ── Validadores reutilizables ────────────────────────────────────

// Texto que se publica: no puede venir vacío ni contener "TODO".
// Si alguien deja un pendiente, el build falla y avisa.
const textoFinal = z
  .string()
  .min(1, 'El texto no puede estar vacío')
  .refine((t) => !t.includes('TODO'), {
    message: 'Quedó un TODO sin completar en el contenido'
  });

// Una cita debe apuntar a una fuente que exista en referencias.json.
const cita = z.string().refine((id) => idsFuentes.includes(id), {
  message: 'La cita apunta a una fuente que no existe en referencias.json'
});

// Tipo de contenido, para mostrar la etiqueta correcta en pantalla
// (la rúbrica pide distinguir dato, interpretación y opinión).
const tipoContenido = z.enum(['dato', 'interpretacion', 'opinion']);

// Secciones del sitio (sirven para filtrar bloques y testimonios).
const seccion = z.enum([
  'hero',
  'sobre-carrera',
  'campo-laboral',
  'plan-estudios',
  'perfil-egreso',
  'admision',
  'respaldo',
  'faq'
]);

// ── Colecciones ──────────────────────────────────────────────────

// Fuentes en formato APA 7 (se muestran en la sección Referencias).
const referencias = defineCollection({
  loader: file('src/content/referencias.json'),
  schema: z.object({
    autor: z.string(),
    autorCorto: z.string(), // para la cita breve, ej. "(UTEM, 2026)"
    anio: z.number().int().min(2000),
    titulo: z.string(),
    descripcion: z.string().optional(),
    url: z.string().url(),
    tipo: z.enum(['primaria', 'secundaria']),
    fechaConsulta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Usar formato AAAA-MM-DD'),
    // Si está vacío, la fuente se usó solo en el informe y no se
    // lista en el sitio.
    secciones: z.array(z.string())
  })
});

// Datos de la portada (un solo elemento en el arreglo).
const carrera = defineCollection({
  loader: file('src/content/carrera.json'),
  schema: z.object({
    nombre: textoFinal,
    universidad: textoFinal,
    bajada: textoFinal,
    datos: z.array(z.object({ etiqueta: textoFinal, valor: textoFinal, cita })),
    aviso: textoFinal,
    avisoCita: cita
  })
});

// Párrafos de texto de cada sección, con su tipo y sus citas.
const bloques = defineCollection({
  loader: file('src/content/bloques.json'),
  schema: z.object({
    seccion,
    tipo: tipoContenido,
    texto: textoFinal,
    citas: z.array(cita).min(1, 'Todo bloque necesita al menos una cita')
  })
});

// Tabla comparativa con carreras afines.
const comparacion = defineCollection({
  loader: file('src/content/comparacion.json'),
  schema: z.object({
    carrera: textoFinal,
    institucion: textoFinal,
    tipoInstitucion: textoFinal,
    duracion: textoFinal,
    grado: textoFinal,
    enfoque: textoFinal,
    cita,
    destacada: z.boolean()
  })
});

// Indicadores de Mi Futuro: UTEM frente a Duoc UC.
const indicadores = defineCollection({
  loader: file('src/content/indicadores-mifuturo.json'),
  schema: z.object({
    institucion: textoFinal,
    carrera: textoFinal,
    retencion: textoFinal,
    duracionReal: textoFinal,
    empleabilidad1: textoFinal,
    empleabilidad2: textoFinal,
    ingreso4: textoFinal,
    cita
  })
});

// Malla curricular: un ramo por elemento.
const malla = defineCollection({
  loader: file('src/content/malla.json'),
  schema: z.object({
    semestre: z.number().int().min(1).max(8),
    nombre: textoFinal,
    area: z.enum([
      'ciencias-basicas',
      'informatica',
      'gestion',
      'formacion-general',
      'titulacion'
    ]),
    cita
  })
});

// Competencias del perfil de egreso, en lenguaje claro.
const perfil = defineCollection({
  loader: file('src/content/perfil.json'),
  schema: z.object({ titulo: textoFinal, texto: textoFinal, cita })
});

// Campo laboral: áreas de trabajo y cifras. Usamos una "unión
// discriminada": según el campo `tipo`, se exigen campos distintos.
const campoLaboral = defineCollection({
  loader: file('src/content/campo-laboral.json'),
  schema: z.discriminatedUnion('tipo', [
    z.object({ tipo: z.literal('area'), titulo: textoFinal, texto: textoFinal, cita }),
    z.object({
      tipo: z.literal('cifra'),
      titulo: textoFinal,
      valor: textoFinal,
      // Toda cifra debe declarar su año (exigencia de la Fase D).
      anio: z.string().regex(/^\d{4}$/, 'El año debe tener 4 dígitos'),
      cita
    })
  ])
});

// Admisión: ponderaciones y fechas (un solo elemento).
const admision = defineCollection({
  loader: file('src/content/admision.json'),
  schema: z
    .object({
      ponderaciones: z.array(
        z.object({ prueba: textoFinal, porcentaje: z.number().int().min(0).max(100) })
      ),
      ponderacionesCita: cita,
      puntajeMinimo: textoFinal,
      fechas: z.array(z.object({ fecha: textoFinal, hito: textoFinal })),
      fechasCita: cita,
      enlaceDemre: z.string().url()
    })
    // Regla extra: las ponderaciones deben sumar exactamente 100 %.
    .refine((a) => a.ponderaciones.reduce((s, p) => s + p.porcentaje, 0) === 100, {
      message: 'Las ponderaciones deben sumar 100 %'
    })
});

// Testimonios del equipo (siempre opinión personal).
const testimonios = defineCollection({
  loader: file('src/content/testimonios.json'),
  schema: z.object({
    autor: textoFinal,
    rol: textoFinal,
    seccion,
    texto: textoFinal
  })
});

// Preguntas frecuentes, sacadas de la encuesta (Fase B).
const faq = defineCollection({
  loader: file('src/content/faq.json'),
  schema: z.object({
    pregunta: textoFinal,
    respuesta: textoFinal,
    tipo: tipoContenido,
    citas: z.array(cita).optional(),
    testimonios: z.array(z.string()).optional(),
    // De qué resultado de la encuesta salió la pregunta (trazabilidad).
    origen: textoFinal
  })
});

// Astro lee este objeto para saber qué colecciones existen.
export const collections = {
  referencias,
  carrera,
  bloques,
  comparacion,
  indicadores,
  malla,
  perfil,
  campoLaboral,
  admision,
  testimonios,
  faq
};

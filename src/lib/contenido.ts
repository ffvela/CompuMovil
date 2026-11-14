// ─────────────────────────────────────────────────────────────────
// src/lib/contenido.ts — Funciones utilitarias para leer contenido.
//
// Centralizamos aquí la lógica repetida (buscar bloques de una
// sección, armar citas, formatear fechas) para que los componentes
// queden cortos y solo se ocupen de mostrar.
// Todas las funciones tienen tipos explícitos (rúbrica: sin `any`).
// ─────────────────────────────────────────────────────────────────

import { getCollection, type CollectionEntry } from 'astro:content';

// Alias de tipos para que las firmas sean más legibles.
export type Referencia = CollectionEntry<'referencias'>;
export type Bloque = CollectionEntry<'bloques'>;
export type Testimonio = CollectionEntry<'testimonios'>;
export type TipoContenido = Bloque['data']['tipo'];

// Etiquetas visibles para cada tipo de contenido.
export const ETIQUETAS: Record<TipoContenido, string> = {
  dato: 'Dato oficial',
  interpretacion: 'Interpretación del equipo',
  opinion: 'Opinión personal'
};

/** Devuelve todas las referencias como un mapa ID → referencia. */
export async function mapaReferencias(): Promise<Map<string, Referencia>> {
  const refs: Referencia[] = await getCollection('referencias');
  return new Map(refs.map((r): [string, Referencia] => [r.id, r]));
}

/** Bloques de texto de una sección, en el orden del JSON. */
export async function bloquesDe(seccion: Bloque['data']['seccion']): Promise<Bloque[]> {
  const todos: Bloque[] = await getCollection('bloques');
  return todos.filter((b) => b.data.seccion === seccion);
}

/** Busca un bloque por su ID; si no existe, el build falla con un mensaje claro. */
export async function bloque(id: string): Promise<Bloque> {
  const todos: Bloque[] = await getCollection('bloques');
  const encontrado: Bloque | undefined = todos.find((b) => b.id === id);
  if (!encontrado) {
    throw new Error(`No existe el bloque "${id}" en src/content/bloques.json`);
  }
  return encontrado;
}

/** Testimonios asignados a una sección. */
export async function testimoniosDe(
  seccion: Testimonio['data']['seccion']
): Promise<Testimonio[]> {
  const todos: Testimonio[] = await getCollection('testimonios');
  return todos.filter((t) => t.data.seccion === seccion);
}

/** Testimonios por lista de IDs (los usan las preguntas frecuentes). */
export async function testimoniosPorId(ids: readonly string[]): Promise<Testimonio[]> {
  const todos: Testimonio[] = await getCollection('testimonios');
  return todos.filter((t) => ids.includes(t.id));
}

/** Convierte "2026-11-13" en "13 de noviembre de 2026" (formato chileno). */
export function fechaLarga(iso: string): string {
  // Se agrega la hora 12:00 para evitar que la zona horaria corra el día.
  const fecha: Date = new Date(`${iso}T12:00:00`);
  return fecha.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

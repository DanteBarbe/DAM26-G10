import { apiFetch, ApiError } from '@/src/api/apiClient';
import type { StudyMaterial, MaterialError, MaterialFormData, CreatedMaterial } from '@/src/features/materials/types/materials.types';

// Shape que devuelve la API de materiales
export interface ApiMaterial {
  id: number;
  titulo: string;
  tipo: string;
  archivo: string;
  descripcion: string | null;
  comision: string | null;
  añoCursada: number | null;
  numeroParcial: number | null;
  materiaId: number | null;
  carreraId: number | null;
  userId: number;
  username: string | null;
  carreraNombre?: string | null;
  materiaNombre?: string | null;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

export function mapApiMaterial(item: ApiMaterial): StudyMaterial {
  return {
    id: item.id,
    titulo: item.titulo,
    descripcion: item.descripcion ?? '',
    tipo: item.tipo as StudyMaterial['tipo'],
    materia: item.materiaNombre ?? (item.materiaId ? `Materia ${item.materiaId}` : 'Sin materia'),
    carrera: item.carreraNombre ?? '',
    comision: item.comision ?? undefined,
    anioCursada: item.añoCursada ?? undefined,
    numeroParcial: item.numeroParcial ?? undefined,
    materiaId: item.materiaId ?? undefined,
    carreraId: item.carreraId ?? undefined,
    archivo: {
      id: String(item.id),
      name: `${item.titulo}.pdf`,
      uri: item.archivo,
    },
    author: {
      id: item.userId,
      name: item.username ?? 'Usuario',
      username: item.username ?? 'usuario',
      level: 'Nivel 1',
    },
    createdAt: item.createdAt,
    score: (item.upvotes ?? 0) - (item.downvotes ?? 0),
  };
}

export type MaterialListFilters = {
  query?: string;
  tipo?: string;
  comision?: string;
  anioCursada?: string;
  userId?: number;
  limit?: number;
  cursor?: number;
};

export const fetchMaterials = async (filters: MaterialListFilters = {}): Promise<StudyMaterial[]> => {
  const params = new URLSearchParams();
  if (filters.query) params.set('query', filters.query);
  if (filters.tipo) params.set('tipo', filters.tipo);
  if (filters.comision) params.set('comision', filters.comision);
  if (filters.anioCursada) params.set('anioCursada', filters.anioCursada);
  if (filters.userId !== undefined) params.set('userId', String(filters.userId));
  params.set('limit', String(filters.limit ?? 40));
  if (filters.cursor) params.set('cursor', String(filters.cursor));

  const qs = `?${params.toString()}`;
  const res = await apiFetch<{ data: ApiMaterial[]; meta: unknown; message: string }>(`/api/materials${qs}`);
  return res.data.map(mapApiMaterial);
};

export const getMaterialById = async (id: number): Promise<StudyMaterial> => {
  try {
    const res = await apiFetch<{ data: ApiMaterial; message: string }>(`/api/materials/${id}`);
    return mapApiMaterial(res.data);
  } catch (err) {
    const mapped: MaterialError = {
      code: 'NOT_FOUND',
      message: err instanceof ApiError ? err.message : 'El material no existe o fue eliminado.',
    };
    throw mapped;
  }
};

// Carga los datos de un material en formato compatible con el formulario de edición
export const getEditableMaterialById = async (id: number): Promise<CreatedMaterial> => {
  try {
    const res = await apiFetch<{ data: ApiMaterial; message: string }>(`/api/materials/${id}`);
    const m = res.data;
    return {
      id: m.id,
      titulo: m.titulo,
      descripcion: m.descripcion ?? '',
      tipo: m.tipo as MaterialFormData['tipo'],
      archivos: [{ id: String(m.id), name: `${m.titulo}.pdf`, uri: m.archivo }],
      materiaId: m.materiaId ?? undefined,
      carreraId: m.carreraId ?? undefined,
      materia: m.materiaNombre ?? '',
      carrera: m.carreraNombre ?? '',
      comision: m.comision ?? '',
      parcial: m.numeroParcial ? String(m.numeroParcial) : '',
      anioCursada: m.añoCursada ? String(m.añoCursada) : '',
      userId: m.userId,
      createdAt: m.createdAt,
      numeroParcial: m.numeroParcial ?? undefined,
    };
  } catch (err) {
    const mapped: MaterialError = {
      code: 'MATERIAL_NOT_OWNED',
      message: err instanceof ApiError ? err.message : 'No tenés permisos para editar este material.',
    };
    throw mapped;
  }
};

export const createMaterial = async (form: MaterialFormData): Promise<StudyMaterial> => {
  const archivo = form.archivos[0]?.uri ?? form.archivos[0]?.name ?? '';
  const body: Record<string, unknown> = {
    titulo: form.titulo,
    tipo: form.tipo,
    archivo,
    descripcion: form.descripcion || null,
    comision: form.comision || null,
    añoCursada: form.anioCursada ? Number(form.anioCursada) : null,
    numeroParcial: form.parcial ? Number(form.parcial) : null,
  };
  if (form.materiaId !== undefined) body.materiaId = form.materiaId;
  if (form.carreraId !== undefined) body.carreraId = form.carreraId;
  try {
    const res = await apiFetch<{ data: ApiMaterial; message: string }>('/api/materials', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return mapApiMaterial(res.data);
  } catch (err) {
    const mapped: MaterialError = {
      code: 'UNKNOWN',
      message: err instanceof ApiError ? err.message : 'Ocurrió un error inesperado. Intentá de nuevo.',
    };
    throw mapped;
  }
};

export const updateMaterial = async (id: number, form: MaterialFormData): Promise<StudyMaterial> => {
  const archivo = form.archivos[0]?.uri ?? form.archivos[0]?.name;
  const body: Record<string, unknown> = {
    titulo: form.titulo,
    tipo: form.tipo,
    descripcion: form.descripcion || null,
    comision: form.comision || null,
    añoCursada: form.anioCursada ? Number(form.anioCursada) : null,
    numeroParcial: form.parcial ? Number(form.parcial) : null,
  };
  if (archivo) body.archivo = archivo;
  // materiaId/carreraId NO se envian: las tablas materia/carrera estan vacias en E2
  // y el backend tambien las ignora al crear. Enviarlas provoca P2003 (FK inexistente)
  // y la edicion fallaba en silencio. Se conectaran en E3 cuando existan esas tablas.

  try {
    const res = await apiFetch<{ data: ApiMaterial; message: string }>(`/api/materials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return mapApiMaterial(res.data);
  } catch (err) {
    const isOwnership = err instanceof ApiError && err.status === 403;
    const mapped: MaterialError = isOwnership
      ? { code: 'MATERIAL_NOT_OWNED', message: 'No tenés permisos para editar este material.' }
      : { code: 'UNKNOWN', message: err instanceof ApiError ? err.message : 'Ocurrió un error inesperado. Intentá de nuevo.' };
    throw mapped;
  }
};

export const deleteMaterial = async (id: number): Promise<void> => {
  try {
    await apiFetch(`/api/materials/${id}`, { method: 'DELETE' });
  } catch (err) {
    const isOwnership = err instanceof ApiError && err.status === 403;
    const mapped: MaterialError = isOwnership
      ? { code: 'MATERIAL_NOT_OWNED', message: 'No tenés permisos para eliminar este material.' }
      : { code: 'UNKNOWN', message: err instanceof ApiError ? err.message : 'Ocurrió un error inesperado. Intentá de nuevo.' };
    throw mapped;
  }
};

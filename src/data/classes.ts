import type { ClassDef, ClassId } from '../model/types';
import { CLASSES_MARTIAL } from './classes1';
import { CLASSES_CASTERS } from './classes2';

export const CLASSES: ClassDef[] = [...CLASSES_MARTIAL, ...CLASSES_CASTERS].sort(
  (a, b) => a.name.localeCompare(b.name, 'ru'),
);

export const CLASSES_BY_ID = Object.fromEntries(
  CLASSES.map((c) => [c.id, c]),
) as Record<ClassId, ClassDef>;

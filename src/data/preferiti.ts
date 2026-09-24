import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

const CHIAVE_PREFERITI = 'preferiti';

export function getPreferiti(): string[] {
  const json = storage.getString(CHIAVE_PREFERITI);
  if (!json) {
    return [];
  }
  return JSON.parse(json);
}

export function isPreferito(nomePiatto: string): boolean {
  return getPreferiti().includes(nomePiatto);
}

export function toggleFavorito(nomePiatto: string): string[] {
  const attuali = getPreferiti();
  const nuovi = attuali.includes(nomePiatto)
    ? attuali.filter((nome) => nome !== nomePiatto)
    : [...attuali, nomePiatto];

  storage.set(CHIAVE_PREFERITI, JSON.stringify(nuovi));
  return nuovi;
}
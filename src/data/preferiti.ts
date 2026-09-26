import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

const CHIAVE_PREFERITI = 'preferiti';
// Regione di ogni preferito: serve per i piatti fuori dai 10 tipici (province, altri da Wikipedia)
const CHIAVE_REGIONI_PREFERITI = 'preferiti-regioni';

export function getPreferiti(): string[] {
  const json = storage.getString(CHIAVE_PREFERITI);
  if (!json) {
    return [];
  }
  return JSON.parse(json);
}

export function getRegioniPreferiti(): Record<string, string> {
  const json = storage.getString(CHIAVE_REGIONI_PREFERITI);
  return json ? JSON.parse(json) : {};
}

export function isPreferito(nomePiatto: string): boolean {
  return getPreferiti().includes(nomePiatto);
}

export function toggleFavorito(nomePiatto: string, regioneId?: string): string[] {
  const attuali = getPreferiti();
  const regioni = getRegioniPreferiti();
  const rimuovi = attuali.includes(nomePiatto);
  const nuovi = rimuovi
    ? attuali.filter((nome) => nome !== nomePiatto)
    : [...attuali, nomePiatto];

  if (rimuovi) {
    delete regioni[nomePiatto];
  } else if (regioneId) {
    regioni[nomePiatto] = regioneId;
  }

  storage.set(CHIAVE_PREFERITI, JSON.stringify(nuovi));
  storage.set(CHIAVE_REGIONI_PREFERITI, JSON.stringify(regioni));
  return nuovi;
}

export function azzeraPreferiti(): void {
  storage.remove(CHIAVE_PREFERITI);
  storage.remove(CHIAVE_REGIONI_PREFERITI);
}

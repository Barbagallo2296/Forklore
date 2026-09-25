import { storage } from './preferiti';

const CHIAVE_VISTI = 'visti';

export function getVisti(): string[] {
  const json = storage.getString(CHIAVE_VISTI);
  return json ? JSON.parse(json) : [];
}

export function segnaVisto(nomePiatto: string): void {
  const visti = getVisti();
  if (!visti.includes(nomePiatto)) {
    storage.set(CHIAVE_VISTI, JSON.stringify([...visti, nomePiatto]));
  }
}

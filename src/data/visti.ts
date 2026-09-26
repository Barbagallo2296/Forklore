import { storage } from './preferiti';
import { REGIONI, TUTTI_I_PIATTI } from './regioni';

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

export function azzeraVisti(): void {
  storage.remove(CHIAVE_VISTI);
}

const NOMI_CURATI = new Set(TUTTI_I_PIATTI.map((p) => p.nome));

// Solo i piatti tipici scelti per ogni regione: quelli caricati da Wikipedia
// o delle province non contano per statistiche e traguardi
export function filtraCurati(visti: string[]): string[] {
  return visti.filter((nome) => NOMI_CURATI.has(nome));
}

// Percentuale di piatti visti per ogni regione (da 0 a 1)
export function calcolaProgresso(visti: string[]): Record<string, number> {
  const risultato: Record<string, number> = {};
  for (const regione of REGIONI) {
    const vistiRegione = regione.piatti.filter((p) => visti.includes(p.nome)).length;
    risultato[regione.id] = vistiRegione / regione.piatti.length;
  }
  return risultato;
}

export function contaConquistate(progresso: Record<string, number>): number {
  return Object.values(progresso).filter((p) => p === 1).length;
}

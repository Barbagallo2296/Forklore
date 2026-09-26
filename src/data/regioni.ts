import regioniData from './regioni-data.json';
import provinceData from './province-data.json';

export type Piatto = {
  nome: string;
};

export type Regione = {
  id: string;
  nome: string;
  // Categoria di Wikipedia da cui caricare gli "altri piatti" della regione
  categoria: string;
  piatti: Piatto[];
};

export const REGIONI: Regione[] = regioniData.map((r) => ({
  id: r.id,
  nome: r.nome,
  categoria: r.categoria,
  piatti: r.piatti.map((nome) => ({ nome })),
}));

export type Provincia = {
  id: string;
  nome: string;
  sigla: string;
  piatti: Piatto[];
};

const PROVINCE: Record<string, Provincia[]> = Object.fromEntries(
  Object.entries(provinceData).map(([regioneId, province]) => [
    regioneId,
    province.map((p) => ({ ...p, piatti: p.piatti.map((nome) => ({ nome })) })),
  ]),
);

// Per ora solo la Toscana ha le province: per le altre regioni la lista è vuota
export function getProvince(regioneId: string): Provincia[] {
  return PROVINCE[regioneId] ?? [];
}

export type PiattoConRegione = {
  nome: string;
  regioneId: string;
  regioneNome: string;
};

export const TUTTI_I_PIATTI: PiattoConRegione[] = REGIONI.flatMap((regione) =>
  regione.piatti.map((piatto) => ({
    nome: piatto.nome,
    regioneId: regione.id,
    regioneNome: regione.nome,
  })),
);

export function getPiattoDelGiorno(data: Date = new Date()): PiattoConRegione {
  const giorno = Math.floor(
    Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()) / 86_400_000,
  );
  return TUTTI_I_PIATTI[(giorno * 7919) % TUTTI_I_PIATTI.length];
}

// Alcuni piatti compaiono in più regioni: questo è il numero di nomi distinti
export const NUMERO_PIATTI_UNICI = new Set(TUTTI_I_PIATTI.map((p) => p.nome)).size;

const ACCENTI: Record<string, string> = {
  à: 'a', á: 'a', â: 'a', ä: 'a',
  è: 'e', é: 'e', ê: 'e', ë: 'e',
  ì: 'i', í: 'i', î: 'i', ï: 'i',
  ò: 'o', ó: 'o', ô: 'o', ö: 'o',
  ù: 'u', ú: 'u', û: 'u', ü: 'u',
};

// Minuscolo e senza accenti, così "Babà" e "baba" coincidono
function normalizza(testo: string): string {
  return testo
    .toLowerCase()
    .replace(/[àáâäèéêëìíîïòóôöùúûü]/g, (c) => ACCENTI[c] ?? c)
    .replace(/[’`]/g, "'")
    .trim();
}

// Cerca per nome del piatto o per nome della regione
export function cercaPiatti(testo: string): PiattoConRegione[] {
  const cercato = normalizza(testo);
  if (!cercato) {
    return [];
  }
  return TUTTI_I_PIATTI.filter(
    (p) => normalizza(p.nome).includes(cercato) || normalizza(p.regioneNome).includes(cercato),
  );
}

// Nome da mostrare: senza la precisazione tra parentesi dei titoli di Wikipedia
// (es. "Jota (gastronomia)" → "Jota"). I dati restano il titolo esatto della pagina.
export function nomeVisibile(titolo: string): string {
  return titolo.replace(/\s*\([^)]*\)$/, '');
}

// Regione di un piatto cercandolo tra i piatti tipici e quelli delle province
export function trovaRegioneDelPiatto(nome: string): Regione | undefined {
  const tipico = TUTTI_I_PIATTI.find((p) => p.nome === nome);
  const regioneId =
    tipico?.regioneId ??
    Object.keys(PROVINCE).find((id) =>
      PROVINCE[id].some((provincia) => provincia.piatti.some((p) => p.nome === nome)),
    );
  return REGIONI.find((r) => r.id === regioneId);
}

import regioniData from './regioni-data.json';

export type Piatto = {
  nome: string;
};

export type Regione = {
  id: string;
  nome: string;
  piatti: Piatto[];
};

export const REGIONI: Regione[] = regioniData.map((r) => ({
  id: r.id,
  nome: r.nome,
  piatti: r.piatti.map((nome) => ({ nome })),
}));

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

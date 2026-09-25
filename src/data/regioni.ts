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
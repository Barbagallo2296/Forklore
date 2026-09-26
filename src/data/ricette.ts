import { queryOptions } from '@tanstack/react-query';
import { WIKIPEDIA_USER_AGENT } from './wikipedia';
import { nomeVisibile } from './regioni';

// Le ricette vengono dal "Libro di cucina" di Wikibooks (stessa licenza di Wikipedia)
const PREFISSO_RICETTE = 'Libro di cucina/Ricette/';

export type Ricetta = {
  titolo: string;
  porzioni?: string;
  ingredienti: string[];
  passaggi: string[];
  url: string;
};

// Toglie la sintassi wiki da una riga: note, template, link, grassetti, tag HTML
function pulisci(testo: string): string {
  return testo
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[(?:File|Immagine|Image):[^\]]*\]\]/gi, '')
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
    .replace(/'''?/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Livello di un titolo wiki: "== Titolo ==" → 2, "=== Titolo ===" → 3, riga normale → 0
function livelloTitolo(riga: string): number {
  const titolo = riga.trim().match(/^(={2,6})[^=].*?\1$/);
  return titolo ? titolo[1].length : 0;
}

// Righe della prima sezione il cui titolo corrisponde a `nome`, di qualsiasi livello.
// Finisce al titolo successivo dello stesso livello o superiore (le sottosezioni restano dentro).
function sezione(wikitext: string, nome: RegExp): string[] {
  const righe = wikitext.split('\n');
  const inizio = righe.findIndex((r) => livelloTitolo(r) > 0 && nome.test(r));
  if (inizio === -1) {
    return [];
  }
  const livello = livelloTitolo(righe[inizio]);
  const fine = righe.findIndex((r, i) => {
    const l = livelloTitolo(r);
    return i > inizio && l > 0 && l <= livello;
  });
  return righe.slice(inizio + 1, fine === -1 ? undefined : fine);
}

// Passaggi della preparazione: le righe numerate (#) o, se mancano, i paragrafi di testo
function leggiPassaggi(righe: string[]): string[] {
  const numerati = righe.filter((r) => r.trim().startsWith('#'));
  const sorgente = numerati.length > 0 ? numerati : righe.filter((r) => /^[^=*#{|[\s]/.test(r));
  return sorgente.map((r) => pulisci(r.replace(/^\s*#+/, ''))).filter(Boolean);
}

// Estrae ingredienti e passaggi dal wikitesto di una ricetta. null se non ci sono.
export function leggiRicetta(
  wikitext: string,
): Omit<Ricetta, 'titolo' | 'url'> | null {
  const righeIngredienti = sezione(wikitext, /Ingredienti/i);
  const righePreparazione = sezione(wikitext, /Preparazione|Procedimento/i);

  const ingredienti = righeIngredienti
    .filter((r) => r.trim().startsWith('*'))
    .map((r) => pulisci(r.replace(/^\s*\*+/, '')))
    .filter(Boolean);
  const passaggi = leggiPassaggi(righePreparazione);

  if (ingredienti.length === 0 && passaggi.length === 0) {
    return null;
  }

  const porzioni = righeIngredienti
    .map((r) => pulisci(r).match(/per\s+(?:circa\s+)?(\d+(?:\s*[-/]\s*\d+)?)\s+persone/i))
    .find(Boolean)?.[1];

  return { porzioni, ingredienti, passaggi };
}

export async function fetchRicetta(nomePiatto: string): Promise<Ricetta | null> {
  const parametri = new URLSearchParams({
    action: 'parse',
    page: PREFISSO_RICETTE + nomeVisibile(nomePiatto),
    prop: 'wikitext',
    redirects: '1',
    format: 'json',
    formatversion: '2',
  });
  const response = await fetch(`https://it.wikibooks.org/w/api.php?${parametri}`, {
    headers: { 'User-Agent': WIKIPEDIA_USER_AGENT, Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Errore nel recupero della ricetta: ${response.status}`);
  }
  const data = await response.json();

  // La maggior parte dei piatti non ha una ricetta su Wikibooks: non è un errore
  if (data.error?.code === 'missingtitle') {
    return null;
  }
  if (data.error) {
    throw new Error(data.error.info ?? 'Errore nel recupero della ricetta');
  }

  const contenuto = leggiRicetta(data.parse.wikitext);
  if (!contenuto) {
    return null;
  }
  const titolo: string = data.parse.title;
  return {
    ...contenuto,
    titolo: titolo.replace(PREFISSO_RICETTE, ''),
    // encodeURI e non encodeURIComponent: le "/" del titolo devono restare tali
    url: `https://it.wikibooks.org/wiki/${encodeURI(titolo.replace(/ /g, '_'))}`,
  };
}

export function ricettaQuery(nomePiatto: string) {
  return queryOptions({
    queryKey: ['ricetta', nomePiatto],
    queryFn: () => fetchRicetta(nomePiatto),
  });
}

import { queryOptions } from '@tanstack/react-query';

export const WIKIPEDIA_USER_AGENT =
  'Forklore/1.0 (progetto scolastico ITS Prodigi; https://github.com/Barbagallo2296/Forklore)';

type WikipediaImmagine = {
  source: string;
  width: number;
  height: number;
};

export type WikipediaSummary = {
  title: string;
  extract: string;
  thumbnail?: WikipediaImmagine;
  originalimage?: WikipediaImmagine;
  url?: string;
};

export async function fetchWikipediaSummary(
  titoloPagina: string,
): Promise<WikipediaSummary> {
  const url = `https://it.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    titoloPagina,
  )}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': WIKIPEDIA_USER_AGENT,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Errore nel recupero della pagina: ${response.status}`);
  }

  const data = await response.json();

  return {
    title: data.title,
    extract: data.extract,
    thumbnail: data.thumbnail,
    originalimage: data.originalimage,
    url: data.content_urls?.mobile?.page,
  };
}

export function wikipediaQuery(titoloPagina: string) {
  return queryOptions({
    queryKey: ['wikipedia', titoloPagina],
    queryFn: () => fetchWikipediaSummary(titoloPagina),
  });
}

const LARGHEZZA_HERO = 960;

// URL di un'immagine abbastanza grande per occupare tutta la larghezza dello schermo.
// Wikimedia genera miniature solo in alcune larghezze standard (tra cui 960px):
// si parte dalla miniatura e si cambia la larghezza nell'URL.
export function immagineHero(summary: WikipediaSummary): string | undefined {
  const { thumbnail, originalimage } = summary;
  if (originalimage && originalimage.width <= LARGHEZZA_HERO) {
    return originalimage.source;
  }
  if (thumbnail && /\/\d+px-/.test(thumbnail.source)) {
    return thumbnail.source.replace(/\/\d+px-/, `/${LARGHEZZA_HERO}px-`);
  }
  return thumbnail?.source ?? originalimage?.source;
}

export type PaginaCategoria = {
  title: string;
  description?: string;
};

// Tutte le pagine di una categoria (es. "Cucina toscana") con la loro breve descrizione.
// Una sola richiesta: le categorie regionali hanno al massimo qualche centinaio di voci.
export async function fetchCategoria(categoria: string): Promise<PaginaCategoria[]> {
  const parametri = new URLSearchParams({
    action: 'query',
    generator: 'categorymembers',
    gcmtitle: `Categoria:${categoria}`,
    gcmtype: 'page',
    gcmlimit: '500',
    prop: 'description',
    format: 'json',
    formatversion: '2',
  });
  const response = await fetch(`https://it.wikipedia.org/w/api.php?${parametri}`, {
    headers: { 'User-Agent': WIKIPEDIA_USER_AGENT, Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Errore nel recupero della categoria: ${response.status}`);
  }
  const data = await response.json();
  return data.query?.pages ?? [];
}

export function categoriaQuery(categoria: string) {
  return queryOptions({
    queryKey: ['categoria', categoria],
    queryFn: () => fetchCategoria(categoria),
  });
}

// Voci delle categorie di cucina che non sono piatti: vini, oli, liquori, elenchi, persone...
const NON_PIATTI =
  /\(olio|olio (d'oliva|extra|agrumato)|\bvin[oi]\b|\(vino\)|denominazione di origine controllata|\bDOCG?\b|liquor|\bbirr|lista di|prodotti agroalimentari|\barti (minori|maggiori)\b|corporazion|ristorant|cuoc[oa]\b|\bchef\b|aziend/i;

// Tiene solo le voci che sembrano piatti, escludendo quelli già mostrati altrove
export function filtraPiatti(pagine: PaginaCategoria[], esclusi: Set<string>): string[] {
  return pagine
    .filter((p) => !p.title.startsWith('Cucina '))
    .filter((p) => !esclusi.has(p.title))
    .filter((p) => !NON_PIATTI.test(`${p.title} ${p.description ?? ''}`))
    .map((p) => p.title)
    .sort((a, b) => a.localeCompare(b, 'it'));
}

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

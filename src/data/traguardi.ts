import { REGIONI, NUMERO_PIATTI_UNICI } from './regioni';
import { contaConquistate } from './visti';

export type Traguardo = {
  id: string;
  emoji: string;
  titolo: string;
  descrizione: string;
  sbloccato: boolean;
};

type Statistiche = {
  visti: string[];
  preferiti: string[];
  progresso: Record<string, number>;
};

const NORD = [
  'valle-aosta', 'piemonte', 'liguria', 'lombardia',
  'trentino', 'veneto', 'friuli', 'emilia-romagna',
];
const CENTRO = ['toscana', 'umbria', 'marche', 'lazio'];
const SUD = [
  'abruzzo', 'molise', 'campania', 'puglia',
  'basilicata', 'calabria', 'sicilia', 'sardegna',
];

function haEsplorato(regioni: string[], progresso: Record<string, number>) {
  return regioni.every((id) => (progresso[id] ?? 0) > 0);
}

export function calcolaTraguardi({ visti, preferiti, progresso }: Statistiche): Traguardo[] {
  const conquistate = contaConquistate(progresso);
  const totalePiatti = NUMERO_PIATTI_UNICI;

  return [
    {
      id: 'primo-assaggio',
      emoji: '🥄',
      titolo: 'Primo assaggio',
      descrizione: 'Apri il tuo primo piatto',
      sbloccato: visti.length >= 1,
    },
    {
      id: 'buongustaio',
      emoji: '🍝',
      titolo: 'Buongustaio',
      descrizione: 'Scopri 25 piatti',
      sbloccato: visti.length >= 25,
    },
    {
      id: 'gourmet',
      emoji: '👨‍🍳',
      titolo: 'Gran gourmet',
      descrizione: 'Scopri 100 piatti',
      sbloccato: visti.length >= 100,
    },
    {
      id: 'leggenda',
      emoji: '👑',
      titolo: 'Leggenda della tavola',
      descrizione: `Scopri tutti i ${totalePiatti} piatti`,
      sbloccato: visti.length >= totalePiatti,
    },
    {
      id: 'collezionista',
      emoji: '❤️',
      titolo: 'Collezionista',
      descrizione: 'Salva 10 piatti tra i preferiti',
      sbloccato: preferiti.length >= 10,
    },
    {
      id: 'prima-conquista',
      emoji: '🚩',
      titolo: 'Prima conquista',
      descrizione: 'Scopri tutti i piatti di una regione',
      sbloccato: conquistate >= 1,
    },
    {
      id: 'nord',
      emoji: '🏔️',
      titolo: 'Esploratore del Nord',
      descrizione: 'Un piatto in ogni regione del Nord',
      sbloccato: haEsplorato(NORD, progresso),
    },
    {
      id: 'centro',
      emoji: '🏛️',
      titolo: 'Esploratore del Centro',
      descrizione: 'Un piatto in ogni regione del Centro',
      sbloccato: haEsplorato(CENTRO, progresso),
    },
    {
      id: 'sud',
      emoji: '🌋',
      titolo: 'Esploratore del Sud',
      descrizione: 'Un piatto in ogni regione del Sud e delle isole',
      sbloccato: haEsplorato(SUD, progresso),
    },
    {
      id: 'giro-italia',
      emoji: '🇮🇹',
      titolo: "Giro d'Italia",
      descrizione: 'Un piatto in tutte le 20 regioni',
      sbloccato: haEsplorato(
        REGIONI.map((r) => r.id),
        progresso,
      ),
    },
  ];
}

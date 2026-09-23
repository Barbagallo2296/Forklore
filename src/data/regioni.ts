export type Piatto = {
  nome: string;        
};

export type Regione = {
  id: string;
  nome: string;
  piatti: Piatto[];
};

export const REGIONI: Regione[] = [
  {
    id: 'abruzzo',
    nome: 'Abruzzo',
    piatti: [
      { nome: 'Arrosticini' },
      { nome: 'Maccheroni alla chitarra' },
    ],
  },
  {
    id: 'basilicata',
    nome: 'Basilicata',
    piatti: [
      { nome: 'Peperoni cruschi' },
      { nome: 'Pignata' },
    ],
  },
  {
    id: 'calabria',
    nome: 'Calabria',
    piatti: [
      { nome: "'Nduja" },
      { nome: 'Morzello' },
    ],
  },
  {
    id: 'campania',
    nome: 'Campania',
    piatti: [
      { nome: 'Pizza Margherita' },
      { nome: 'Sfogliatella' },
    ],
  },
  {
    id: 'emilia-romagna',
    nome: 'Emilia-Romagna',
    piatti: [
      { nome: 'Tortellini' },
      { nome: 'Lasagne alla bolognese' },
    ],
  },
  {
    id: 'friuli',
    nome: 'Friuli-Venezia Giulia',
    piatti: [
      { nome: 'Frico' },
      { nome: 'Jota' },
    ],
  },
  {
    id: 'lazio',
    nome: 'Lazio',
    piatti: [
      { nome: 'Carbonara' },
      { nome: 'Saltimbocca alla romana' },
    ],
  },
  {
    id: 'liguria',
    nome: 'Liguria',
    piatti: [
      { nome: 'Pesto alla genovese' },
      { nome: 'Focaccia genovese' },
    ],
  },
  {
    id: 'lombardia',
    nome: 'Lombardia',
    piatti: [
      { nome: 'Risotto alla milanese' },
      { nome: 'Cotoletta alla milanese' },
    ],
  },
  {
    id: 'marche',
    nome: 'Marche',
    piatti: [
      { nome: 'Vincisgrassi' },
      { nome: 'Olive ascolane' },
    ],
  },
  {
    id: 'molise',
    nome: 'Molise',
    piatti: [
      { nome: 'Cavatelli' },
      { nome: 'Pampanella' },
    ],
  },
  {
    id: 'piemonte',
    nome: 'Piemonte',
    piatti: [
      { nome: 'Bagna cauda' },
      { nome: 'Agnolotti' },
    ],
  },
  {
    id: 'puglia',
    nome: 'Puglia',
    piatti: [
      { nome: 'Orecchiette' },
      { nome: 'Burrata' },
    ],
  },
  {
    id: 'sardegna',
    nome: 'Sardegna',
    piatti: [
      { nome: 'Porceddu' },
      { nome: 'Culurgiones' },
    ],
  },
  {
    id: 'sicilia',
    nome: 'Sicilia',
    piatti: [
      { nome: 'Arancino' },
      { nome: 'Cannolo siciliano' },
    ],
  },
  {
    id: 'toscana',
    nome: 'Toscana',
    piatti: [
      { nome: 'Bistecca alla fiorentina' },
      { nome: 'Ribollita' },
    ],
  },
  {
    id: 'trentino',
    nome: 'Trentino-Alto Adige',
    piatti: [
      { nome: 'Canederli' },
      { nome: 'Strudel di mele' },
    ],
  },
  {
    id: 'umbria',
    nome: 'Umbria',
    piatti: [
      { nome: 'Strangozzi' },
      { nome: 'Torta al testo' },
    ],
  },
  {
    id: 'valle-aosta',
    nome: "Valle d'Aosta",
    piatti: [
      { nome: 'Fonduta valdostana' },
      { nome: 'Carbonade' },
    ],
  },
  {
    id: 'veneto',
    nome: 'Veneto',
    piatti: [
      { nome: 'Baccalà alla vicentina' },
      { nome: 'Risi e bisi' },
    ],
  },
];
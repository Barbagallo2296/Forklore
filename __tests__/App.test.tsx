/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App, { queryClient } from '../App';
import { cercaPiatti, NUMERO_PIATTI_UNICI } from '../src/data/regioni';
import { calcolaProgresso, contaConquistate, filtraCurati } from '../src/data/visti';
import { filtraPiatti } from '../src/data/wikipedia';
import { leggiRicetta } from '../src/data/ricette';

// TanStack Query pianifica la pulizia della cache con un timer reale di 5 minuti
// che terrebbe Jest aperto: nei test la disattiviamo (gcTime infinito)
beforeAll(() => {
  queryClient.setDefaultOptions({ queries: { gcTime: Infinity, retry: false } });
});
afterAll(() => {
  queryClient.clear();
});

// Tutti i testi visibili, uniti in una stringa
function testi(renderer: ReactTestRenderer.ReactTestRenderer): string {
  return renderer.root
    .findAll((n) => (n.type as unknown) === 'Text')
    .map((n) => ([] as unknown[]).concat(n.props.children).join(''))
    .join(' | ');
}

test("senza utente si apre il login, dopo l'accesso la home", async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(testi(renderer)).toContain('Come ti chiami?');

  const input = renderer.root.findAll((n) => n.props.placeholder === 'Il tuo nome')[0];
  await ReactTestRenderer.act(async () => {
    input.props.onChangeText('Manuel');
  });
  await ReactTestRenderer.act(async () => {
    input.props.onSubmitEditing();
  });

  expect(testi(renderer)).toContain('Ciao, Manuel');
  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
});

test('la ricerca ignora maiuscole e accenti', () => {
  expect(cercaPiatti('baba').map((p) => p.nome)).toContain('Babà');
  expect(cercaPiatti('SARDEGNA')).toHaveLength(10);
  expect(cercaPiatti('   ')).toHaveLength(0);
});

test('i progressi contano solo i piatti tipici', () => {
  const campania = ['Pizza Margherita', 'Sfogliatella', 'Spaghetti alle vongole'];
  const visti = [...campania, 'Piatto inventato'];

  expect(filtraCurati(visti)).toEqual(campania);
  const progresso = calcolaProgresso(visti);
  expect(progresso.campania).toBeCloseTo(0.3);
  expect(contaConquistate(progresso)).toBe(0);
  expect(NUMERO_PIATTI_UNICI).toBeGreaterThan(0);
});

test('gli altri piatti da Wikipedia escludono vini, oli e doppioni', () => {
  const pagine = [
    { title: 'Cucina toscana', description: 'tradizione culinaria' },
    { title: 'Toscano (olio di oliva)', description: "olio d'oliva DOP italiano" },
    { title: 'Montepulciano d\'Abruzzo', description: 'denominazione di origine controllata' },
    { title: 'Fagioli a olio' },
    { title: 'Ribollita' },
    { title: 'Befanini', description: 'prodotto da forno' },
  ];
  expect(filtraPiatti(pagine, new Set(['Ribollita']))).toEqual(['Befanini', 'Fagioli a olio']);
});

test('la ricetta di Wikibooks viene letta e ripulita dalla sintassi wiki', () => {
  const wikitext = [
    '{{Interprogetto|w=Pasta alla carbonara}}',
    '==Ingredienti==',
    "per '''2''' persone:",
    '* 125 g di [[w:guanciale|guanciale]]',
    "* 3-4 tuorli d'uovo",
    '==Preparazione==',
    '#Tagliare il guanciale a tocchetti<ref>Nota da togliere</ref>.',
    '#Cuocere gli spaghetti al dente.',
    '== Altri progetti ==',
    '* da non includere',
  ].join('\n');

  expect(leggiRicetta(wikitext)).toEqual({
    porzioni: '2',
    ingredienti: ['125 g di guanciale', "3-4 tuorli d'uovo"],
    passaggi: ['Tagliare il guanciale a tocchetti.', 'Cuocere gli spaghetti al dente.'],
  });
});

test('le sezioni di terzo livello e la preparazione a paragrafi vengono lette', () => {
  const wikitext = [
    '== Ricetta ==',
    '=== Ingredienti ===',
    'Per circa 6/7 persone:',
    '* melanzane',
    '=== Preparazione ===',
    'Si friggono le melanzane.',
    '',
    'Si compone la teglia.',
  ].join('\n');

  expect(leggiRicetta(wikitext)).toEqual({
    porzioni: '6/7',
    ingredienti: ['melanzane'],
    passaggi: ['Si friggono le melanzane.', 'Si compone la teglia.'],
  });
  expect(leggiRicetta('Solo testo, nessuna ricetta.')).toBeNull();
});

/* global jest */

// MMKV è un modulo nativo: nei test lo sostituiamo con un semplice archivio in memoria
jest.mock('react-native-mmkv', () => {
  const dati = new Map();
  return {
    createMMKV: () => ({
      getString: (chiave) => dati.get(chiave),
      set: (chiave, valore) => dati.set(chiave, valore),
      remove: (chiave) => dati.delete(chiave),
    }),
  };
});

// Le icone Lucide sono moduli ESM (.mjs) che Jest non trasforma: nei test bastano icone vuote
jest.mock('lucide-react-native', () =>
  new Proxy({ __esModule: true }, { get: (target, nome) => (nome in target ? target[nome] : () => null) }),
);

// Niente chiamate di rete vere: le richieste a Wikipedia restano in attesa
global.fetch = jest.fn(() => new Promise(() => {}));

// Senza il lato nativo SafeAreaProvider non conosce le misure dello schermo e non disegna nulla
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

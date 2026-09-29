import { jest } from '@jest/globals';

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

jest.mock('lucide-react-native', () =>
  new Proxy({ __esModule: true }, { get: (target, nome) => (nome in target ? target[nome] : () => null) }),
);

global.fetch = jest.fn(() => new Promise(() => {}));

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

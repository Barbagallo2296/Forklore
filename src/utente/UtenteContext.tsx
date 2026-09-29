import React, { createContext, useContext, useState } from 'react';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();
const CHIAVE_UTENTE = 'utente';

type UtenteContextValue = {
  nome: string | null;
  accedi: (nome: string) => void;
  esci: () => void;
};

const UtenteContext = createContext<UtenteContextValue | undefined>(undefined);

export function UtenteProvider({ children }: { children: React.ReactNode }) {
  const [nome, setNome] = useState<string | null>(
    () => storage.getString(CHIAVE_UTENTE) ?? null,
  );

  const accedi = (nuovoNome: string) => {
    const pulito = nuovoNome.trim();
    if (!pulito) {
      return;
    }
    setNome(pulito);
    storage.set(CHIAVE_UTENTE, pulito);
  };

  const esci = () => {
    setNome(null);
    storage.remove(CHIAVE_UTENTE);
  };

  return (
    <UtenteContext.Provider value={{ nome, accedi, esci }}>{children}</UtenteContext.Provider>
  );
}

export function useUtente(): UtenteContextValue {
  const context = useContext(UtenteContext);
  if (!context) {
    throw new Error('useUtente deve essere usato dentro un UtenteProvider');
  }
  return context;
}

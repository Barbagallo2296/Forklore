import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './src/theme/ThemeContext';
import { UtenteProvider } from './src/utente/UtenteContext';
import AppNavigator from './src/navigation/AppNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UtenteProvider>
          <AppNavigator />
        </UtenteProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
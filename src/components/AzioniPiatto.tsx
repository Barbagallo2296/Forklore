import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { MapPin, Search } from 'lucide-react-native';
import { nomeVisibile } from '../data/regioni';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';

type Props = {
  nomePiatto: string;
};

function urlRistoranti(nome: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`ristorante ${nome}`)}`;
}

function urlRicette(nome: string): string {
  return `https://www.giallozafferano.it/ricerca-ricette/${encodeURIComponent(nome)}/`;
}

export default function AzioniPiatto({ nomePiatto }: Props) {
  const { colors } = useTheme();
  const nome = nomeVisibile(nomePiatto);

  const azioni = [
    { etichetta: 'Dove mangiarlo', Icona: MapPin, url: urlRistoranti(nome) },
    { etichetta: 'Cerca la ricetta', Icona: Search, url: urlRicette(nome) },
  ];

  return (
    <View style={styles.riga}>
      {azioni.map(({ etichetta, Icona, url }) => (
        <TouchableOpacity
          key={etichetta}
          style={[styles.bottone, { borderColor: colors.primary }]}
          onPress={() => Linking.openURL(url)}
          activeOpacity={0.7}
        >
          <Icona size={17} color={colors.primary} />
          <Text style={[styles.testo, { color: colors.primary }]}>{etichetta}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  riga: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  bottone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  testo: {
    fontFamily: font.bold,
    fontSize: 14,
  },
});

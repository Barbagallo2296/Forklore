import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react-native';
import { getPiattoDelGiorno, nomeVisibile } from '../data/regioni';
import { wikipediaQuery, immagineHero } from '../data/wikipedia';
import ImmagineDissolvenza from './ImmagineDissolvenza';
import Sfumatura from './Sfumatura';
import { ombra } from './Card';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'Regioni'>;

export default function PiattoDelGiorno() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const piatto = getPiattoDelGiorno();

  const { data } = useQuery(wikipediaQuery(piatto.nome));
  const immagine = data ? immagineHero(data) : undefined;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.placeholder }]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('DettaglioPiatto', { piattoNome: piatto.nome })}
    >
      {immagine ? (
        <ImmagineDissolvenza uri={immagine} style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.segnaposto]}>
          <Text style={styles.segnapostoEmoji}>🍽️</Text>
        </View>
      )}

      {/* Sfumatura scura in basso per rendere leggibile il testo sopra la foto */}
      <Sfumatura />

      <View style={[styles.etichetta, { backgroundColor: colors.primary }]}>
        <Sparkles size={12} color={colors.onPrimary} />
        <Text style={[styles.etichettaTesto, { color: colors.onPrimary }]}>PIATTO DEL GIORNO</Text>
      </View>

      <View style={styles.testi}>
        <Text style={styles.nome} numberOfLines={2}>
          {nomeVisibile(piatto.nome)}
        </Text>
        <Text style={styles.regione}>{piatto.regioneNome}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    justifyContent: 'space-between',
    ...ombra,
  },
  segnaposto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  segnapostoEmoji: {
    fontSize: 56,
  },
  etichetta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    margin: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  etichettaTesto: {
    fontFamily: font.extrabold,
    fontSize: 10,
    letterSpacing: 1,
  },
  testi: {
    padding: 16,
  },
  nome: {
    fontFamily: font.titolo,
    fontSize: 24,
    lineHeight: 30,
    color: '#FFFFFF',
  },
  regione: {
    fontFamily: font.semibold,
    fontSize: 14,
    color: '#FFFFFFD9',
    marginTop: 2,
  },
});

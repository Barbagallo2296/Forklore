import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ExternalLink } from 'lucide-react-native';
import Card from './Card';
import Skeleton from './Skeleton';
import { ricettaQuery } from '../data/ricette';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';

type Props = {
  nomePiatto: string;
};

const RIGHE_SKELETON = ['60%', '80%', '70%', '90%'] as const;

export default function RicettaCard({ nomePiatto }: Props) {
  const { colors } = useTheme();
  const { data: ricetta, isLoading } = useQuery(ricettaQuery(nomePiatto));

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <Skeleton width={120} height={24} style={styles.rigaSkeleton} />
        {RIGHE_SKELETON.map((larghezza, i) => (
          <Skeleton key={i} width={larghezza} height={14} style={styles.rigaSkeleton} />
        ))}
      </Card>
    );
  }

  if (!ricetta) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <View style={styles.intestazione}>
        <View style={[styles.icona, { backgroundColor: colors.primaryLight }]}>
          <BookOpen size={18} color={colors.primary} />
        </View>
        <View>
          <Text style={[testo.titoloSezione, { color: colors.textPrimary }]}>Ricetta</Text>
          <Text style={[styles.sottotitolo, { color: colors.textSecondary }]}>
            da Wikibooks{ricetta.porzioni ? ` · per ${ricetta.porzioni} persone` : ''}
          </Text>
        </View>
      </View>

      {ricetta.ingredienti.length > 0 && (
        <>
          <Text style={[styles.titoletto, { color: colors.textPrimary }]}>Ingredienti</Text>
          {ricetta.ingredienti.map((ingrediente, i) => (
            <View key={i} style={styles.ingrediente}>
              <View style={[styles.pallino, { backgroundColor: colors.primary }]} />
              <Text style={[styles.testo, { color: colors.textPrimary }]}>{ingrediente}</Text>
            </View>
          ))}
        </>
      )}

      {ricetta.passaggi.length > 0 && (
        <>
          <Text style={[styles.titoletto, { color: colors.textPrimary }]}>Preparazione</Text>
          {ricetta.passaggi.map((passaggio, i) => (
            <View key={i} style={styles.passaggio}>
              <View style={[styles.numero, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.numeroTesto, { color: colors.primary }]}>{i + 1}</Text>
              </View>
              <Text style={[styles.testo, { color: colors.textPrimary }]}>{passaggio}</Text>
            </View>
          ))}
        </>
      )}

      <TouchableOpacity
        style={styles.link}
        onPress={() => Linking.openURL(ricetta.url)}
        activeOpacity={0.7}
      >
        <ExternalLink size={15} color={colors.primary} />
        <Text style={[styles.linkTesto, { color: colors.primary }]}>
          Ricetta completa su Wikibooks
        </Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginTop: 20,
  },
  rigaSkeleton: {
    marginBottom: 10,
  },
  intestazione: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icona: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sottotitolo: {
    fontFamily: font.regular,
    fontSize: 13,
  },
  titoletto: {
    fontFamily: font.extrabold,
    fontSize: 14,
    marginTop: 18,
    marginBottom: 8,
  },
  ingrediente: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  pallino: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 9,
  },
  passaggio: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  numero: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numeroTesto: {
    fontFamily: font.extrabold,
    fontSize: 13,
  },
  testo: {
    flex: 1,
    fontFamily: font.regular,
    fontSize: 15,
    lineHeight: 23,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  linkTesto: {
    fontFamily: font.bold,
    fontSize: 14,
  },
});

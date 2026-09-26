import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { wikipediaQuery } from '../data/wikipedia';
import Skeleton from './Skeleton';
import Card from './Card';
import SagomaRegione from './SagomaRegione';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';

type Props = {
  regioneId: string;
  nome: string;
  scoperti: number;
  totale: number;
};

const RIGHE_SKELETON = ['100%', '100%', '95%', '70%'] as const;

export default function InfoRegione({ regioneId, nome, scoperti, totale }: Props) {
  const { colors } = useTheme();
  const [espanso, setEspanso] = useState(false);
  const { data, isLoading, isError } = useQuery(wikipediaQuery(nome));

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.intestazione}>
          <View style={[styles.sagoma, { backgroundColor: colors.background }]}>
            <SagomaRegione regioneId={regioneId} progresso={scoperti / totale} size={56} />
          </View>
          <View style={styles.titoli}>
            <Text style={[testo.titolo, { color: colors.textPrimary }]}>{nome}</Text>
            <Text
              style={[
                styles.scoperti,
                { color: scoperti === totale ? colors.secondary : colors.textSecondary },
              ]}
            >
              {scoperti === totale
                ? 'Regione conquistata!'
                : `${scoperti} di ${totale} piatti scoperti`}
            </Text>
          </View>
        </View>

        {isError ? null : isLoading || !data ? (
          RIGHE_SKELETON.map((larghezza, i) => (
            <Skeleton key={i} width={larghezza} height={14} style={styles.rigaSkeleton} />
          ))
        ) : (
          <>
            <Text
              style={[styles.testo, { color: colors.textSecondary }]}
              numberOfLines={espanso ? undefined : 4}
            >
              {data.extract}
            </Text>
            <TouchableOpacity onPress={() => setEspanso((v) => !v)} hitSlop={8}>
              <Text style={[styles.altro, { color: colors.primary }]}>
                {espanso ? 'Mostra meno' : 'Mostra di più'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Card>

      <Text style={[testo.titoloSezione, styles.sezione, { color: colors.textPrimary }]}>
        Piatti tipici
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 20,
  },
  intestazione: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sagoma: {
    width: 68,
    height: 68,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  titoli: {
    flex: 1,
  },
  scoperti: {
    fontFamily: font.semibold,
    fontSize: 13,
    marginTop: 2,
  },
  testo: {
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  rigaSkeleton: {
    marginBottom: 8,
  },
  altro: {
    fontFamily: font.bold,
    fontSize: 14,
    marginTop: 8,
  },
  sezione: {
    marginBottom: 12,
  },
});

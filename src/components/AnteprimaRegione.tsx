import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronRight, X } from 'lucide-react-native';
import { ombra } from './Card';
import ImmagineDissolvenza from './ImmagineDissolvenza';
import SagomaRegione from './SagomaRegione';
import { wikipediaQuery } from '../data/wikipedia';
import { nomeVisibile, type Regione } from '../data/regioni';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';

type Props = {
  regione: Regione;
  visti: string[];
  onApriRegione: (regioneId: string) => void;
  onApriPiatto: (nome: string) => void;
  onChiudi: () => void;
};

const PIATTI_IN_ANTEPRIMA = 3;

function MiniaturaPiatto({
  nome,
  visto,
  onPress,
}: {
  nome: string;
  visto: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { data } = useQuery(wikipediaQuery(nome));

  return (
    <TouchableOpacity style={styles.miniatura} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.miniaturaFoto, { backgroundColor: colors.placeholder }]}>
        {data?.thumbnail ? (
          <ImmagineDissolvenza uri={data.thumbnail.source} style={StyleSheet.absoluteFill} />
        ) : (
          <Text style={styles.miniaturaEmoji}>🍽️</Text>
        )}
        {visto && (
          <View style={[styles.visto, { backgroundColor: colors.secondary }]}>
            <Check size={11} color={colors.onPrimary} strokeWidth={3} />
          </View>
        )}
      </View>
      <Text style={[styles.miniaturaNome, { color: colors.textPrimary }]} numberOfLines={2}>
        {nomeVisibile(nome)}
      </Text>
    </TouchableOpacity>
  );
}

export default function AnteprimaRegione({
  regione,
  visti,
  onApriRegione,
  onApriPiatto,
  onChiudi,
}: Props) {
  const { colors } = useTheme();
  const entrata = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entrata, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  }, [entrata]);

  const totale = regione.piatti.length;
  const scoperti = regione.piatti.filter((p) => visti.includes(p.nome)).length;
  const progresso = scoperti / totale;
  const conquistata = scoperti === totale;
  const translateY = entrata.interpolate({ inputRange: [0, 1], outputRange: [320, 0] });

  return (
    <Animated.View
      style={[
        styles.scheda,
        { backgroundColor: colors.card, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.intestazione}>
        <View style={[styles.sagoma, { backgroundColor: colors.background }]}>
          <SagomaRegione regioneId={regione.id} progresso={progresso} size={44} />
        </View>
        <View style={styles.titoli}>
          <Text style={[testo.titolo, { color: colors.textPrimary }]}>{regione.nome}</Text>
          <Text
            style={[
              styles.sottotitolo,
              { color: conquistata ? colors.secondary : colors.textSecondary },
            ]}
          >
            {conquistata ? 'Regione conquistata!' : `${scoperti} di ${totale} piatti scoperti`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onChiudi}
          hitSlop={10}
          style={[styles.chiudi, { backgroundColor: colors.background }]}
        >
          <X size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.barra, { backgroundColor: colors.placeholder }]}>
        <View
          style={[
            styles.barraPiena,
            {
              width: `${progresso * 100}%`,
              backgroundColor: conquistata ? colors.secondary : colors.primary,
            },
          ]}
        />
      </View>

      <View style={styles.miniature}>
        {regione.piatti.slice(0, PIATTI_IN_ANTEPRIMA).map((p) => (
          <MiniaturaPiatto
            key={p.nome}
            nome={p.nome}
            visto={visti.includes(p.nome)}
            onPress={() => onApriPiatto(p.nome)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.bottone, { backgroundColor: colors.primary }]}
        onPress={() => onApriRegione(regione.id)}
        activeOpacity={0.85}
      >
        <Text style={[styles.bottoneTesto, { color: colors.onPrimary }]}>
          Apri la regione · {totale} piatti
        </Text>
        <ChevronRight size={18} color={colors.onPrimary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scheda: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 20,
    padding: 16,
    ...ombra,
    elevation: 8,
  },
  intestazione: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sagoma: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titoli: {
    flex: 1,
  },
  sottotitolo: {
    fontFamily: font.semibold,
    fontSize: 13,
    marginTop: 1,
  },
  chiudi: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barra: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  barraPiena: {
    height: '100%',
    borderRadius: 3,
  },
  miniature: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  miniatura: {
    flex: 1,
  },
  miniaturaFoto: {
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniaturaEmoji: {
    fontSize: 24,
  },
  visto: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniaturaNome: {
    fontFamily: font.semibold,
    fontSize: 12,
    marginTop: 5,
  },
  bottone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 13,
    borderRadius: 14,
  },
  bottoneTesto: {
    fontFamily: font.bold,
    fontSize: 15,
  },
});

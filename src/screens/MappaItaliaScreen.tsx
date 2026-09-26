import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  type GestureResponderEvent,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { RotateCcw } from 'lucide-react-native';
import { REGIONI_PATHS, MAPPA_VIEWBOX } from '../data/mappaItaliaPaths';
import { ETICHETTE_MAPPA } from '../data/mappaEtichette';
import { REGIONI } from '../data/regioni';
import { getVisti, calcolaProgresso, contaConquistate } from '../data/visti';
import { ombra } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'Regioni'>;

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_NOMI = 1.8;

function limita(valore: number, min: number, max: number) {
  return Math.min(Math.max(valore, min), max);
}

function distanzaDita(e: GestureResponderEvent) {
  const [a, b] = e.nativeEvent.touches;
  return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
}

export default function MappaItaliaScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const [regioneAttiva, setRegioneAttiva] = useState<string | null>(null);
  const [visti, setVisti] = useState<string[]>([]);
  const [zoomato, setZoomato] = useState(false);
  const [mostraNomi, setMostraNomi] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setVisti(getVisti());
    }, []),
  );

  // Percentuale di piatti visti per ogni regione (da 0 a 1)
  const progresso = useMemo(() => calcolaProgresso(visti), [visti]);
  const conquistate = contaConquistate(progresso);
  const nomeRegioneAttiva = REGIONI.find((r) => r.id === regioneAttiva)?.nome;

  // --- Zoom e spostamento ---
  const scala = useRef(new Animated.Value(1)).current;
  const trasla = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const dimensioni = useRef({ larghezza: 0, altezza: 0 });
  const gesto = useRef({
    scala: 1,
    x: 0,
    y: 0,
    dita: 0,
    distanzaIniziale: 0,
    scalaIniziale: 1,
    ultimoX: 0,
    ultimoY: 0,
  });

  const aggiornaVista = (nuovaScala: number, x: number, y: number) => {
    const g = gesto.current;
    const maxX = (dimensioni.current.larghezza * (nuovaScala - 1)) / 2;
    const maxY = (dimensioni.current.altezza * (nuovaScala - 1)) / 2;
    g.scala = nuovaScala;
    g.x = limita(x, -maxX, maxX);
    g.y = limita(y, -maxY, maxY);
    scala.setValue(g.scala);
    trasla.setValue({ x: g.x, y: g.y });
  };

  const fineGesto = () => {
    gesto.current.dita = 0;
    setZoomato(gesto.current.scala > 1.05);
    setMostraNomi(gesto.current.scala >= ZOOM_NOMI);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e, g) =>
        e.nativeEvent.touches.length === 2 ||
        (gesto.current.scala > 1 && (Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6)),
      onPanResponderGrant: () => {
        gesto.current.dita = 0;
        setRegioneAttiva(null);
      },
      onPanResponderMove: (e) => {
        const g = gesto.current;
        const tocchi = e.nativeEvent.touches;

        if (tocchi.length === 2) {
          if (g.dita !== 2) {
            g.distanzaIniziale = distanzaDita(e);
            g.scalaIniziale = g.scala;
            g.dita = 2;
          }
          const nuovaScala = limita(
            g.scalaIniziale * (distanzaDita(e) / g.distanzaIniziale),
            ZOOM_MIN,
            ZOOM_MAX,
          );
          aggiornaVista(nuovaScala, g.x, g.y);
        } else if (tocchi.length === 1) {
          const dito = tocchi[0];
          if (g.dita !== 1) {
            g.ultimoX = dito.pageX;
            g.ultimoY = dito.pageY;
            g.dita = 1;
          }
          aggiornaVista(g.scala, g.x + dito.pageX - g.ultimoX, g.y + dito.pageY - g.ultimoY);
          g.ultimoX = dito.pageX;
          g.ultimoY = dito.pageY;
        }
      },
      onPanResponderRelease: fineGesto,
      onPanResponderTerminate: fineGesto,
    }),
  ).current;

  const reimpostaZoom = () => {
    const g = gesto.current;
    g.scala = 1;
    g.x = 0;
    g.y = 0;
    Animated.parallel([
      Animated.spring(scala, { toValue: 1, useNativeDriver: true }),
      Animated.spring(trasla, { toValue: { x: 0, y: 0 }, useNativeDriver: true }),
    ]).start();
    setZoomato(false);
    setMostraNomi(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.contatore, { color: colors.textPrimary }]}>
        Regioni conquistate: <Text style={{ color: colors.primary }}>{conquistate}</Text>/
        {REGIONI.length}
      </Text>

      <View
        style={styles.svgWrapper}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          dimensioni.current = { larghezza: width, altezza: height };
        }}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[
            styles.svgZoom,
            {
              transform: [
                { translateX: trasla.x },
                { translateY: trasla.y },
                { scale: scala },
              ],
            },
          ]}
        >
          <Svg viewBox={MAPPA_VIEWBOX} width="100%" height="100%">
            {REGIONI_PATHS.map((regione) => {
              const percentuale = progresso[regione.id] ?? 0;
              const attiva = regioneAttiva === regione.id;
              const colorata = attiva || percentuale > 0;
              return (
                <Path
                  key={regione.id}
                  d={regione.d}
                  fill={colorata ? colors.primary : colors.card}
                  fillOpacity={attiva ? 1 : percentuale > 0 ? 0.2 + percentuale * 0.8 : 1}
                  stroke={colors.textTertiary}
                  strokeWidth={0.8}
                  onPressIn={() => setRegioneAttiva(regione.id)}
                  onPress={() => {
                    setRegioneAttiva(null);
                    navigation.navigate('PiattiRegione', { regioneId: regione.id });
                  }}
                />
              );
            })}

            {mostraNomi &&
              REGIONI_PATHS.map((regione) => {
                const etichetta = ETICHETTE_MAPPA[regione.id];
                if (!etichetta) {
                  return null;
                }
                return (
                  <SvgText
                    key={`nome-${regione.id}`}
                    x={etichetta.x}
                    y={etichetta.y}
                    fontSize={7}
                    fontFamily={font.semibold}
                    fill={colors.textPrimary}
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {etichetta.testo}
                  </SvgText>
                );
              })}
          </Svg>
        </Animated.View>

        {zoomato && (
          <TouchableOpacity
            style={[styles.bottoneReset, { backgroundColor: colors.card }]}
            onPress={reimpostaZoom}
            activeOpacity={0.7}
          >
            <RotateCcw size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.legenda}>
        <View style={styles.legendaVoce}>
          <View
            style={[
              styles.quadratino,
              { backgroundColor: colors.card, borderColor: colors.textSecondary },
            ]}
          />
          <Text style={[styles.legendaTesto, { color: colors.textSecondary }]}>Da scoprire</Text>
        </View>
        <View style={styles.legendaVoce}>
          <View
            style={[
              styles.quadratino,
              styles.quadratinoInCorso,
              { backgroundColor: colors.primary, borderColor: colors.textSecondary },
            ]}
          />
          <Text style={[styles.legendaTesto, { color: colors.textSecondary }]}>In corso</Text>
        </View>
        <View style={styles.legendaVoce}>
          <View
            style={[
              styles.quadratino,
              { backgroundColor: colors.primary, borderColor: colors.textSecondary },
            ]}
          />
          <Text style={[styles.legendaTesto, { color: colors.textSecondary }]}>Conquistata</Text>
        </View>
      </View>

      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {nomeRegioneAttiva ?? 'Tocca una regione · pizzica per ingrandire'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  contatore: {
    fontSize: 15,
    fontFamily: font.semibold,
    marginBottom: 8,
  },
  svgWrapper: {
    width: '100%',
    aspectRatio: 500 / 620,
    overflow: 'hidden',
  },
  svgZoom: {
    width: '100%',
    height: '100%',
  },
  bottoneReset: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...ombra,
  },
  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    marginTop: 10,
  },
  legendaVoce: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  quadratino: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 0.5,
  },
  quadratinoInCorso: {
    opacity: 0.45,
  },
  legendaTesto: {
    fontFamily: font.regular,
    fontSize: 12,
  },
  hint: {
    marginTop: 8,
    fontFamily: font.regular,
    fontSize: 14,
    textAlign: 'center',
  },
});

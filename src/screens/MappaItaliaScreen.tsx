import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  BackHandler,
  StyleSheet,
  type GestureResponderEvent,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { RotateCcw } from 'lucide-react-native';
import { REGIONI_PATHS, MAPPA_VIEWBOX } from '../data/mappaItaliaPaths';
import { ETICHETTE_MAPPA } from '../data/mappaEtichette';
import { REGIONI, NUMERO_PIATTI_UNICI } from '../data/regioni';
import {
  getVisti,
  filtraCurati,
  calcolaProgresso,
  contaConquistate,
} from '../data/visti';
import Card, { ombra } from '../components/Card';
import AnteprimaRegione from '../components/AnteprimaRegione';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'Mappa'>;

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_NOMI = 1.8;
const [, , LARGHEZZA_MAPPA, ALTEZZA_MAPPA] =
  MAPPA_VIEWBOX.split(' ').map(Number);

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
  const [selezionata, setSelezionata] = useState<string | null>(null);
  const [visti, setVisti] = useState<string[]>([]);
  const [zoomato, setZoomato] = useState(false);
  const [mostraNomi, setMostraNomi] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setVisti(getVisti());
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const sottoscrizione = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (selezionata) {
            setSelezionata(null);
            return true;
          }
          return false;
        },
      );
      return () => sottoscrizione.remove();
    }, [selezionata]),
  );

  const progresso = useMemo(() => calcolaProgresso(visti), [visti]);
  const conquistate = contaConquistate(progresso);
  const piattiScoperti = filtraCurati(visti).length;
  const regioneSelezionata = REGIONI.find(r => r.id === selezionata);

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
      },
      onPanResponderMove: e => {
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
          aggiornaVista(
            g.scala,
            g.x + dito.pageX - g.ultimoX,
            g.y + dito.pageY - g.ultimoY,
          );
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
      Animated.spring(trasla, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }),
    ]).start();
    setZoomato(false);
    setMostraNomi(false);
  };

  const legenda = [
    {
      etichetta: 'Da scoprire',
      stile: { backgroundColor: colors.card, borderColor: colors.textTertiary },
    },
    {
      etichetta: 'In corso',
      stile: [styles.quadratinoInCorso, { backgroundColor: colors.primary }],
    },
    { etichetta: 'Conquistata', stile: { backgroundColor: colors.primary } },
  ];

  const nomiVisibili = REGIONI_PATHS.filter(
    r => mostraNomi || r.id === selezionata,
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!regioneSelezionata && (
        <Card style={styles.progressi}>
          <View style={styles.numeri}>
            <View>
              <Text style={[styles.numeroGrande, { color: colors.primary }]}>
                {conquistate}
                <Text
                  style={[styles.numeroTotale, { color: colors.textTertiary }]}
                >
                  /{REGIONI.length}
                </Text>
              </Text>
              <Text style={[styles.etichetta, { color: colors.textSecondary }]}>
                regioni conquistate
              </Text>
            </View>
            <View style={styles.numeroDestra}>
              <Text style={[styles.numeroMedio, { color: colors.textPrimary }]}>
                {piattiScoperti}
                <Text
                  style={[
                    styles.numeroTotalePiccolo,
                    { color: colors.textTertiary },
                  ]}
                >
                  /{NUMERO_PIATTI_UNICI}
                </Text>
              </Text>
              <Text style={[styles.etichetta, { color: colors.textSecondary }]}>
                piatti scoperti
              </Text>
            </View>
          </View>
          <View style={[styles.barra, { backgroundColor: colors.placeholder }]}>
            <View
              style={[
                styles.barraPiena,
                {
                  width: `${(piattiScoperti / NUMERO_PIATTI_UNICI) * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <View style={styles.legenda}>
            {legenda.map(voce => (
              <View key={voce.etichetta} style={styles.legendaVoce}>
                <View
                  style={[
                    styles.quadratino,
                    { borderColor: colors.textTertiary },
                    voce.stile,
                  ]}
                />
                <Text
                  style={[styles.legendaTesto, { color: colors.textSecondary }]}
                >
                  {voce.etichetta}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      <View
        style={styles.svgWrapper}
        onLayout={e => {
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
            <Rect
              x={0}
              y={0}
              width={LARGHEZZA_MAPPA}
              height={ALTEZZA_MAPPA}
              fill={colors.background}
              onPress={() => setSelezionata(null)}
            />
            {REGIONI_PATHS.map(regione => {
              const percentuale = progresso[regione.id] ?? 0;
              const scelta = selezionata === regione.id;
              return (
                <Path
                  key={regione.id}
                  d={regione.d}
                  fill={
                    scelta || percentuale > 0 ? colors.primary : colors.card
                  }
                  fillOpacity={
                    scelta ? 1 : percentuale > 0 ? 0.25 + percentuale * 0.75 : 1
                  }
                  stroke={scelta ? colors.textPrimary : colors.textTertiary}
                  strokeWidth={scelta ? 2 : 0.8}
                  onPress={() => setSelezionata(regione.id)}
                />
              );
            })}

            {nomiVisibili.map(regione => {
              const etichetta = ETICHETTE_MAPPA[regione.id];
              if (!etichetta) {
                return null;
              }
              const scelta = regione.id === selezionata;
              return (
                <SvgText
                  key={`nome-${regione.id}`}
                  x={etichetta.x}
                  y={etichetta.y}
                  fontSize={scelta && !mostraNomi ? 11 : 7}
                  fontFamily={font.bold}
                  fill={scelta ? colors.onPrimary : colors.textPrimary}
                  stroke={scelta ? colors.primary : undefined}
                  strokeWidth={scelta ? 0.4 : 0}
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

        {!regioneSelezionata && (
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Tocca una regione · pizzica per ingrandire
          </Text>
        )}
      </View>

      {regioneSelezionata && (
        <AnteprimaRegione
          regione={regioneSelezionata}
          visti={visti}
          onChiudi={() => setSelezionata(null)}
          onApriRegione={regioneId =>
            navigation.navigate('PiattiRegione', { regioneId })
          }
          onApriPiatto={nome =>
            navigation.navigate('DettaglioPiatto', {
              piattoNome: nome,
              regioneId: regioneSelezionata.id,
            })
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
  },
  progressi: {
    padding: 16,
  },
  numeri: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  numeroDestra: {
    alignItems: 'flex-end',
  },
  numeroGrande: {
    fontFamily: font.extrabold,
    fontSize: 30,
  },
  numeroTotale: {
    fontFamily: font.bold,
    fontSize: 17,
  },
  numeroMedio: {
    fontFamily: font.extrabold,
    fontSize: 20,
  },
  numeroTotalePiccolo: {
    fontFamily: font.bold,
    fontSize: 14,
  },
  etichetta: {
    fontFamily: font.regular,
    fontSize: 13,
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
  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 12,
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
  svgWrapper: {
    flex: 1,
    marginTop: 8,
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
  hint: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    fontFamily: font.regular,
    fontSize: 14,
    textAlign: 'center',
  },
});

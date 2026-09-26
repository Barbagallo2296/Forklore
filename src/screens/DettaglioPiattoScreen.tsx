import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
  Share,
  Animated,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Heart, ExternalLink, MapPin, Share2, X } from 'lucide-react-native';
import { wikipediaQuery, immagineHero, WIKIPEDIA_USER_AGENT } from '../data/wikipedia';
import { isPreferito, toggleFavorito } from '../data/preferiti';
import { segnaVisto } from '../data/visti';
import { TUTTI_I_PIATTI } from '../data/regioni';
import Skeleton from '../components/Skeleton';
import ImmagineDissolvenza from '../components/ImmagineDissolvenza';
import StatoVuoto from '../components/StatoVuoto';
import { ombra } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type RoutePropType = RouteProp<RegioniStackParamList, 'DettaglioPiatto'>;
type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'DettaglioPiatto'>;

const RIGHE_SKELETON = ['100%', '95%', '100%', '88%', '60%'] as const;
const LUNGHEZZA_ESTRATTO_CONDIVISO = 220;
const ALTEZZA_HERO = 300;

export default function DettaglioPiattoScreen() {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  const { piattoNome } = route.params;
  const { colors } = useTheme();

  const [preferito, setPreferito] = useState(() => isPreferito(piattoNome));
  const [immagineAperta, setImmagineAperta] = useState(false);
  const scalaCuore = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    segnaVisto(piattoNome);
  }, [piattoNome]);

  const { data, isLoading, isError } = useQuery(wikipediaQuery(piattoNome));

  const piattoInfo = TUTTI_I_PIATTI.find((p) => p.nome === piattoNome);
  const piattiCollegati = piattoInfo
    ? TUTTI_I_PIATTI.filter(
        (p) => p.regioneId === piattoInfo.regioneId && p.nome !== piattoNome,
      )
    : [];

  const handleToggle = () => {
    toggleFavorito(piattoNome);
    setPreferito((prev) => !prev);
    Animated.sequence([
      Animated.timing(scalaCuore, { toValue: 1.35, duration: 120, useNativeDriver: true }),
      Animated.spring(scalaCuore, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const handleCondividi = () => {
    if (!data) {
      return;
    }
    const estratto =
      data.extract.length > LUNGHEZZA_ESTRATTO_CONDIVISO
        ? `${data.extract.slice(0, LUNGHEZZA_ESTRATTO_CONDIVISO).trimEnd()}…`
        : data.extract;
    const righe = [
      `🍴 ${data.title}${piattoInfo ? ` (${piattoInfo.regioneNome})` : ''}`,
      '',
      estratto,
    ];
    if (data.url) {
      righe.push('', `Scopri di più: ${data.url}`);
    }
    righe.push('', 'Condiviso da Forklore');
    Share.share({ title: data.title, message: righe.join('\n') });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Skeleton width="100%" height={ALTEZZA_HERO} borderRadius={0} style={styles.skeletonHero} />
        <View style={styles.contenuto}>
          <Skeleton width={110} height={24} borderRadius={12} style={styles.rigaSkeleton} />
          <Skeleton width="75%" height={32} style={styles.rigaSkeleton} />
          <View style={[styles.divider, { backgroundColor: colors.placeholder }]} />
          {RIGHE_SKELETON.map((larghezza, i) => (
            <Skeleton key={i} width={larghezza} height={16} style={styles.rigaSkeleton} />
          ))}
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <StatoVuoto
          emoji="😕"
          titolo="Piatto non disponibile"
          messaggio="Non è stato possibile caricare le informazioni. Controlla la connessione e riprova."
        />
      </View>
    );
  }

  const immagineGrande = data.originalimage ?? data.thumbnail;
  const hero = immagineHero(data);

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          {hero ? (
            <TouchableOpacity activeOpacity={0.9} onPress={() => setImmagineAperta(true)}>
              <ImmagineDissolvenza uri={hero} style={styles.heroImmagine} />
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.heroImmagine,
                styles.heroSegnaposto,
                { backgroundColor: colors.placeholder },
              ]}
            >
              <Text style={styles.heroSegnapostoEmoji}>🍽️</Text>
            </View>
          )}

          <View style={styles.azioni}>
            <TouchableOpacity
              style={[styles.azioneButton, { backgroundColor: colors.card }]}
              onPress={handleCondividi}
              activeOpacity={0.7}
            >
              <Share2 size={19} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.azioneButton, { backgroundColor: colors.card }]}
              onPress={handleToggle}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ scale: scalaCuore }] }}>
                <Heart
                  size={20}
                  color={colors.primary}
                  fill={preferito ? colors.primary : 'transparent'}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contenuto}>
          {piattoInfo && (
            <View style={[styles.chipRegione, { backgroundColor: colors.secondaryLight }]}>
              <MapPin size={13} color={colors.secondary} />
              <Text style={[styles.chipRegioneTesto, { color: colors.secondary }]}>
                {piattoInfo.regioneNome}
              </Text>
            </View>
          )}

          <Text style={[testo.titoloGrande, { color: colors.textPrimary }]}>{data.title}</Text>
          <View style={[styles.divider, { backgroundColor: colors.primary }]} />
          <Text style={[testo.corpo, { color: colors.textPrimary }]}>{data.extract}</Text>

          {data.url && (
            <TouchableOpacity
              style={[styles.bottoneWiki, { backgroundColor: colors.primary }]}
              onPress={() => Linking.openURL(data.url!)}
              activeOpacity={0.8}
            >
              <ExternalLink size={17} color={colors.onPrimary} />
              <Text style={[styles.bottoneWikiTesto, { color: colors.onPrimary }]}>
                Leggi tutto su Wikipedia
              </Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.fonte, { color: colors.textTertiary }]}>
            Testo e immagini da Wikipedia
          </Text>

          {piattoInfo && piattiCollegati.length > 0 && (
            <View style={styles.collegatiSezione}>
              <Text
                style={[testo.titoloSezione, styles.collegatiTitolo, { color: colors.textPrimary }]}
              >
                Altri piatti · {piattoInfo.regioneNome}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.collegatiLista}
              >
                {piattiCollegati.map((p) => (
                  <TouchableOpacity
                    key={p.nome}
                    style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.border }]}
                    activeOpacity={0.7}
                    onPress={() => navigation.push('DettaglioPiatto', { piattoNome: p.nome })}
                  >
                    <Text style={[styles.chipTesto, { color: colors.textPrimary }]}>{p.nome}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {immagineGrande && (
        <Modal
          visible={immagineAperta}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setImmagineAperta(false)}
        >
          <Pressable
            style={[styles.modalSfondo, { backgroundColor: colors.overlay }]}
            onPress={() => setImmagineAperta(false)}
          >
            <Image
              source={{
                uri: immagineGrande.source,
                headers: { 'User-Agent': WIKIPEDIA_USER_AGENT },
              }}
              style={styles.immagineIntera}
              resizeMode="contain"
            />
            <View style={styles.chiudi}>
              <X color="#ffffff" size={28} />
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  skeletonHero: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  rigaSkeleton: {
    marginBottom: 10,
  },
  hero: {
    marginBottom: 8,
  },
  heroImmagine: {
    width: '100%',
    height: ALTEZZA_HERO,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroSegnaposto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSegnapostoEmoji: {
    fontSize: 64,
  },
  // I bottoni stanno a cavallo del bordo inferiore dell'immagine
  azioni: {
    position: 'absolute',
    right: 20,
    bottom: -23,
    flexDirection: 'row',
    gap: 10,
  },
  azioneButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    ...ombra,
    elevation: 4,
  },
  contenuto: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  chipRegione: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  chipRegioneTesto: {
    fontFamily: font.bold,
    fontSize: 13,
  },
  divider: {
    width: 44,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 16,
  },
  bottoneWiki: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bottoneWikiTesto: {
    fontFamily: font.bold,
    fontSize: 15,
  },
  fonte: {
    fontFamily: font.regular,
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },
  collegatiSezione: {
    marginTop: 32,
  },
  collegatiTitolo: {
    marginBottom: 12,
  },
  collegatiLista: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipTesto: {
    fontFamily: font.semibold,
    fontSize: 14,
  },
  modalSfondo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  immagineIntera: {
    width: '100%',
    height: '80%',
  },
  chiudi: {
    position: 'absolute',
    top: 48,
    right: 20,
  },
});

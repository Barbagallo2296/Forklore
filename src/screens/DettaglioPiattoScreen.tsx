import React, { useEffect, useState } from 'react';
import {View,Text,Image,ScrollView, TouchableOpacity,Modal,Pressable,Linking,StyleSheet,} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Heart, ExternalLink, X } from 'lucide-react-native';
import { wikipediaQuery, WIKIPEDIA_USER_AGENT } from '../data/wikipedia';
import { isPreferito, toggleFavorito } from '../data/preferiti';
import { segnaVisto } from '../data/visti';
import { TUTTI_I_PIATTI } from '../data/regioni';
import Skeleton from '../components/Skeleton';
import { useTheme } from '../theme/ThemeContext';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type RoutePropType = RouteProp<RegioniStackParamList, 'DettaglioPiatto'>;
type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'DettaglioPiatto'>;

const RIGHE_SKELETON = ['100%', '95%', '100%', '88%', '60%'] as const;

export default function DettaglioPiattoScreen() {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  const { piattoNome } = route.params;
  const { colors } = useTheme();

  const [preferito, setPreferito] = useState(() => isPreferito(piattoNome));
  const [immagineAperta, setImmagineAperta] = useState(false);

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
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.scrollContent}>
          <Skeleton width={280} height={200} borderRadius={20} style={styles.imageWrapper} />
          <Skeleton width={200} height={26} />
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
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          Non è stato possibile caricare le informazioni su questo piatto.
        </Text>
      </View>
    );
  }

  const immagineGrande = data.originalimage ?? data.thumbnail;

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageWrapper}>
          {data.thumbnail ? (
            <TouchableOpacity activeOpacity={0.85} onPress={() => setImmagineAperta(true)}>
              <Image
                source={{
                  uri: data.thumbnail.source,
                  headers: { 'User-Agent': WIKIPEDIA_USER_AGENT },
                }}
                style={styles.image}
              />
            </TouchableOpacity>
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.placeholder }]}>
              <Text style={styles.imagePlaceholderEmoji}>🍽️</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.cuoreButton, { backgroundColor: colors.card }]}
            onPress={handleToggle}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={colors.primary}
              fill={preferito ? colors.primary : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.titolo, { color: colors.textPrimary }]}>{data.title}</Text>
        <View style={[styles.divider, { backgroundColor: colors.primary }]} />
        <Text style={[styles.testo, { color: colors.textPrimary }]}>{data.extract}</Text>

        {data.url && (
          <TouchableOpacity
            style={[styles.bottoneWiki, { borderColor: colors.primary }]}
            onPress={() => Linking.openURL(data.url!)}
            activeOpacity={0.7}
          >
            <ExternalLink size={16} color={colors.primary} />
            <Text style={[styles.bottoneWikiTesto, { color: colors.primary }]}>
              Leggi tutto su Wikipedia
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.fonte, { color: colors.textTertiary }]}>Fonte: Wikipedia</Text>

        {piattoInfo && piattiCollegati.length > 0 && (
          <View style={styles.collegatiSezione}>
            <Text style={[styles.collegatiTitolo, { color: colors.textPrimary }]}>
              Altri piatti tipici · {piattoInfo.regioneNome}
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
      </ScrollView>

      {immagineGrande && (
        <Modal
          visible={immagineAperta}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setImmagineAperta(false)}
        >
          <Pressable style={styles.modalSfondo} onPress={() => setImmagineAperta(false)}>
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
    alignItems: 'center',
    padding: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  rigaSkeleton: {
    marginBottom: 10,
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
  },
  imageWrapper: {
    marginBottom: 20,
  },
  image: {
    width: 280,
    height: 200,
    borderRadius: 20,
  },
  imagePlaceholder: {
    width: 280,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderEmoji: {
    fontSize: 56,
  },
  cuoreButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  titolo: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  divider: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 18,
  },
  testo: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
  },
  bottoneWiki: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  bottoneWikiTesto: {
    fontSize: 14,
    fontWeight: '600',
  },
  fonte: {
    marginTop: 12,
    fontSize: 12,
    fontStyle: 'italic',
  },
  collegatiSezione: {
    alignSelf: 'stretch',
    marginTop: 32,
  },
  collegatiTitolo: {
    fontSize: 16,
    fontWeight: '700',
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
    fontSize: 14,
    fontWeight: '500',
  },
  modalSfondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
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

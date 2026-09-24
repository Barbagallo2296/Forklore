import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchWikipediaSummary, WIKIPEDIA_USER_AGENT } from '../data/wikipedia';
import { isPreferito, toggleFavorito } from '../data/preferiti';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type RoutePropType = RouteProp<RegioniStackParamList, 'DettaglioPiatto'>;

export default function DettaglioPiattoScreen() {
  const route = useRoute<RoutePropType>();
  const { piattoNome } = route.params;

  const [preferito, setPreferito] = useState(() => isPreferito(piattoNome));

  const { data, isLoading, isError } = useQuery({
    queryKey: ['wikipedia', piattoNome],
    queryFn: () => fetchWikipediaSummary(piattoNome),
  });

  const handleToggle = () => {
    toggleFavorito(piattoNome);
    setPreferito((prev) => !prev);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E07A5F" />
        <Text style={styles.loadingText}>Sto recuperando le informazioni...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>
          Non è stato possibile caricare le informazioni su questo piatto.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.imageWrapper}>
        {data.thumbnail ? (
          <Image
            source={{
              uri: data.thumbnail.source,
              headers: { 'User-Agent': WIKIPEDIA_USER_AGENT },
            }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderEmoji}>🍽️</Text>
          </View>
        )}

        <TouchableOpacity style={styles.cuoreButton} onPress={handleToggle} activeOpacity={0.7}>
          <Text style={styles.cuoreIcona}>{preferito ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.titolo}>{data.title}</Text>
      <View style={styles.divider} />
      <Text style={styles.testo}>{data.extract}</Text>
      <Text style={styles.fonte}>Fonte: Wikipedia</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#888',
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    color: '#888',
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
    backgroundColor: '#e8e0d8',
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
    backgroundColor: '#ffffff',
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
  cuoreIcona: {
    fontSize: 18,
  },
  titolo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  divider: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E07A5F',
    marginTop: 12,
    marginBottom: 18,
  },
  testo: {
    fontSize: 16,
    lineHeight: 25,
    color: '#333333',
    textAlign: 'center',
  },
  fonte: {
    marginTop: 24,
    fontSize: 12,
    color: '#aaa',
    fontStyle: 'italic',
  },
});
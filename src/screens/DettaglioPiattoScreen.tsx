import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchWikipediaSummary } from '../data/wikipedia';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type RoutePropType = RouteProp<RegioniStackParamList, 'DettaglioPiatto'>;

export default function DettaglioPiattoScreen() {
  const route = useRoute<RoutePropType>();
  const { piattoNome } = route.params;

  console.log('DettaglioPiattoScreen montata, piatto:', piattoNome);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wikipedia', piattoNome],
    queryFn: () => fetchWikipediaSummary(piattoNome),
  });

  console.log('Stato query:', { isLoading, isError, error, data });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E07A5F" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Non è stato possibile caricare le informazioni su questo piatto.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {data.thumbnail && (
        <Image source={{ uri: data.thumbnail.source }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.titolo}>{data.title}</Text>
        <Text style={styles.testo}>{data.extract}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 240,
  },
  content: {
    padding: 20,
  },
  titolo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  testo: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
});
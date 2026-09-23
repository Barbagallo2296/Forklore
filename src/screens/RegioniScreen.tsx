import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { REGIONI } from '../data/regioni';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'Regioni'>;


const COLORI = [
  '#E07A5F', '#3D5A80', '#81B29A', '#F2CC8F', '#BC6C25',
  '#606C38', '#9C6644', '#457B9D', '#D62828', '#6A4C93',
];

export default function RegioniScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <FlatList
        data={REGIONI}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const colore = COLORI[index % COLORI.length];
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.6}
              onPress={() => navigation.navigate('PiattiRegione', { regioneId: item.id })}
            >
              <View style={[styles.avatar, { backgroundColor: colore }]}>
                <Text style={styles.avatarLettera}>{item.nome.charAt(0)}</Text>
              </View>
              <View style={styles.cardTextWrap}>
                <Text style={styles.nomeRegione}>{item.nome}</Text>
                <Text style={styles.sottotitolo}>
                  {item.piatti.length} piatti tipici
                </Text>
              </View>
              <Text style={styles.freccia}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLettera: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardTextWrap: {
    flex: 1,
  },
  nomeRegione: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.2,
  },
  sottotitolo: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  freccia: {
    fontSize: 26,
    color: '#c0c0c0',
    fontWeight: '300',
    marginLeft: 4,
  },
});
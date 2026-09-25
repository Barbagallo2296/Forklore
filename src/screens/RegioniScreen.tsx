import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';
import { REGIONI } from '../data/regioni';
import PiattoDelGiorno from '../components/PiattoDelGiorno';
import { useTheme } from '../theme/ThemeContext';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'Regioni'>;

const COLORI_AVATAR = [
  '#E07A5F', '#3D5A80', '#81B29A', '#F2CC8F', '#BC6C25',
  '#606C38', '#9C6644', '#457B9D', '#D62828', '#6A4C93',
];

export default function RegioniScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={REGIONI}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<PiattoDelGiorno />}
        
        renderItem={({ item, index }) => {
          const colore = COLORI_AVATAR[index % COLORI_AVATAR.length];
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card }]}
              activeOpacity={0.6}
              onPress={() => navigation.navigate('PiattiRegione', { regioneId: item.id })}
            >
              <View style={[styles.avatar, { backgroundColor: colore }]}>
                <Text style={styles.avatarLettera}>{item.nome.charAt(0)}</Text>
              </View>
              <View style={styles.cardTextWrap}>
                <Text style={[styles.nomeRegione, { color: colors.textPrimary }]}>
                  {item.nome}
                </Text>
                <Text style={[styles.sottotitolo, { color: colors.textSecondary }]}>
                  {item.piatti.length} piatti tipici
                </Text>
              </View>
              <ChevronRight color={colors.chevron} size={22} />
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
  },
  listContent: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
    letterSpacing: 0.2,
  },
  sottotitolo: {
    fontSize: 13,
    marginTop: 2,
  },
});
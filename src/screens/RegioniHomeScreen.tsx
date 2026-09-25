import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { List, Map } from 'lucide-react-native';
import RegioniScreen from './RegioniScreen';
import MappaItaliaScreen from './MappaItaliaScreen';
import { useTheme } from '../theme/ThemeContext';

type Vista = 'lista' | 'mappa';

export default function RegioniHomeScreen() {
  const [vista, setVista] = useState<Vista>('lista');
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.selector, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.opzione, vista === 'lista' && { backgroundColor: colors.primary }]}
          onPress={() => setVista('lista')}
          activeOpacity={0.7}
        >
          <List size={16} color={vista === 'lista' ? '#ffffff' : colors.textSecondary} />
          <Text style={[styles.opzioneTesto, { color: vista === 'lista' ? '#ffffff' : colors.textSecondary }]}>
            Lista
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.opzione, vista === 'mappa' && { backgroundColor: colors.primary }]}
          onPress={() => setVista('mappa')}
          activeOpacity={0.7}
        >
          <Map size={16} color={vista === 'mappa' ? '#ffffff' : colors.textSecondary} />
          <Text style={[styles.opzioneTesto, { color: vista === 'mappa' ? '#ffffff' : colors.textSecondary }]}>
            Mappa
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {vista === 'lista' ? <RegioniScreen /> : <MappaItaliaScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selector: {
    flexDirection: 'row',
    margin: 12,
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
  },
  opzione: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  opzioneTesto: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});
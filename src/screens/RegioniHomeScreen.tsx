import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { List, Map } from 'lucide-react-native';
import RegioniScreen from './RegioniScreen';
import MappaItaliaScreen from './MappaItaliaScreen';
import ComparsaAnimata from '../components/ComparsaAnimata';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';

type Vista = 'lista' | 'mappa';

export default function RegioniHomeScreen() {
  const [vista, setVista] = useState<Vista>('lista');
  const { colors } = useTheme();
  const coloreLista = vista === 'lista' ? colors.onPrimary : colors.textSecondary;
  const coloreMappa = vista === 'mappa' ? colors.onPrimary : colors.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.selector, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.opzione, vista === 'lista' && { backgroundColor: colors.primary }]}
          onPress={() => setVista('lista')}
          activeOpacity={0.7}
        >
          <List size={16} color={coloreLista} />
          <Text style={[styles.opzioneTesto, { color: coloreLista }]}>
            Lista
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.opzione, vista === 'mappa' && { backgroundColor: colors.primary }]}
          onPress={() => setVista('mappa')}
          activeOpacity={0.7}
        >
          <Map size={16} color={coloreMappa} />
          <Text style={[styles.opzioneTesto, { color: coloreMappa }]}>
            Mappa
          </Text>
        </TouchableOpacity>
      </View>

      <ComparsaAnimata key={vista} style={styles.content}>
        {vista === 'lista' ? <RegioniScreen /> : <MappaItaliaScreen />}
      </ComparsaAnimata>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
  },
  opzione: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 11,
    gap: 6,
  },
  opzioneTesto: {
    fontSize: 14,
    fontFamily: font.semibold,
  },
  content: {
    flex: 1,
  },
});
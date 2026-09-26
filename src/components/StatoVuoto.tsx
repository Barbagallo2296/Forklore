import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';

type Props = {
  emoji: string;
  titolo: string;
  messaggio: string;
};

export default function StatoVuoto({ emoji, titolo, messaggio }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.cerchio, { backgroundColor: colors.primaryLight }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[testo.titolo, styles.titolo, { color: colors.textPrimary }]}>{titolo}</Text>
      <Text style={[styles.messaggio, { color: colors.textSecondary }]}>{messaggio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  cerchio: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emoji: {
    fontSize: 44,
  },
  titolo: {
    textAlign: 'center',
  },
  messaggio: {
    fontFamily: font.regular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 6,
  },
});

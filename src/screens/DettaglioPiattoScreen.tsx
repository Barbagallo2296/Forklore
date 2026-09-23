import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DettaglioPiattoScreen() {
  return (
    <View style={styles.container}>
      <Text>Schermata Dettaglio Piatto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
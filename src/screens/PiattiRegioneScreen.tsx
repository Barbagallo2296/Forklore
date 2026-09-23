import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PiattiRegioneScreen() {
  return (
    <View style={styles.container}>
      <Text>Schermata Piatti della Regione</Text>
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
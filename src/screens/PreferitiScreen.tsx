import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PreferitiScreen() {
  return (
    <View style={styles.container}>
      <Text>Schermata Preferiti</Text>
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
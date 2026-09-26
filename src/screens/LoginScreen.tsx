import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import { useUtente } from '../utente/UtenteContext';
import ComparsaAnimata from '../components/ComparsaAnimata';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { accedi } = useUtente();
  const [nome, setNome] = useState('');

  const valido = nome.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.contenuto}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ComparsaAnimata style={styles.intestazione}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoEmoji}>🍴</Text>
          </View>
          <Text style={[styles.titolo, { color: colors.textPrimary }]}>Forklore</Text>
          <Text style={[styles.sottotitolo, { color: colors.textSecondary }]}>
            Un viaggio tra i piatti tipici delle 20 regioni italiane
          </Text>
        </ComparsaAnimata>

        <ComparsaAnimata indice={4}>
          <Text style={[styles.etichetta, { color: colors.textPrimary }]}>Come ti chiami?</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Il tuo nome"
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.textPrimary },
            ]}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={30}
            returnKeyType="go"
            onSubmitEditing={() => accedi(nome)}
          />
          <TouchableOpacity
            style={[
              styles.bottone,
              { backgroundColor: colors.primary },
              !valido && styles.bottoneDisattivato,
            ]}
            onPress={() => accedi(nome)}
            disabled={!valido}
            activeOpacity={0.8}
          >
            <Text style={[styles.bottoneTesto, { color: colors.onPrimary }]}>Inizia a esplorare</Text>
          </TouchableOpacity>
          <Text style={[styles.nota, { color: colors.textTertiary }]}>
            Nessuna password: il nome resta salvato solo su questo telefono.
          </Text>
        </ComparsaAnimata>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contenuto: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  intestazione: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontFamily: font.regular,
    fontSize: 44,
  },
  titolo: {
    fontFamily: font.titolo,
    fontSize: 32,
    letterSpacing: 0.5,
  },
  sottotitolo: {
    fontFamily: font.regular,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
  },
  etichetta: {
    fontSize: 15,
    fontFamily: font.semibold,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: font.regular,
    fontSize: 16,
  },
  bottone: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  bottoneDisattivato: {
    opacity: 0.5,
  },
  bottoneTesto: {
    fontSize: 16,
    fontFamily: font.bold,
  },
  nota: {
    fontFamily: font.regular,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
});

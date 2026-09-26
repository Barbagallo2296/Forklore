import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LogOut, Moon, RotateCcw, Smartphone, Sun } from 'lucide-react-native';
import { REGIONI, NUMERO_PIATTI_UNICI } from '../data/regioni';
import {
  getVisti,
  azzeraVisti,
  filtraCurati,
  calcolaProgresso,
  contaConquistate,
} from '../data/visti';
import { getPreferiti, azzeraPreferiti } from '../data/preferiti';
import { calcolaTraguardi } from '../data/traguardi';
import ComparsaAnimata from '../components/ComparsaAnimata';
import Card from '../components/Card';
import { useTheme, type PreferenzaTema } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import { useUtente } from '../utente/UtenteContext';

const OPZIONI_TEMA: { valore: PreferenzaTema; etichetta: string; Icona: typeof Sun }[] = [
  { valore: 'light', etichetta: 'Chiaro', Icona: Sun },
  { valore: 'dark', etichetta: 'Scuro', Icona: Moon },
  { valore: 'system', etichetta: 'Sistema', Icona: Smartphone },
];

export default function ProfiloScreen() {
  const { colors, preferenza, setPreferenza } = useTheme();
  const { nome, esci } = useUtente();
  const [visti, setVisti] = useState<string[]>([]);
  const [preferiti, setPreferiti] = useState<string[]>([]);
  const larghezzaBarra = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setVisti(filtraCurati(getVisti()));
      setPreferiti(getPreferiti());
    }, []),
  );

  const progresso = calcolaProgresso(visti);
  const conquistate = contaConquistate(progresso);
  const percentuale = Math.min(visti.length / NUMERO_PIATTI_UNICI, 1);
  const traguardi = calcolaTraguardi({ visti, preferiti, progresso });
  const sbloccati = traguardi.filter((t) => t.sbloccato).length;

  useEffect(() => {
    Animated.timing(larghezzaBarra, {
      toValue: percentuale,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [larghezzaBarra, percentuale]);

  const confermaAzzera = () => {
    Alert.alert(
      'Azzerare i progressi?',
      'Piatti scoperti, regioni conquistate, traguardi e preferiti verranno cancellati. Nome e tema restano.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Azzera',
          style: 'destructive',
          onPress: () => {
            azzeraVisti();
            azzeraPreferiti();
            setVisti([]);
            setPreferiti([]);
          },
        },
      ],
    );
  };

  const statistiche = [
    { valore: `${visti.length}/${NUMERO_PIATTI_UNICI}`, etichetta: 'Piatti scoperti' },
    { valore: `${conquistate}/${REGIONI.length}`, etichetta: 'Regioni conquistate' },
    { valore: `${preferiti.length}`, etichetta: 'Preferiti' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contenuto}
    >
      <View style={styles.intestazione}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarLettera, { color: colors.onPrimary }]}>{nome?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={[styles.nome, { color: colors.textPrimary }]}>{nome}</Text>
        <Text style={[styles.sottotitolo, { color: colors.textSecondary }]}>
          Esploratore del gusto
        </Text>
      </View>

      <View style={styles.statistiche}>
        {statistiche.map((s) => (
          <Card key={s.etichetta} style={styles.statCard}>
            <Text style={[styles.statValore, { color: colors.primary }]}>{s.valore}</Text>
            <Text style={[styles.statEtichetta, { color: colors.textSecondary }]}>
              {s.etichetta}
            </Text>
          </Card>
        ))}
      </View>

      <Card style={styles.card}>
        <View style={styles.rigaTitolo}>
          <Text style={[styles.titoloSezione, { color: colors.textPrimary }]}>
            Giro d'Italia a tavola
          </Text>
          <Text style={[styles.percentuale, { color: colors.primary }]}>
            {Math.round(percentuale * 100)}%
          </Text>
        </View>
        <View style={[styles.barraSfondo, { backgroundColor: colors.placeholder }]}>
          <Animated.View
            style={[
              styles.barraPiena,
              {
                backgroundColor: colors.primary,
                width: larghezzaBarra.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </Card>

      <View style={styles.rigaTitolo}>
        <Text style={[styles.titoloSezione, { color: colors.textPrimary }]}>Traguardi</Text>
        <Text style={[styles.contatore, { color: colors.textSecondary }]}>
          {sbloccati}/{traguardi.length}
        </Text>
      </View>
      <View style={styles.griglia}>
        {traguardi.map((t, i) => (
          <ComparsaAnimata key={t.id} indice={i} style={styles.cellaTraguardo}>
            <View
              style={[
                styles.traguardo,
                {
                  backgroundColor: t.sbloccato ? colors.secondaryLight : colors.card,
                  borderColor: t.sbloccato ? colors.secondary : colors.border,
                },
                !t.sbloccato && styles.traguardoBloccato,
              ]}
            >
              <Text style={styles.traguardoEmoji}>{t.sbloccato ? t.emoji : '🔒'}</Text>
              <Text
                style={[styles.traguardoTitolo, { color: colors.textPrimary }]}
                numberOfLines={2}
              >
                {t.titolo}
              </Text>
              <Text
                style={[styles.traguardoDescrizione, { color: colors.textSecondary }]}
                numberOfLines={3}
              >
                {t.descrizione}
              </Text>
            </View>
          </ComparsaAnimata>
        ))}
      </View>

      <Text style={[styles.titoloSezione, styles.spazioSopra, { color: colors.textPrimary }]}>
        Aspetto
      </Text>
      <View style={[styles.selettore, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {OPZIONI_TEMA.map(({ valore, etichetta, Icona }) => {
          const attiva = preferenza === valore;
          const colore = attiva ? colors.onPrimary : colors.textSecondary;
          return (
            <TouchableOpacity
              key={valore}
              style={[styles.opzione, attiva && { backgroundColor: colors.primary }]}
              onPress={() => setPreferenza(valore)}
              activeOpacity={0.7}
            >
              <Icona size={16} color={colore} />
              <Text style={[styles.opzioneTesto, { color: colore }]}>{etichetta}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.esci, { borderColor: colors.primary }]}
        onPress={confermaAzzera}
        activeOpacity={0.7}
      >
        <RotateCcw size={18} color={colors.primary} />
        <Text style={[styles.esciTesto, { color: colors.primary }]}>Azzera progressi</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.esci, styles.esciSotto, { borderColor: colors.border }]}
        onPress={esci}
        activeOpacity={0.7}
      >
        <LogOut size={18} color={colors.textSecondary} />
        <Text style={[styles.esciTesto, { color: colors.textSecondary }]}>Esci</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contenuto: {
    padding: 16,
    paddingBottom: 32,
  },
  intestazione: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarLettera: {
    fontSize: 34,
    fontFamily: font.bold,
  },
  nome: {
    fontFamily: font.titolo,
    fontSize: 22,
  },
  sottotitolo: {
    fontFamily: font.regular,
    fontSize: 14,
    marginTop: 2,
  },
  statistiche: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statValore: {
    fontSize: 18,
    fontFamily: font.extrabold,
  },
  statEtichetta: {
    fontFamily: font.regular,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    marginBottom: 20,
  },
  rigaTitolo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titoloSezione: {
    fontFamily: font.titolo,
    fontSize: 17,
  },
  spazioSopra: {
    marginTop: 20,
    marginBottom: 10,
  },
  percentuale: {
    fontSize: 15,
    fontFamily: font.bold,
  },
  contatore: {
    fontFamily: font.regular,
    fontSize: 14,
  },
  barraSfondo: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barraPiena: {
    height: '100%',
    borderRadius: 5,
  },
  griglia: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  cellaTraguardo: {
    width: '50%',
    padding: 5,
  },
  traguardo: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    minHeight: 118,
  },
  traguardoBloccato: {
    opacity: 0.55,
  },
  traguardoEmoji: {
    fontFamily: font.regular,
    fontSize: 26,
    marginBottom: 6,
  },
  traguardoTitolo: {
    fontSize: 14,
    fontFamily: font.bold,
  },
  traguardoDescrizione: {
    fontFamily: font.regular,
    fontSize: 12,
    marginTop: 2,
  },
  selettore: {
    flexDirection: 'row',
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
    fontFamily: font.semibold,
  },
  esci: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  esciSotto: {
    marginTop: 12,
  },
  esciTesto: {
    fontSize: 15,
    fontFamily: font.semibold,
  },
});

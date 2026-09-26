import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, Search, X } from 'lucide-react-native';
import { REGIONI, cercaPiatti } from '../data/regioni';
import { getVisti, calcolaProgresso, contaConquistate } from '../data/visti';
import PiattoDelGiorno from '../components/PiattoDelGiorno';
import ComparsaAnimata from '../components/ComparsaAnimata';
import Card from '../components/Card';
import RigaPiatto from '../components/RigaPiatto';
import SagomaRegione from '../components/SagomaRegione';
import StatoVuoto from '../components/StatoVuoto';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';
import { useUtente } from '../utente/UtenteContext';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'Regioni'>;

export default function RegioniScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { nome } = useUtente();
  const [ricerca, setRicerca] = useState('');
  const [visti, setVisti] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      setVisti(getVisti());
    }, []),
  );

  const progresso = calcolaProgresso(visti);
  const conquistate = contaConquistate(progresso);
  const staCercando = ricerca.trim().length > 0;
  const risultati = staCercando ? cercaPiatti(ricerca) : [];

  const barraRicerca = (
    <View style={[styles.ricerca, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Search size={18} color={colors.textTertiary} />
      <TextInput
        value={ricerca}
        onChangeText={setRicerca}
        placeholder="Cerca un piatto o una regione"
        placeholderTextColor={colors.textTertiary}
        style={[styles.ricercaInput, { color: colors.textPrimary }]}
        returnKeyType="search"
        autoCorrect={false}
      />
      {staCercando && (
        <TouchableOpacity onPress={() => setRicerca('')} hitSlop={10}>
          <X size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (staCercando) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {barraRicerca}
        <FlatList
          data={risultati}
          keyExtractor={(item) => `${item.regioneId}-${item.nome}`}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            risultati.length > 0 ? (
              <Text style={[styles.contaRisultati, { color: colors.textSecondary }]}>
                {risultati.length === 1 ? '1 piatto trovato' : `${risultati.length} piatti trovati`}
              </Text>
            ) : undefined
          }
          ListEmptyComponent={
            <StatoVuoto
              emoji="🔍"
              titolo="Nessun piatto trovato"
              messaggio={`Prova con un altro nome o con una regione al posto di “${ricerca.trim()}”.`}
            />
          }
          renderItem={({ item, index }) => (
            <ComparsaAnimata indice={index}>
              <RigaPiatto
                nome={item.nome}
                regione={item.regioneNome}
                visto={visti.includes(item.nome)}
                onPress={() => navigation.navigate('DettaglioPiatto', { piattoNome: item.nome })}
              />
            </ComparsaAnimata>
          )}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {barraRicerca}
      <FlatList
        data={REGIONI}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <View style={styles.saluto}>
              <Text style={[testo.titoloGrande, { color: colors.textPrimary }]}>
                Ciao, {nome} 👋
              </Text>
              <Text style={[styles.salutoSottotitolo, { color: colors.textSecondary }]}>
                {conquistate > 0
                  ? `Hai conquistato ${conquistate} ${conquistate === 1 ? 'regione' : 'regioni'} su ${REGIONI.length}. Cosa assaggiamo oggi?`
                  : 'Cosa assaggiamo oggi?'}
              </Text>
            </View>
            <PiattoDelGiorno />
            <Text style={[testo.titoloSezione, styles.titoloSezione, { color: colors.textPrimary }]}>
              Le regioni
            </Text>
          </>
        }
        renderItem={({ item, index }) => {
          const percentuale = progresso[item.id] ?? 0;
          const scoperti = Math.round(percentuale * item.piatti.length);
          const conquistata = percentuale === 1;
          return (
            <ComparsaAnimata indice={index}>
              <Card
                style={styles.card}
                onPress={() => navigation.navigate('PiattiRegione', { regioneId: item.id })}
              >
                <View style={[styles.sagoma, { backgroundColor: colors.background }]}>
                  <SagomaRegione regioneId={item.id} progresso={percentuale} />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={[styles.nomeRegione, { color: colors.textPrimary }]}>
                    {item.nome}
                  </Text>
                  <View style={styles.progressoRiga}>
                    <View style={[styles.barra, { backgroundColor: colors.placeholder }]}>
                      <View
                        style={[
                          styles.barraPiena,
                          {
                            width: `${percentuale * 100}%`,
                            backgroundColor: conquistata ? colors.secondary : colors.primary,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.progressoTesto,
                        { color: conquistata ? colors.secondary : colors.textSecondary },
                      ]}
                    >
                      {conquistata ? 'Conquistata' : `${scoperti}/${item.piatti.length}`}
                    </Text>
                  </View>
                </View>
                <ChevronRight color={colors.chevron} size={20} />
              </Card>
            </ComparsaAnimata>
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
  ricerca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  ricercaInput: {
    flex: 1,
    fontFamily: font.regular,
    fontSize: 15,
    paddingVertical: 11,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  saluto: {
    marginBottom: 16,
  },
  salutoSottotitolo: {
    fontFamily: font.regular,
    fontSize: 15,
    marginTop: 2,
  },
  titoloSezione: {
    marginBottom: 12,
  },
  contaRisultati: {
    fontFamily: font.semibold,
    fontSize: 13,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
  },
  sagoma: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextWrap: {
    flex: 1,
    marginRight: 8,
  },
  nomeRegione: {
    fontFamily: font.titolo,
    fontSize: 18,
  },
  progressoRiga: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  barra: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barraPiena: {
    height: '100%',
    borderRadius: 3,
  },
  progressoTesto: {
    fontFamily: font.bold,
    fontSize: 12,
    minWidth: 34,
    textAlign: 'right',
  },
});

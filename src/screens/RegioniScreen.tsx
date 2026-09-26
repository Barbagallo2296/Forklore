import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, X } from 'lucide-react-native';
import { REGIONI, cercaPiatti } from '../data/regioni';
import { getVisti, filtraCurati, calcolaProgresso, contaConquistate } from '../data/visti';
import PiattoDelGiorno from '../components/PiattoDelGiorno';
import AnteprimaMappa from '../components/AnteprimaMappa';
import CardRegione from '../components/CardRegione';
import ComparsaAnimata from '../components/ComparsaAnimata';
import RigaPiatto from '../components/RigaPiatto';
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

  // Regioni iniziate ma non ancora conquistate, dalla più avanti
  const inCorso = REGIONI.filter((r) => progresso[r.id] > 0 && progresso[r.id] < 1).sort(
    (a, b) => progresso[b.id] - progresso[a.id],
  );

  const apriRegione = (regioneId: string) => navigation.navigate('PiattiRegione', { regioneId });

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

  const intestazione = (
    <>
      <View style={styles.saluto}>
        <Text style={[testo.titoloGrande, { color: colors.textPrimary }]}>Ciao, {nome} 👋</Text>
        <Text style={[styles.salutoSottotitolo, { color: colors.textSecondary }]}>
          {conquistate > 0
            ? `Hai conquistato ${conquistate} ${conquistate === 1 ? 'regione' : 'regioni'} su ${REGIONI.length}. Cosa assaggiamo oggi?`
            : 'Cosa assaggiamo oggi?'}
        </Text>
      </View>

      <PiattoDelGiorno />

      <AnteprimaMappa
        progresso={progresso}
        piattiScoperti={filtraCurati(visti).length}
        onPress={() => navigation.navigate('Mappa')}
      />

      {inCorso.length > 0 && (
        <>
          <Text style={[testo.titoloSezione, styles.titoloSezione, { color: colors.textPrimary }]}>
            Continua a esplorare
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carosello}
            contentContainerStyle={styles.caroselloContenuto}
          >
            {inCorso.map((regione) => (
              <CardRegione
                key={regione.id}
                regione={regione}
                progresso={progresso[regione.id]}
                onPress={() => apriRegione(regione.id)}
                compatta
              />
            ))}
          </ScrollView>
        </>
      )}

      <Text style={[testo.titoloSezione, styles.titoloSezione, { color: colors.textPrimary }]}>
        Tutte le regioni
      </Text>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {barraRicerca}
      {staCercando ? (
        <FlatList
          key="risultati"
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
      ) : (
        <FlatList
          key="griglia"
          data={REGIONI}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.rigaGriglia}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={intestazione}
          renderItem={({ item, index }) => (
            <ComparsaAnimata indice={index} style={styles.cellaGriglia}>
              <CardRegione
                regione={item}
                progresso={progresso[item.id] ?? 0}
                onPress={() => apriRegione(item.id)}
              />
            </ComparsaAnimata>
          )}
        />
      )}
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
    marginTop: 4,
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
  // Il carosello esce dai margini della lista per scorrere fino al bordo dello schermo
  carosello: {
    marginHorizontal: -16,
    marginBottom: 24,
  },
  caroselloContenuto: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 10,
  },
  rigaGriglia: {
    gap: 10,
  },
  cellaGriglia: {
    flex: 1,
    marginBottom: 10,
  },
  contaRisultati: {
    fontFamily: font.semibold,
    fontSize: 13,
    marginBottom: 10,
  },
});

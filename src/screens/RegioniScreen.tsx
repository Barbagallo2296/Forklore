import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { REGIONI, cercaPiatti, getPiattoDelGiorno, type Regione } from '../data/regioni';
import { getVisti, filtraCurati, calcolaProgresso } from '../data/visti';
import PiattoDelGiorno from '../components/PiattoDelGiorno';
import AnteprimaMappa from '../components/AnteprimaMappa';
import CardRegione from '../components/CardRegione';
import ComparsaAnimata from '../components/ComparsaAnimata';
import RigaPiatto from '../components/RigaPiatto';
import StatoVuoto from '../components/StatoVuoto';
import BottoneTema from '../components/BottoneTema';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';
import { useUtente } from '../utente/UtenteContext';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'Regioni'>;

const NUMERO_SUGGERITE = 4;

// Regioni da cui iniziare: quella del piatto del giorno, poi le successive non ancora iniziate
function regioniSuggerite(progresso: Record<string, number>): Regione[] {
  const partenza = REGIONI.findIndex((r) => r.id === getPiattoDelGiorno().regioneId);
  const inOrdine = [...REGIONI.slice(partenza), ...REGIONI.slice(0, partenza)];
  return inOrdine.filter((r) => !progresso[r.id]).slice(0, NUMERO_SUGGERITE);
}

function dataDiOggi(): string {
  const data = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  // Solo l'iniziale maiuscola: "Sabato 26 settembre"
  return data.charAt(0).toUpperCase() + data.slice(1).toLowerCase();
}

export default function RegioniScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { nome } = useUtente();
  const [ricerca, setRicerca] = useState('');
  const [visti, setVisti] = useState<string[]>([]);

  // Le card montate dopo la prima apertura (scorrendo) compaiono subito, senza animazione
  const primaApertura = useRef(true);
  useEffect(() => {
    primaApertura.current = false;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const nuovi = getVisti();
      // Se non è cambiato niente teniamo lo stesso array: nessun ricalcolo né ridisegno
      setVisti((attuali) => (attuali.join('|') === nuovi.join('|') ? attuali : nuovi));
    }, []),
  );

  const progresso = useMemo(() => calcolaProgresso(visti), [visti]);
  const piattiScoperti = useMemo(() => filtraCurati(visti).length, [visti]);
  const staCercando = ricerca.trim().length > 0;
  const risultati = staCercando ? cercaPiatti(ricerca) : [];

  // Regioni iniziate ma non ancora conquistate, dalla più avanti
  const inCorso = useMemo(
    () =>
      REGIONI.filter((r) => progresso[r.id] > 0 && progresso[r.id] < 1).sort(
        (a, b) => progresso[b.id] - progresso[a.id],
      ),
    [progresso],
  );
  // Le regioni in corso per prime, poi i suggerimenti fino ad avere almeno 4 card
  const carosello = [...inCorso, ...regioniSuggerite(progresso)].slice(
    0,
    Math.max(inCorso.length, NUMERO_SUGGERITE),
  );

  const apriRegione = useCallback(
    (regioneId: string) => navigation.navigate('PiattiRegione', { regioneId }),
    [navigation],
  );
  const apriMappa = useCallback(() => navigation.navigate('Mappa'), [navigation]);

  const barraSuperiore = (
    <View style={[styles.barraSuperiore, { paddingTop: insets.top + 8 }]}>
      <View style={styles.saluto}>
        <Text style={[styles.data, { color: colors.primary }]}>{dataDiOggi()}</Text>
        <Text style={[testo.titoloGrande, { color: colors.textPrimary }]} numberOfLines={1}>
          Ciao, {nome} 👋
        </Text>
      </View>
      <BottoneTema style={[styles.bottoneTema, { backgroundColor: colors.card }]} />
    </View>
  );

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
      <PiattoDelGiorno />

      <AnteprimaMappa progresso={progresso} piattiScoperti={piattiScoperti} onPress={apriMappa} />

      <Text style={[testo.titoloSezione, styles.titoloSezione, { color: colors.textPrimary }]}>
        {inCorso.length > 0 ? 'Continua a esplorare' : 'Da dove iniziare'}
      </Text>
      <ScrollView
        // Se cambiano le regioni (es. dopo un reset) il carosello riparte dall'inizio
        key={carosello.map((r) => r.id).join()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carosello}
        contentContainerStyle={styles.caroselloContenuto}
      >
        {carosello.map((regione) => (
          <CardRegione
            key={regione.id}
            regione={regione}
            progresso={progresso[regione.id] ?? 0}
            onPress={apriRegione}
            compatta
          />
        ))}
      </ScrollView>

      <Text style={[testo.titoloSezione, styles.titoloSezione, { color: colors.textPrimary }]}>
        Tutte le regioni
      </Text>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {barraSuperiore}
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
            <ComparsaAnimata
              indice={index}
              animata={primaApertura.current}
              style={styles.cellaGriglia}
            >
              <CardRegione
                regione={item}
                progresso={progresso[item.id] ?? 0}
                onPress={apriRegione}
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
  barraSuperiore: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  saluto: {
    flex: 1,
  },
  data: {
    fontFamily: font.bold,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  bottoneTema: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
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

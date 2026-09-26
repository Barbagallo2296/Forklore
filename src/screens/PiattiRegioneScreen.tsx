import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react-native';
import { REGIONI, TUTTI_I_PIATTI, getProvince } from '../data/regioni';
import { wikipediaQuery, categoriaQuery, filtraPiatti } from '../data/wikipedia';
import { getVisti } from '../data/visti';
import InfoRegione from '../components/InfoRegione';
import RigaPiatto from '../components/RigaPiatto';
import CardProvincia from '../components/CardProvincia';
import ComparsaAnimata from '../components/ComparsaAnimata';
import Skeleton from '../components/Skeleton';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'PiattiRegione'>;
type RoutePropType = RouteProp<RegioniStackParamList, 'PiattiRegione'>;

// Una riga della SectionList: un piatto, oppure la fila orizzontale delle province
type Elemento = { tipo: 'piatto'; nome: string; extra: boolean } | { tipo: 'province' };
type Sezione = { chiave: 'tipici' | 'province' | 'altri'; data: Elemento[] };

const BLOCCO_ALTRI = 20;

export default function PiattiRegioneScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { regioneId } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [visti, setVisti] = useState<string[]>([]);
  const [altriMostrati, setAltriMostrati] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setVisti(getVisti());
    }, []),
  );

  const regione = REGIONI.find((r) => r.id === regioneId);
  const province = getProvince(regioneId);

  useEffect(() => {
    regione?.piatti.forEach((piatto) => {
      queryClient.prefetchQuery(wikipediaQuery(piatto.nome));
    });
  }, [regione, queryClient]);

  const categoria = useQuery({ ...categoriaQuery(regione?.categoria ?? ''), enabled: !!regione });

  if (!regione) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>Regione non trovata</Text>
      </View>
    );
  }

  // Non ripetere negli "altri piatti" quelli già presenti tra i tipici o nelle province
  const esclusi = new Set([
    ...TUTTI_I_PIATTI.map((p) => p.nome),
    ...province.flatMap((p) => p.piatti.map((piatto) => piatto.nome)),
  ]);
  const altriPiatti = categoria.data ? filtraPiatti(categoria.data, esclusi) : [];

  const sezioni: Sezione[] = [
    {
      chiave: 'tipici',
      data: regione.piatti.map((p) => ({ tipo: 'piatto', nome: p.nome, extra: false })),
    },
  ];
  if (province.length > 0) {
    sezioni.push({ chiave: 'province', data: [{ tipo: 'province' }] });
  }
  sezioni.push({
    chiave: 'altri',
    data: altriPiatti
      .slice(0, altriMostrati)
      .map((nome) => ({ tipo: 'piatto', nome, extra: true })),
  });

  const apriPiatto = (nome: string, extra: boolean) =>
    navigation.navigate('DettaglioPiatto', extra ? { piattoNome: nome, regioneId } : { piattoNome: nome });

  const renderElemento = ({ item, index }: { item: Elemento; index: number }) => {
    if (item.tipo === 'province') {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.province}
          contentContainerStyle={styles.provinceContenuto}
        >
          {province.map((p) => (
            <CardProvincia
              key={p.id}
              provincia={p}
              scoperti={p.piatti.filter((piatto) => visti.includes(piatto.nome)).length}
              onPress={() => navigation.navigate('Provincia', { regioneId, provinciaId: p.id })}
            />
          ))}
        </ScrollView>
      );
    }
    return (
      <ComparsaAnimata indice={index % BLOCCO_ALTRI}>
        <RigaPiatto
          nome={item.nome}
          visto={visti.includes(item.nome)}
          onPress={() => apriPiatto(item.nome, item.extra)}
        />
      </ComparsaAnimata>
    );
  };

  const renderIntestazione = ({ section }: { section: Sezione }) => {
    if (section.chiave === 'province') {
      return (
        <View style={styles.intestazioneSezione}>
          <Text style={[testo.titoloSezione, { color: colors.textPrimary }]}>Per provincia</Text>
          <Text style={[styles.sottotitolo, { color: colors.textSecondary }]}>
            Le specialità locali, provincia per provincia
          </Text>
        </View>
      );
    }
    if (section.chiave === 'altri') {
      return (
        <View style={styles.intestazioneSezione}>
          <Text style={[testo.titoloSezione, { color: colors.textPrimary }]}>
            Altri piatti della regione
          </Text>
          <Text style={[styles.sottotitolo, { color: colors.textSecondary }]}>
            Dalla categoria “{regione.categoria}” di Wikipedia
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderFondo = ({ section }: { section: Sezione }) => {
    if (section.chiave !== 'altri') {
      return null;
    }
    if (categoria.isLoading) {
      return (
        <View>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} width="100%" height={76} borderRadius={16} style={styles.rigaSkeleton} />
          ))}
        </View>
      );
    }
    if (categoria.isError) {
      return (
        <Text style={[styles.messaggio, { color: colors.textSecondary }]}>
          Non è stato possibile caricare altri piatti da Wikipedia.
        </Text>
      );
    }
    const rimanenti = altriPiatti.length - altriMostrati;
    if (rimanenti <= 0) {
      return altriPiatti.length === 0 ? (
        <Text style={[styles.messaggio, { color: colors.textSecondary }]}>
          Nessun altro piatto trovato per questa regione.
        </Text>
      ) : null;
    }
    const etichetta =
      altriMostrati === 0
        ? `Mostra ${altriPiatti.length} ${altriPiatti.length === 1 ? 'piatto' : 'piatti'} da Wikipedia`
        : `Mostra altri ${Math.min(BLOCCO_ALTRI, rimanenti)}`;
    return (
      <TouchableOpacity
        style={[styles.bottoneAltri, { borderColor: colors.primary }]}
        onPress={() => setAltriMostrati((n) => n + BLOCCO_ALTRI)}
        activeOpacity={0.7}
      >
        <BookOpen size={17} color={colors.primary} />
        <Text style={[styles.bottoneAltriTesto, { color: colors.primary }]}>{etichetta}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sezioni}
        keyExtractor={(item, index) => (item.tipo === 'piatto' ? item.nome : `province-${index}`)}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <InfoRegione
            regioneId={regione.id}
            nome={regione.nome}
            scoperti={regione.piatti.filter((p) => visti.includes(p.nome)).length}
            totale={regione.piatti.length}
          />
        }
        renderItem={renderElemento}
        renderSectionHeader={renderIntestazione}
        renderSectionFooter={renderFondo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  intestazioneSezione: {
    marginTop: 18,
    marginBottom: 12,
  },
  sottotitolo: {
    fontFamily: font.regular,
    fontSize: 13,
    marginTop: 2,
  },
  // Il carosello delle province arriva fino ai bordi dello schermo
  province: {
    marginHorizontal: -16,
  },
  provinceContenuto: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 10,
  },
  rigaSkeleton: {
    marginBottom: 10,
  },
  messaggio: {
    fontFamily: font.regular,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 12,
  },
  bottoneAltri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    marginTop: 4,
  },
  bottoneAltriTesto: {
    fontFamily: font.bold,
    fontSize: 15,
  },
});

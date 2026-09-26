# Forklore 🍴

**Forklore** è un'app mobile in React Native per scoprire la cucina tipica italiana, regione per regione. Per ogni piatto mostra descrizione e foto prese in tempo reale da Wikipedia in italiano. Si può navigare da una lista o da una mappa interattiva dell'Italia che si colora man mano che si esplora: ogni regione "conquistata" è una regione di cui hai scoperto tutti i piatti tipici.

L'app include ricerca, preferiti, profilo con statistiche e traguardi, tema chiaro/scuro e un prototipo di approfondimento per provincia (Toscana).

## Screenshot

| Home | Mappa | Regione |
|:---:|:---:|:---:|
| ![Home](docs/screenshots/home.png) | ![Mappa](docs/screenshots/mappa.png) | ![Regione](docs/screenshots/regione.png) |

| Provincia | Dettaglio piatto | Profilo |
|:---:|:---:|:---:|
| ![Provincia](docs/screenshots/provincia.png) | ![Dettaglio](docs/screenshots/dettaglio.png) | ![Profilo](docs/screenshots/profilo.png) |

## Funzionalità

- **Login simulato**: al primo avvio basta inserire un nome, nessuna password. Il nome resta salvato sul telefono.
- **Home a sezioni**:
  - saluto con la data del giorno;
  - ricerca;
  - **piatto del giorno** (cambia ogni giorno);
  - card **"La tua Italia"** con l'anteprima della mappa e i progressi;
  - carosello "Continua a esplorare" (o "Da dove iniziare" per chi è all'inizio);
  - griglia delle 20 regioni con la sagoma di ciascuna e la barra di progresso.
- **Mappa interattiva** dell'Italia in SVG: tocca una regione per aprirla, pizzica per ingrandire. Le regioni si colorano in base ai piatti scoperti.
- **Regioni**: 10 piatti tipici scelti a mano per ciascuna, con introduzione da Wikipedia. Più la sezione **"Altri piatti della regione"**, caricata dal vivo dalla categoria Wikipedia della regione (es. *Cucina toscana*) e filtrata da vini, oli e voci non pertinenti.
- **Province (prototipo, solo Toscana)**: le 10 province toscane con le loro specialità locali (es. Massa-Carrara: panigacci, testaroli, torta d'erbi…).
- **Dettaglio del piatto**:
  - foto a tutta larghezza, ingrandibile;
  - descrizione e link a Wikipedia;
  - altri piatti della stessa regione;
  - **preferiti**;
  - **condivisione** tramite il menu di condivisione del telefono.
- **Ricerca** per nome del piatto o della regione, senza badare a maiuscole e accenti ("baba" trova "Babà").
- **Profilo**:
  - piatti scoperti e regioni conquistate;
  - barra di avanzamento;
  - 10 **traguardi** da sbloccare;
  - scelta del tema **chiaro / scuro / di sistema**;
  - pulsante **"Azzera progressi"** (con conferma);
  - uscita.
- Preferiti, progressi, nome e tema sono salvati in locale e restano anche chiudendo l'app o senza connessione.

## Requisiti del corso: dove trovarli

| Requisito | Dove |
|---|---|
| `useState`, `useEffect` | In tutte le schermate, ad esempio [`DettaglioPiattoScreen.tsx`](src/screens/DettaglioPiattoScreen.tsx) (preferito, segna il piatto come visto) e [`PiattiRegioneScreen.tsx`](src/screens/PiattiRegioneScreen.tsx) (precaricamento dei dati) |
| React Navigation (più screen) | [`AppNavigator.tsx`](src/navigation/AppNavigator.tsx): stack radice (Login / App), bottom tab (Regioni, Preferiti, Profilo) e uno stack per ogni tab |
| `useContext` | Due Context: [`ThemeContext.tsx`](src/theme/ThemeContext.tsx) (tema chiaro/scuro/sistema) e [`UtenteContext.tsx`](src/utente/UtenteContext.tsx) (login simulato) |
| Stile curato | Palette e font personalizzati ([`src/theme/`](src/theme/)), componenti riutilizzabili ([`src/components/`](src/components/)), icone [Lucide](https://lucide.dev/), animazioni |
| Backend di terze parti | API di Wikipedia in italiano ([`wikipedia.ts`](src/data/wikipedia.ts)): REST API per i riassunti delle pagine e MediaWiki API per le categorie |

## Stack tecnico

- **React Native** 0.87 + **TypeScript**
- **React Navigation** 7: native stack e bottom tabs
- **TanStack Query**: chiamate a Wikipedia con cache, caricamento ed errori
- **React Native MMKV**: salvataggio locale di preferiti, progressi, nome e tema
- **React Native SVG**: mappa d'Italia, sagome delle regioni e sfumature
- **Lucide** (`lucide-react-native`): icone
- **Font personalizzati**: Playfair Display (titoli) e Nunito (testo), con licenza SIL Open Font License
- **Wikipedia** (it.wikipedia.org): fonte dei contenuti, nessuna chiave API richiesta
- **Confini regionali ISTAT** (via [geojson-italy](https://github.com/guglielmo/geojson-italy), licenza CC-BY): fonte dei tracciati della mappa, semplificati e convertiti in SVG

## Come avviare il progetto

L'app è stata sviluppata e provata su **Android**.

### Prerequisiti

- [Node.js](https://nodejs.org/) **22.11 o successivo** (richiesto dal campo `engines` di `package.json`)
- **JDK 17**
- **Android Studio** con Android SDK installato
- Uno smartphone Android con **debug USB attivo**, oppure un emulatore Android avviato da Android Studio
- *(Windows, consigliato)* [Chocolatey](https://chocolatey.org/install#individual), utile per installare più velocemente gli strumenti richiesti

Se è la prima volta che configuri l'ambiente, segui la guida ufficiale ["Set up your environment"](https://reactnative.dev/docs/set-up-your-environment) di React Native (piattaforma **Android**).

### Installazione

```bash
git clone https://github.com/Barbagallo2296/Forklore.git
cd Forklore
npm install
```

### Avvio

Servono **due terminali** aperti nella cartella del progetto.

**Terminale 1: avvia il bundler Metro**
```bash
npm start
```

**Terminale 2: compila e installa l'app** (con il telefono collegato via USB o l'emulatore già avviato)
```bash
npx react-native run-android
```

### Dati da inserire

**Nessuno.** Non servono chiavi API né account: l'app usa gli endpoint pubblici di Wikipedia. Al primo avvio chiede solo un nome (qualsiasi) per il login simulato. Per ripartire da zero con i progressi c'è **Profilo → Azzera progressi**; per cambiare nome, **Profilo → Esci**.

È necessaria una connessione a internet per caricare testi e immagini dei piatti. Preferiti e progressi funzionano anche offline.

### Test e controlli

```bash
npm test          # test con Jest (login, ricerca, progressi, filtro dei piatti da Wikipedia)
npm run lint      # ESLint
npx tsc --noEmit  # controllo dei tipi TypeScript
```

I moduli nativi (MMKV, safe area) e le icone vengono simulati in [`jest.setup.js`](jest.setup.js).

## Dati dei piatti

### Verifica dei piatti

Lo script [`verifica-piatti.js`](verifica-piatti.js) controlla che ogni piatto di regioni e province corrisponda a una pagina Wikipedia esistente e che non sia una **pagina di disambiguazione** (es. "Schiacciata" invece di "Schiacciata (gastronomia)"). Chiama l'API reale per tutti i piatti e segnala quelli da correggere.

Se il titolo esatto contiene una precisazione tra parentesi, come "Jota (gastronomia)", l'app mostra solo "Jota".

```bash
node verifica-piatti.js
```

### Modificare o aggiungere piatti di una regione

1. Apri [`src/data/regioni-data.json`](src/data/regioni-data.json) e modifica o aggiungi il nome del piatto nella regione desiderata. Il nome deve corrispondere **esattamente** al titolo della pagina Wikipedia in italiano, spazi e maiuscole compresi.
2. Lancia `node verifica-piatti.js`.
3. Se il piatto risulta `❌ FALLITO`, cerca il titolo esatto su [it.wikipedia.org](https://it.wikipedia.org) e correggilo. A volte cambia singolare/plurale o serve un termine più specifico.
4. Non serve modificare altro: app e script leggono lo stesso file.

Ogni regione ha anche un campo `categoria` (es. `"Cucina toscana"`): è la categoria di Wikipedia da cui vengono caricati gli "Altri piatti della regione".

### Aggiungere le province di una regione

Le province sono in [`src/data/province-data.json`](src/data/province-data.json), raggruppate per `id` della regione:

```json
{
  "toscana": [
    { "id": "massa-carrara", "nome": "Massa-Carrara", "sigla": "MS", "piatti": ["Panigacci", "Testaroli"] }
  ]
}
```

Basta aggiungere una chiave con l'`id` di un'altra regione (come in `regioni-data.json`): la sezione "Per provincia" compare in automatico. Anche questi piatti vengono controllati da `verifica-piatti.js`.

I piatti di provincia e gli "altri piatti" da Wikipedia **non contano** per regioni conquistate e traguardi, che si basano solo sui 10 piatti tipici di ogni regione.

## Font personalizzati

I file `.ttf` sono in [`assets/fonts/`](assets/fonts/) e sono collegati al progetto nativo con [react-native-asset](https://github.com/unimonkiez/react-native-asset) (configurazione in [`react-native.config.js`](react-native.config.js)). Sono già collegati nel repo, quindi non devi fare nulla. Se aggiungi o sostituisci un font:

```bash
npx react-native-asset
npx react-native run-android   # i font sono file nativi: serve una nuova build, non basta ricaricare Metro
```

## Risoluzione problemi

- **L'app carica una versione vecchia o dà errori su import che sembrano corretti**: riavvia Metro svuotando la cache con `npx react-native start --reset-cache`.
- **I titoli non sono in font serif**: l'app installata è stata compilata prima dell'aggiunta dei font. Rifai la build con `npx react-native run-android`.
- **Il telefono non viene rilevato**: controlla con `adb devices` che compaia come `device`. Se è `unauthorized`, accetta l'autorizzazione al debug USB sul telefono.

## Struttura del progetto

```
App.tsx                         provider (safe area, TanStack Query, tema, utente) e navigazione
src/
  screens/                      schermate
    LoginScreen.tsx               login simulato (solo nome)
    RegioniScreen.tsx             home: saluto, ricerca, piatto del giorno, mappa, carosello, griglia
    MappaItaliaScreen.tsx         mappa interattiva a tutto schermo (SVG, zoom)
    PiattiRegioneScreen.tsx       regione: piatti tipici, province, altri piatti da Wikipedia
    ProvinciaScreen.tsx           specialità di una provincia
    DettaglioPiattoScreen.tsx     dettaglio del piatto (dati Wikipedia)
    PreferitiScreen.tsx           piatti preferiti
    ProfiloScreen.tsx             statistiche, traguardi, tema, reset, uscita
  components/                   componenti riutilizzabili (Card, CardRegione, SagomaRegione, RigaPiatto…)
  navigation/AppNavigator.tsx   stack e tab di React Navigation
  data/
    regioni-data.json             regioni, categorie Wikipedia e 10 piatti tipici per regione
    province-data.json            province e specialità locali (per ora Toscana)
    regioni.ts                    tipi e funzioni sui dati (ricerca, piatto del giorno, province)
    wikipedia.ts                  chiamate a Wikipedia e filtro degli "altri piatti"
    visti.ts                      piatti scoperti e progresso per regione
    preferiti.ts                  preferiti salvati con MMKV
    traguardi.ts                  regole dei traguardi del profilo
    mappaItaliaPaths.ts           tracciati SVG delle 20 regioni
    mappaEtichette.ts             posizione dei nomi delle regioni sulla mappa
  theme/                        palette chiara/scura, font e ThemeContext
  utente/UtenteContext.tsx      Context del login simulato
assets/fonts/                   font Playfair Display e Nunito
verifica-piatti.js              verifica dei piatti su Wikipedia
__tests__/                      test Jest
```

## Sviluppi futuri

- **Province in tutte le regioni**, con una mappa delle province (i confini ISTAT sono disponibili nello stesso progetto geojson-italy)
- Filtro più preciso degli "altri piatti" (ad esempio con i dati strutturati di Wikidata)
- Test e rifinitura su **iOS**
- Traduzione automatica per i piatti che hanno una pagina Wikipedia solo in altre lingue
- Login reale con sincronizzazione dei progressi tra dispositivi
- Modalità offline completa, con testi e immagini già visitati salvati sul telefono

## Riferimenti utili

- [Documentazione React Native](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)
- [Lucide Icons per React Native](https://lucide.dev/guide/react-native/)
- [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/)
- [MediaWiki API: categorymembers](https://www.mediawiki.org/wiki/API:Categorymembers)
- [Wikimedia: policy sullo User-Agent](https://w.wiki/4wJS)
- [geojson-italy](https://github.com/guglielmo/geojson-italy): confini ISTAT di regioni e province
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) e [Nunito](https://fonts.google.com/specimen/Nunito) su Google Fonts (scaricati tramite [Fontsource](https://fontsource.org/))
- [react-native-asset](https://github.com/unimonkiez/react-native-asset)
- [Chocolatey](https://chocolatey.org/install#individual)

## Autore

Manuel Barbagallo ([GitHub](https://github.com/Barbagallo2296))

# Forklore 🍴

App mobile React Native che permette di esplorare i piatti tipici delle 20 regioni italiane, con introduzione/descrizione (ed eventuali cenni storici, quando presenti) e immagine, recuperate in tempo reale dall'API di Wikipedia in italiano. Include salvataggio dei piatti preferiti (persistente, anche offline) e tema chiaro/scuro.

## Funzionalità

- Sfoglia le 20 regioni d'Italia, ognuna con 10 piatti tipici
- Per ogni piatto: introduzione/descrizione e immagine, recuperate live da Wikipedia
- Salva i tuoi piatti preferiti con un tap (persistono anche chiudendo l'app)
- Tema chiaro/scuro, con preferenza salvata e ripristinata automaticamente all'avvio

## Stack tecnico

- **React Native** + TypeScript
- **React Navigation** — bottom tab bar (Regioni / Preferiti) + stack navigator per il dettaglio, su entrambe le tab
- **TanStack Query** — gestione delle chiamate all'API di Wikipedia (loading, errori, cache)
- **React Native MMKV** — persistenza locale di preferiti e tema selezionato
- **Lucide** (`lucide-react-native`) — set di icone vettoriali
- **React Context** (`ThemeContext`) — gestione del tema chiaro/scuro condiviso in tutta l'app
- **Wikipedia REST API** (it.wikipedia.org) — fonte dei contenuti (nessuna chiave richiesta)

## Come avviare il progetto

### Prerequisiti

- [Node.js](https://nodejs.org/) (LTS consigliata)
- **JDK 17**
- **Android Studio**, con Android SDK installato (per emulatore o build)
- Uno smartphone Android con **debug USB attivo**, oppure un emulatore Android configurato in Android Studio
- *(Windows, Consigliato)* [Chocolatey](https://chocolatey.org/install#individual) — package manager utile per installare più velocemente alcuni strumenti richiesti dall'ambiente React Native

Segui la guida ufficiale ["Set up your environment"](https://reactnative.dev/docs/set-up-your-environment) di React Native (piattaforma **Android**) se è la prima volta che configuri l'ambiente.

### Installazione

```bash
git clone https://github.com/Barbagallo2296/Forklore.git
cd Forklore
npm install
```

### Avvio

Servono **due terminali** aperti contemporaneamente, nella cartella del progetto.

**Terminale 1 — avvia il bundler Metro:**
```bash
npm start
```

**Terminale 2 — compila e installa l'app** (con un device Android collegato via USB, o un emulatore già avviato):
```bash
npx react-native run-android
```

Nessun dato o chiave API va configurato manualmente: l'app usa l'endpoint pubblico di Wikipedia, che non richiede autenticazione.

### Verifica dei dati (opzionale)

Il file `verifica-piatti.js`, nella root del progetto, controlla che ogni piatto elencato in `src/data/regioni.json` corrisponda davvero a una pagina Wikipedia esistente, chiamando l'API reale per tutti e 200 i piatti e segnalando quelli non trovati. È stato usato per validare e correggere l'elenco durante lo sviluppo. Per rilanciarlo (utile dopo eventuali modifiche ai piatti):

```bash
node verifica-piatti.js
```
### Come modificare o aggiungere piatti

1. Apri `src/data/regioni.json` e modifica/aggiungi il nome del piatto nella regione desiderata (deve corrispondere **esattamente** al titolo della pagina Wikipedia in italiano, spazi e maiuscole inclusi)
2. Lancia lo script di verifica per controllare che il nome esista davvero su Wikipedia:
```bash
   node verifica-piatti.js
```
3. Se lo script segnala il piatto come `❌ FALLITO`, cerca il titolo esatto della pagina su [it.wikipedia.org](https://it.wikipedia.org) e correggi il nome in `regioni.json` (a volte cambia singolare/plurale, o serve un termine più specifico — es. "Carbonara" → pagina reale "Pasta alla carbonara" funziona comunque perché Wikipedia gestisce i redirect, ma non sempre è così)
4. Ripeti la verifica finché non risulta `✅ OK`
5. Non serve modificare nient'altro: sia l'app (`regioni.ts`) sia lo script leggono lo stesso `regioni.json`, quindi la modifica è automaticamente visibile ovunque

## Struttura del progetto

```
src/
  screens/          schermate dell'app (una per file)
  navigation/        configurazione di React Navigation
  data/                
    regioni.json      fonte unica dei dati (regioni e piatti tipici)
    regioni.ts         legge regioni.json e lo espone all'app
    wikipedia.ts        logica di chiamata all'API di Wikipedia
    preferiti.ts         logica di lettura/scrittura dei preferiti su MMKV
  theme/             palette colori chiaro/scuro e Context per il tema
```

`regioni.json` è l'**unica fonte di verità** per l'elenco di regioni e piatti: sia l'app (`regioni.ts`) sia lo script `verifica-piatti.js` leggono da questo stesso file, così una modifica ai piatti va fatta in un solo punto.

## Sviluppi futuri

- Vista "mappa d'Italia" interattiva per selezionare le regioni (in alternativa alla lista), con `react-native-svg`
- Traduzione automatica per i piatti la cui pagina Wikipedia esiste solo in altre lingue
- Ricerca/filtro testuale tra i piatti
- Condivisione di un piatto (link o immagine) su altre app
- Animazioni di transizione tra le schermate (`react-native-reanimated`)

## Riferimenti utili

- [Documentazione React Native](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)
- [Lucide Icons per React Native](https://lucide.dev/guide/react-native/)
- [Wikipedia REST API (documentazione)](https://en.wikipedia.org/api/rest_v1/)
- [Wikimedia API — policy sullo User-Agent](https://w.wiki/4wJS)
- [Chocolatey](https://chocolatey.org/install#individual) — package manager per Windows

## Autore

Manuel Barbagallo — [GitHub](https://github.com/Barbagallo2296)
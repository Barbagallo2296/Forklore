const REGIONI = require('./src/data/regioni-data.json');
const PROVINCE = require('./src/data/province-data.json');

const USER_AGENT = 'Forklore/1.0 (progetto scolastico ITS Prodigi; https://github.com/Barbagallo2296/Forklore)';

async function verificaPiatto(nome) {
  const url = `https://it.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nome)}`;
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    });
    return { nome, ok: response.status === 200, status: response.status };
  } catch (err) {
    return { nome, ok: false, status: 'errore di rete' };
  }
}

async function main() {
  const fallimenti = [];
  let totale = 0;

  // Regioni e, dove ci sono, le loro province: stessa verifica per entrambe
  const gruppi = [
    ...REGIONI.map((r) => ({ nome: r.nome, piatti: r.piatti })),
    ...Object.values(PROVINCE)
      .flat()
      .map((p) => ({ nome: `Provincia di ${p.nome} (${p.sigla})`, piatti: p.piatti })),
  ];

  for (const gruppo of gruppi) {
    console.log(`\n=== ${gruppo.nome} ===`);
    for (const piatto of gruppo.piatti) {
      totale++;
      const risultato = await verificaPiatto(piatto);
      const esito = risultato.ok ? '✅ OK' : `❌ FALLITO (${risultato.status})`;
      console.log(`  ${esito} — ${piatto}`);
      if (!risultato.ok) {
        fallimenti.push({ regione: gruppo.nome, piatto });
      }
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  console.log(`\n\nRISULTATO FINALE: ${totale - fallimenti.length}/${totale} pagine trovate.`);
  if (fallimenti.length > 0) {
    console.log('\nDa correggere:');
    fallimenti.forEach((f) => console.log(`  - [${f.regione}] "${f.piatto}"`));
  } else {
    console.log('Tutti i piatti hanno una pagina Wikipedia valida! 🎉');
  }
}

main();
import type { TextStyle } from 'react-native';

// Nomi dei file in assets/fonts. Con i font personalizzati ogni peso è una
// famiglia a sé: si sceglie il file giusto invece di usare fontWeight.
export const font = {
  titolo: 'PlayfairDisplay-Bold',
  regular: 'Nunito-Regular',
  semibold: 'Nunito-SemiBold',
  bold: 'Nunito-Bold',
  extrabold: 'Nunito-ExtraBold',
};

export const testo = {
  titoloGrande: { fontFamily: font.titolo, fontSize: 28, lineHeight: 36 },
  titolo: { fontFamily: font.titolo, fontSize: 22, lineHeight: 29 },
  titoloSezione: { fontFamily: font.titolo, fontSize: 19, lineHeight: 25 },
  voce: { fontFamily: font.bold, fontSize: 16 },
  corpo: { fontFamily: font.regular, fontSize: 16, lineHeight: 26 },
  secondario: { fontFamily: font.regular, fontSize: 13 },
  etichetta: { fontFamily: font.extrabold, fontSize: 11, letterSpacing: 1 },
} satisfies Record<string, TextStyle>;

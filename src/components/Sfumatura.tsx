import React, { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type Props = {
  // Da che punto (0 = in alto, 1 = in basso) inizia a scurirsi
  inizio?: number;
  // Quanto è scura in fondo (0-1)
  intensita?: number;
};

// Sfumatura scura verso il basso, da mettere sopra una foto per rendere leggibile il testo
export default function Sfumatura({ inizio = 0.35, intensita = 0.75 }: Props) {
  // Ogni sfumatura ha il suo id: più card con la sfumatura possono stare sulla stessa schermata
  const id = `sfumatura-${useId().replace(/:/g, '')}`;
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset={inizio} stopColor="#000000" stopOpacity="0" />
          <Stop offset="1" stopColor="#000000" stopOpacity={intensita} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

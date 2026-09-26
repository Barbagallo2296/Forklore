import React, { memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { REGIONI_PATHS } from '../data/mappaItaliaPaths';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  regioneId: string;
  // Percentuale di piatti scoperti (da 0 a 1): più è alta, più la sagoma è piena
  progresso: number;
  size?: number;
};

type Sagoma = { d: string; viewBox: string; tratto: number };

// I path contengono solo coordinate assolute (M/L), quindi il riquadro che
// contiene la regione si ricava prendendo i valori minimi e massimi.
function calcolaSagoma(d: string): Sagoma {
  const numeri = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const xs = numeri.filter((_, i) => i % 2 === 0);
  const ys = numeri.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const larghezza = Math.max(...xs) - minX;
  const altezza = Math.max(...ys) - minY;
  // Riquadro quadrato con la regione centrata
  const lato = Math.max(larghezza, altezza);
  const margine = lato * 0.08;
  const x = minX - (lato - larghezza) / 2 - margine;
  const y = minY - (lato - altezza) / 2 - margine;
  return {
    d,
    viewBox: `${x} ${y} ${lato + margine * 2} ${lato + margine * 2}`,
    tratto: lato * 0.025,
  };
}

const SAGOME: Record<string, Sagoma> = Object.fromEntries(
  REGIONI_PATHS.map((r) => [r.id, calcolaSagoma(r.d)]),
);

function SagomaRegione({ regioneId, progresso, size = 44 }: Props) {
  const { colors } = useTheme();
  const sagoma = SAGOME[regioneId];
  if (!sagoma) {
    return null;
  }

  return (
    <Svg width={size} height={size} viewBox={sagoma.viewBox}>
      <Path
        d={sagoma.d}
        fill={colors.primary}
        fillOpacity={0.15 + progresso * 0.85}
        stroke={colors.primary}
        strokeWidth={sagoma.tratto}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default memo(SagomaRegione);

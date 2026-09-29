import React, { memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { REGIONI_PATHS } from '../data/mappaItaliaPaths';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  regioneId: string;
  progresso: number;
  size?: number;
};

type Sagoma = { d: string; viewBox: string; tratto: number };

function calcolaSagoma(d: string): Sagoma {
  const numeri = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const xs = numeri.filter((_, i) => i % 2 === 0);
  const ys = numeri.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const larghezza = Math.max(...xs) - minX;
  const altezza = Math.max(...ys) - minY;
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

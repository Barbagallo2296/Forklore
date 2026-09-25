import React, { useEffect, useRef } from 'react';
import { Animated, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Skeleton({ width, height, borderRadius = 8, style }: Props) {
  const { colors } = useTheme();
  const opacita = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animazione = Animated.loop(
      Animated.sequence([
        Animated.timing(opacita, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacita, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    animazione.start();
    return () => animazione.stop();
  }, [opacita]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.placeholder, opacity: opacita },
        style,
      ]}
    />
  );
}

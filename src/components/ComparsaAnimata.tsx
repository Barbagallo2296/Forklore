import React, { useEffect, useRef } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  indice?: number;
  animata?: boolean;
  style?: StyleProp<ViewStyle>;
};

const RITARDO_PER_ELEMENTO = 40;
const RITARDO_MASSIMO = 400;

export default function ComparsaAnimata({ children, indice = 0, animata = true, style }: Props) {
  const progresso = useRef(new Animated.Value(animata ? 0 : 1)).current;

  useEffect(() => {
    if (!animata) {
      return;
    }
    Animated.timing(progresso, {
      toValue: 1,
      duration: 280,
      delay: Math.min(indice * RITARDO_PER_ELEMENTO, RITARDO_MASSIMO),
      useNativeDriver: true,
    }).start();
  }, [progresso, indice, animata]);

  const translateY = progresso.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Animated.View style={[style, { opacity: progresso, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

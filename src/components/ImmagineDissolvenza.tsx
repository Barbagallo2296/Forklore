import React, { useRef } from 'react';
import { Animated, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { WIKIPEDIA_USER_AGENT } from '../data/wikipedia';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  uri: string;
  style?: StyleProp<ViewStyle>;
};

export default function ImmagineDissolvenza({ uri, style }: Props) {
  const { colors } = useTheme();
  const opacita = useRef(new Animated.Value(0)).current;

  return (
    <View style={[styles.contenitore, { backgroundColor: colors.placeholder }, style]}>
      <Animated.Image
        source={{ uri, headers: { 'User-Agent': WIKIPEDIA_USER_AGENT } }}
        style={[StyleSheet.absoluteFill, { opacity: opacita }]}
        onLoad={() =>
          Animated.timing(opacita, { toValue: 1, duration: 300, useNativeDriver: true }).start()
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: {
    overflow: 'hidden',
  },
});

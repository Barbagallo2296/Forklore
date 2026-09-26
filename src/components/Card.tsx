import React from 'react';
import { View, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  // Se presente la card diventa toccabile
  onPress?: () => void;
};

export const ombra = {
  shadowColor: '#3B2414',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
};

// Superficie base dell'app: sfondo card, angoli arrotondati e ombra leggera
export default function Card({ children, style, onPress }: Props) {
  const { colors } = useTheme();
  const stile = [styles.card, { backgroundColor: colors.card }, style];

  if (onPress) {
    return (
      <TouchableOpacity style={stile} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={stile}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    ...ombra,
  },
});

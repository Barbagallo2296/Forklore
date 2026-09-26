import React from 'react';
import { TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  style?: StyleProp<ViewStyle>;
};

// Passa dal tema chiaro a quello scuro e viceversa (usato negli header e in home)
export default function BottoneTema({ style }: Props) {
  const { mode, colors, toggleTheme } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} style={style} hitSlop={8}>
      {mode === 'light' ? (
        <Moon color={colors.textPrimary} size={22} />
      ) : (
        <Sun color={colors.textPrimary} size={22} />
      )}
    </TouchableOpacity>
  );
}

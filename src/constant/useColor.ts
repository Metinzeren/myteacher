import useColorScheme from './useColorScheme';

const Colors = {
  light: {
    iconColor: '#444',
  },
  dark: {
    iconColor: '#fff',
  },
};

const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  return colors;
};

export default useThemeColors;

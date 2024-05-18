import useColorScheme from './useColorScheme';

const Colors = {
  light: {
    background: '#f9f9f9',
    primary: '#E78577',
    text: '#FFF',
    secondary: '#a55eea',
    inputBorder: '#ebeff3',
    activeBorder: '#E78577',
    iconColor: '#E78577',
    success: '#488E48',
    descriptionColor: '#797979',
  },
  dark: {
    background: '#121212',
    primary: '#E78577',
    text: '#FFF',
    secondary: '#a55eea',
    inputBorder: '#ebeff3',
    activeBorder: '#E78577',
    iconColor: '#E78577',
    success: '#488E48',
    descriptionColor: '#797979',
  },
};

const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  return colors;
};

export default useThemeColors;

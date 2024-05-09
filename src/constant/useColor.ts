import useColorScheme from './useColorScheme';

const Colors = {
  light: {
    background: '#f9f9f9',
    primary: '#EBB24E',
    text: '#70664C',
    secondary: '#a55eea',
    inputBorder: '#ebeff3',
    activeBorder: '#EBB24E',
    iconColor: '#EBB24E',
    success: '#488E48',
    descriptionColor: '#797979',
  },
  dark: {
    background: '#121212',
    primary: '#EBB24E',
    text: '#70664C',
    secondary: '#a55eea',
    inputBorder: '#ebeff3',
    activeBorder: '#EBB24E',
    iconColor: '#EBB24E',
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

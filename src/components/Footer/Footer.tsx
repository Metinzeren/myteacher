import {View, TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import CustomText from '../Text/Text';
import useThemeColors from '../../constant/useColor';
import dayjs from 'dayjs';

export default function Footer() {
  const colors = useThemeColors();

  return (
    <FooterContainer>
      <FooterHelpContainer></FooterHelpContainer>
      <FooterText>© {dayjs().format('YYYY')} Tüm Hakları Saklıdır</FooterText>
    </FooterContainer>
  );
}
const FooterContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const FooterText = styled(CustomText)`
  color: #daa548;
`;
const FooterHelpContainer = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

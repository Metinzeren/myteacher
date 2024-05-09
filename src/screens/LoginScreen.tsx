import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import styled from 'styled-components/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEnvelope,
  faKey,
  faLock,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import useThemeColors from '../constant/useColor';
import {useTranslation} from 'react-i18next';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import Button from '../components/Button/Button';
import Container from '../components/Container/Container';
import Input from '../components/Input/Input';
import Footer from '../components/Footer/Footer';
import CustomText from '../components/Text/Text';
import {COLORS} from '../constant/theme';

export default function LoginScreen() {
  const {t} = useTranslation();
  return (
    <Container>
      <LoginTopContainer>
        <CustomText color="textBlack" center title>
          Welcome To
        </CustomText>
        <CustomText color="primaryText" center h1>
          Teacher Application
        </CustomText>
        <CustomText color={'textBlack'} description center>
          The First Teaching Services Provider with a Click of a Button
        </CustomText>
      </LoginTopContainer>
      <FormContainer>
        <Input placeholder="E-mail" icon={faEnvelope} />
        <Input placeholder="Şifre" icon={faLock} secureTextEntry={true} />
        <TouchableOpacity onPress={() => console.log('Şifremi Unuttum')}>
          <CustomText color="textBlack">Şifremi Unuttum</CustomText>
        </TouchableOpacity>
        <Button
          onPress={() => {
            AlertDialog.showModal({
              title: 'Başlık',
              message: 'Mesaj',
            });
          }}
          borderRadius={10}
          text={t('LOGIN')}
        />
      </FormContainer>
      <RegisterContainer>
        <CustomText color="grey">Henüz hesabın yok mu? </CustomText>
        <TouchableOpacity>
          <CustomText color={'textLink'}>Hesap oluştur</CustomText>
        </TouchableOpacity>
      </RegisterContainer>
    </Container>
  );
}

const FormContainer = styled(View)`
  margin: 20px;
  gap: 20px;
`;
const LoginTopContainer = styled(View)`
  flex-direction: column;
  text-align: center;
  margin-bottom: 45px;
  margin-top: 45px;
`;
const RegisterContainer = styled(View)`
  margin-top: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

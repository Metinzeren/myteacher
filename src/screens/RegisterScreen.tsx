import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Container from '../components/Container/Container'
import CustomText from '../components/Text/Text';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Input from '../components/Input/Input';
import { faArrowLeft, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Container>
      <RegisterTopContainer>
        <CustomText color={'textLink'} center title>Kayıt Ol</CustomText>
      </RegisterTopContainer>

      <FormContainer>
        <Input placeholder="Ad Soyad" icon={faUser} />
        <Input placeholder="E-mail" icon={faEnvelope} />
        <Input placeholder="Şifre" icon={faLock} secureTextEntry={true} />
        <Input placeholder="Şifre (Tekrar)" icon={faLock} secureTextEntry={true} />

        <Button
          onPress={() => {
            AlertDialog.showModal({
              title: 'Başlık',
              message: 'Mesaj',
            });
          }}
          borderRadius={10}
          text={t('KAYITOL')}
        />
      </FormContainer>
      <LoginContainer>
        <CustomText color="grey">Zaten bir hesabın var mı?</CustomText>
        <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}>
          <CustomText color={'textLink'}> Giriş yap</CustomText>
        </TouchableOpacity>
      </LoginContainer>
    </Container>
  )
}


const RegisterTopContainer = styled(View)`
  flex-direction: column;
  text-align: center;
  margin-bottom: 45px;
  margin-top: 45px;
`;

const FormContainer = styled(View)`
  margin: 20px;
  gap: 20px;
`;



const LoginContainer = styled(View)`
  margin-top: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

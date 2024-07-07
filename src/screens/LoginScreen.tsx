import { View, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import { useTranslation } from 'react-i18next';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import Button from '../components/Button/Button';
import Container from '../components/Container/Container';
import Input from '../components/Input/Input';
import CustomText from '../components/Text/Text';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import '../lang/i18n';

export default function LoginScreen(props: any) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        AlertDialog.showModal({
          title: errorCode,
          message: errorMessage,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container>
      <LoginTopContainer>
        {/* <CustomText color="textBlack" center fontSizes="h1">
          Hoş Geldiniz
        </CustomText> */}
        <CustomText color="textLink" center fontSizes="h1">
          Öğretmenim
        </CustomText>
      </LoginTopContainer>
      <FormContainer>
        <Input
          id='email'
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="E-mail"
          onChangeText={e => setEmail(e)}
          icon={faEnvelope}
        />
        <Input
          id='password'
          placeholder="Şifre"
          onChangeText={e => setPassword(e)}
          icon={faLock}
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={() => props.navigation.navigate('ForgotPasswordScreen')}>
          <CustomText color="grey">Şifremi Unuttum</CustomText>
        </TouchableOpacity>
        <Button
          loading={loading}
          onPress={() => {
            handleLogin();
          }}
          borderRadius={10}
          text={t('Giriş')}
        />
      </FormContainer>
      <RegisterContainer>
        <CustomText color="grey">Henüz hesabın yok mu? </CustomText>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('RegisterScreen')}>
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
  gap: 10px;
`;
const RegisterContainer = styled(View)`
  margin-top: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

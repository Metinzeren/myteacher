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
import Footer from '../components/Footer/Footer';
import { getResourceByKey } from '../lang/i18n';

export default function LoginScreen(props: any) {
  const { t } = useTranslation();
  const firebaseTranslation = getResourceByKey('firebase')
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
    } catch (error: any) {
      const errorCode = error.code;
      console.log(errorCode)
      const errorMessage = firebaseTranslation(`${errorCode}`);
      AlertDialog.showModal({
        title: t('ERROR'),
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginTopContainer>
        <CustomText color="purple" center fontSizes="h1">
          Öğretmenim
        </CustomText>
      </LoginTopContainer>
      <FormContainer>
        <Input
          required
          id="email"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t("EMAIL")}
          onChangeText={e => setEmail(e)}
          icon={faEnvelope}
        />
        <Input
          required
          id="password"
          placeholder={t("PASSWORD")}
          onChangeText={e => setPassword(e)}
          icon={faLock}
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={() => props.navigation.navigate('ForgotPasswordScreen')}>
          <CustomText color="grey">{t("FORGOT_PASSWORD")}</CustomText>
        </TouchableOpacity>
        <Button
          loading={loading}
          onPress={() => {
            handleLogin();
          }}
          borderRadius={10}
          text={t('LOGIN')}
        />
      </FormContainer>
      <RegisterContainer>
        <CustomText color="grey">{t("DO_YOU_HAVE_NOT_ACCOUNT")} </CustomText>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('RegisterScreen')}>
          <CustomText color={'purple'}>{t("REGISTER")}</CustomText>
        </TouchableOpacity>
      </RegisterContainer>
      <Footer />
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
  flex:1;
  justify-content: center;
`;

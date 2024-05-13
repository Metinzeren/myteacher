import {View, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons';

import {useTranslation} from 'react-i18next';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import Button from '../components/Button/Button';
import Container from '../components/Container/Container';
import Input from '../components/Input/Input';
import CustomText from '../components/Text/Text';
import {useState} from 'react';

import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebase/config';

export default function LoginScreen(props: any) {
  const {t} = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('a');
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
  };
  return (
    <Container>
      <LoginTopContainer>
        <CustomText color="textBlack" center title>
          Welcome To
        </CustomText>
        <CustomText color="primaryText" center h1>
          Teacher Application
        </CustomText>
      </LoginTopContainer>
      <FormContainer>
        <Input placeholder="E-mail" icon={faEnvelope} />
        <Input placeholder="Şifre" icon={faLock} secureTextEntry={true} />
        <TouchableOpacity
          onPress={() => props.navigation.navigate('ForgotPasswordScreen')}>
          <CustomText color="grey">Şifremi Unuttum</CustomText>
        </TouchableOpacity>
        <Button
          onPress={() => {
            handleLogin();
          }}
          borderRadius={10}
          text={t('LOGIN')}
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

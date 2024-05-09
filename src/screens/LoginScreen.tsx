import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faKey, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import useThemeColors from '../constant/useColor';

export default function LoginScreen() {
  const colors = useThemeColors();

  return (
    <Container>
      <LoginTopcontainer>
      <LoginTitle>Welcome To</LoginTitle>
      <AppNameTitle>Teacher Application</AppNameTitle>
      <LoginSubTitle>The First Teaching Services Provider with a Click of a Button</LoginSubTitle>

      </LoginTopcontainer>
      <InputContainer>
        <InputIcon icon={faEnvelope} />
        <Input
          placeholder="Email"
          placeholderTextColor={"grey"}
        />
      </InputContainer>
      <InputContainer>
        <InputIcon icon={faKey} />
        <Input
          placeholder="Şifre"
          placeholderTextColor={"grey"}
        />
      </InputContainer>
      <TouchableOpacity onPress={() => console.log("Şifremi Unuttum")}>
        <ForgotPasswordText>Şifremi Unuttum</ForgotPasswordText>
      </TouchableOpacity>
      <LoginButton onPress={() => console.log("Giriş yapıldı")}>
        <LoginButtonText>Giriş Yap</LoginButtonText>
      </LoginButton>
      <RegisterContainer>
  <RegisterText>Henüz hesabın yok mu? </RegisterText>
  <TouchableOpacity><RegisterLink>Hesap oluştur</RegisterLink></TouchableOpacity>
</RegisterContainer>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  align-items: center;
  background-color: #ffffff;
`;

const LoginTopcontainer= styled(View)`
  flex-direction:column;
  align-items: center;
  justify-content: center;
  gap:10px;
  text-align:center;
  margin-bottom:45px;
  margin-top:100px;
`
const LoginTitle = styled(Text)`
  font-size:22px;
  font-weight:semi-bold;
  text-align:center;
`
const AppNameTitle = styled (Text)`
  font-size:35px;
  text-align:center;
  font-weight:bold;
  color:#E78577;
`

const LoginSubTitle = styled (Text)`
  font-size:12px;
  text-align:center;
`
const InputContainer = styled(View)`
  width: 90%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`

const InputIcon = styled(FontAwesomeIcon)`
  color: #E78577;
  font-size: 20px;
  left:20px
`
const Input = styled(TextInput)`
  flex: 1;
  height: 40px;
  padding: 8px 8px 8px 30px;
  font-weight:bold;
  border-bottom-width: 1px;
  border-bottom-color: #E78577;
`;


const LoginButton = styled(TouchableOpacity)`
  background-color: #E78577;
  border-radius: 4px;
  padding: 12px 50px 12px 50px;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  width:90%
`;

const LoginButtonText = styled(Text)`
  color: #ffffff;
  font-size: 16px;
`;
const ForgotPasswordText = styled(Text)`
  color: #E78577;
  font-size: 14px;
  margin-top: 6px;
  font-weight:bold;
`;
const RegisterContainer = styled(View)`
  margin-top:15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const RegisterText = styled(Text)`
  color: grey;
`;

const RegisterLink = styled(Text)`
  color: #E78577;
`;
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import useThemeColors from '../constant/useColor';

export default function LoginScreen() {
  const colors = useThemeColors();

  return (
    <Container>
      <Form>
        <LoginTitle>MY TEACHER</LoginTitle>
        <InputContainer>
          <InputIcon icon={faUser} />
          <Input
            placeholder="Eposta adresinizi girin"
            placeholderTextColor={colors.lightGray}
          />
        </InputContainer>
        <InputContainer>
          <InputIcon icon={faLock} />
          <Input
            placeholder="Şifrenizi girin"
            placeholderTextColor={colors.lightGray}
            secureTextEntry={true}
          />
        </InputContainer>
        <RegisterTitle>Hesabın yok mu? <RegisterTitleLink onPress={() => console.log("dfhsdfh")}>Kayıt ol</RegisterTitleLink> </RegisterTitle>
        <LoginButton onPress={() => console.log("Giriş yapıldı")}>
          <LoginButtonText>GİRİŞ</LoginButtonText>
        </LoginButton>
      </Form>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  align-items: center;
  background-color: #ffffff;
`;

const Form = styled(View)`
  width: 80%;
  justify-content: center;
  align-items: center;
  margin-top: 50%;
`

const LoginTitle = styled(Text)`
  color: black;
  font-size: 25px;
  margin-bottom: 50px;
  fontWeight:bold;
`

const InputContainer = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
`

const InputIcon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 20px;
  position: absolute;
`

const Input = styled(TextInput)`
  flex: 1;
  height: 40px;
  padding: 8px 8px 8px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`

const LoginButton = styled(TouchableOpacity)`
  width: 50%;
  height: 40px;
  background-color: black;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const LoginButtonText = styled(Text)`
  color: #ffffff;
  font-size: 17px;
`;

const RegisterTitle = styled(Text)`
  color:black;
  font-size:15px;
`
const RegisterTitleLink = styled(Text)`
  color:orange;
  font-weight:bold;
`
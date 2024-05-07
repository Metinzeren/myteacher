import React from 'react';
import { View, Text, TextInput, TouchableOpacity ,Image} from 'react-native';
import styled from 'styled-components/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import useThemeColors from '../constant/useColor';

export default function LoginScreen() {
  const colors = useThemeColors();

  return (
    <Container>
      <LoginScreenSection>
        <LoginTopSection>
          <Image
            source={{ uri:'https://images.vexels.com/media/users/3/128199/isolated/preview/b354bc4707224bd3d15b9ae36eca70c0-male-student-cartoon.png?width=320' }}
            style={{ width: 260, height: 260}}
            resizeMode="contain"
          />
        </LoginTopSection>
        <LoginBottomSection>
          <InputContainer>
            <InputIcon icon={faEnvelope} />
            <Input
              placeholder="Email"
              placeholderTextColor={"grey"}
            />
          </InputContainer>
          <InputContainer>
            <InputIcon icon={faLock} />
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
        </LoginBottomSection>
      </LoginScreenSection>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  align-items: center;
  background-color: #ffffff;
`;

const LoginScreenSection = styled(View)`
  height: 100%;
  width: 100%;
  flex: 1;
  background-color: #d3e0c4;
`;

const LoginTopSection = styled(View)`
  align-items:center;
  justify-content:center;
  width:100%;
  height:45%;
`
const LoginTopSectionImage = styled(Text)`
`
const LoginBottomSection = styled(View)`
  width: 100%;
  height: 55%;
  background-color: white;
  border-radius: 50px 50px 0 0;
  align-items:center;
  padding-top:50px;
`;

const InputContainer = styled(View)`
  width: 85%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`

const InputIcon = styled(FontAwesomeIcon)`
  color: grey;
  font-size: 20px;
`
const Input = styled(TextInput)`
  flex: 1;
  height: 40px;
  padding: 8px 8px 8px 5px;
  font-weight:bold;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;


const LoginButton = styled(TouchableOpacity)`
  background-color: #b44a4a;
  border-radius: 10px;
  padding: 12px 50px 12px 50px;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
`;

const LoginButtonText = styled(Text)`
  color: #ffffff;
  font-size: 16px;
`;
const ForgotPasswordText = styled(Text)`
  color: #b44a4a;
  font-size: 14px;
  margin-top: 15px;
  font-weight:bold;
`;
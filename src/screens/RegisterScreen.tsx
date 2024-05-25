import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import Container from '../components/Container/Container';
import CustomText from '../components/Text/Text';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import Input from '../components/Input/Input';
import {
  faArrowLeft,
  faEnvelope,
  faLock,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebase/config';
import {useState} from 'react';

export default function RegisterScreen(props: any) {
  const {t} = useTranslation();
  const [registerDto, setRegisterDto] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const handleChange = (key: keyof typeof registerDto, value: string) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };
  return (
    <Container>
      <RegisterTopContainer>
        <CustomText color={'textLink'} center>
          Kayıt Ol
        </CustomText>
        <CustomText color={'grey'} center>
          Hesabını oluştur ve sınıfını oluştur. Hemen başla!
        </CustomText>
      </RegisterTopContainer>

      <FormContainer>
        <Input
          placeholder="Ad"
          icon={faUser}
          value={registerDto.firstName}
          onChangeText={e => handleChange('firstName', e)}
        />
        <Input
          placeholder="Soyad"
          icon={faUser}
          value={registerDto.lastName}
          onChangeText={e => handleChange('lastName', e)}
        />
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="E-mail"
          icon={faEnvelope}
          value={registerDto.email}
          onChangeText={e => handleChange('email', e)}
        />
        <Input
          placeholder="Şifre"
          icon={faLock}
          secureTextEntry={true}
          value={registerDto.password}
          onChangeText={e => handleChange('password', e)}
        />
        <Input
          placeholder="Şifre (Tekrar)"
          icon={faLock}
          secureTextEntry={true}
          value={registerDto.confirmPassword}
          onChangeText={e => handleChange('confirmPassword', e)}
        />

        <Button
          onPress={() => {
            createUserWithEmailAndPassword(
              auth,
              registerDto.email,
              registerDto.password,
            )
              .then(userCredential => {
                const user = userCredential.user;
                AlertDialog.showModal({
                  title: 'Başarılı',
                  message: 'Kullanıcı başarıyla oluşturuldu',
                });
              })
              .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                AlertDialog.showModal({
                  title: errorCode,
                  message: errorMessage,
                });
              });
          }}
          borderRadius={10}
          text={t('KAYITOL')}
        />
      </FormContainer>
      <LoginContainer>
        <CustomText color="grey">Zaten bir hesabın var mı? </CustomText>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <CustomText color={'textLink'}>Giriş yap</CustomText>
        </TouchableOpacity>
      </LoginContainer>
    </Container>
  );
}

const RegisterTopContainer = styled(View)`
  flex-direction: column;
  text-align: center;
  margin-bottom: 45px;
  margin-top: 45px;
  gap: 15px;
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

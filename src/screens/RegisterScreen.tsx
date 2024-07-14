import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Container from '../components/Container/Container';
import CustomText from '../components/Text/Text';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Input from '../components/Input/Input';
import {
  faArrowLeft,
  faEnvelope,
  faLock,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useRef, useState } from 'react';
import FormContainer, { FormContainerRef } from '../components/FormContainer';
import { getResourceByKey } from '../lang/i18n';
import UserRepository from '../repositories/UserRepository';
import User from '../models/User';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';

export default function RegisterScreen(props: any) {
  const { t } = useTranslation();
  const [registerDto, setRegisterDto] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (key: keyof typeof registerDto, value: string) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };
  const formRef = useRef<FormContainerRef>(null);

  const register = async () => {
    let isEmpty = formRef.current?.validate(getResourceByKey('addStudentForm'));
    if (isEmpty) {
      setLoading(true);
      let data = {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        password: registerDto.password,
        phone: registerDto.phone,
        role: "teacher",
      };

      try {
        const response = await axios.post(
          "https://europe-west1-my-teacher-553bb.cloudfunctions.net/createNewTeacher",
          data
        );

        if (response.status === 201) {
          AlertDialog.showModal({
            title: 'Başarılı',
            message: 'Kullanıcı başarıyla oluşturuldu',
            onConfirm() {
              props.navigation.goBack();
            },
          });
        }
      } catch (error: any) {
        console.log(error.response.data.error);
        AlertDialog.showModal({
          title: 'Hata',
          message: error.response.data.error,
        });
      } finally {
        setLoading(false);
      }
    }
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

      <FormContainer style={{ gap: 10, padding: 10 }} formContainerRef={formRef}>
        <Input
          placeholder="Ad"
          required
          id="firstName"
          icon={faUser}
          value={registerDto.firstName}
          onChangeText={e => handleChange('firstName', e)}
        />
        <Input
          id="lastName"
          required
          placeholder="Soyad"
          icon={faUser}
          value={registerDto.lastName}
          onChangeText={e => handleChange('lastName', e)}
        />
        <Input
          required
          id="email"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="E-mail"
          icon={faEnvelope}
          value={registerDto.email}
          onChangeText={e => handleChange('email', e)}
        />
        <Input
          required
          id="password"
          placeholder="Şifre"
          icon={faLock}
          secureTextEntry={true}
          value={registerDto.password}
          onChangeText={e => handleChange('password', e)}
        />
        <Input
          required
          id="confirmPassword"
          placeholder="Şifre (Tekrar)"
          icon={faLock}
          secureTextEntry={true}
          value={registerDto.confirmPassword}
          onChangeText={e => handleChange('confirmPassword', e)}
        />
        <Input
          required
          id="phone"
          placeholder="Telefon"
          icon={faPhone}
          value={registerDto.phone}
          onChangeText={e => handleChange('phone', e)}
        />

        <Button
          loading={loading}
          onPress={() => register()}
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

const LoginContainer = styled(View)`
  margin-top: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

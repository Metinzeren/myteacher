import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Container from '../components/Container/Container';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';
import { faEnvelope, faLock, faPhone, faSortNumericDesc, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import Input from '../components/Input/Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormContainer from '../components/FormContainer/FormContainer';
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from '../firebase/config'
import StudentRepository from '../repositories/StudentRepository';
import Student from '../models/Student';
export default function StudentsScreen(
  props: NativeStackScreenProps<RootStackParamList, 'StudentsScreen'>,
) {
  const studentRepo = StudentRepository.getInstance();
  const { t } = useTranslation();
  const [registerDto, setRegisterDto] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentNo: '',
    parentName: '',
    parentPhoneNo: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof registerDto, value: string) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };


  const handleAddStudent = async () => {
    let entity: Student = {
      firstName: "deneme",
      lastName: "deneme",
      parent: "Father",
      parentEmail: "deneme",
      parentFirstName: "Özkan",
      parentLastName: "Kocakaplan",
      parentPhone: "1234567890"
    };
    studentRepo.addStudent(entity).then((res) => {
      console.log("Eklendi");
    }).catch((err) => {
      console.log("Hata: " + err);
    })
    // console.log("deneme");
    // try {

    //   await addDoc(studentRef, { 
    //     firstName: registerDto.firstName,
    //     lastName: registerDto.lastName,
    //     studentNo:registerDto.studentNo,
    //     number: registerDto.studentNo,
    //     parentMail: registerDto.email,
    //     parentPhoneNumber: registerDto.parentPhoneNo
    //   });
    //   console.log("Document successfully written!");
    // } catch (error) {
    //   console.error("Error writing document: ", error);
    // } finally {
    //   setLoading(false);
    // }
  };
  return <Container isGoBack header title="Öğrenciler">


    <Container>
      <RegisterTopContainer>
        <CustomText color={'textLink'} center fontSizes='h1'>
          Öğrenci Ekle
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
          placeholder="Öğrenci okul numarası"
          icon={faSortNumericDesc}
          keyboardType='numeric'
          value={registerDto.studentNo}
          onChangeText={e => handleChange('studentNo', e)}
        />
        <Input
          placeholder="Veli adı"
          icon={faUser}
          value={registerDto.parentName}
          onChangeText={e => handleChange('parentName', e)}
        />
        <Input
          placeholder="Veli telefon numarası"
          icon={faPhone}
          keyboardType='numeric'
          maxLength={11}
          value={registerDto.parentPhoneNo}
          onChangeText={e => handleChange('parentPhoneNo', e)}
        />
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Veli e-mail"
          icon={faEnvelope}
          value={registerDto.email}
          onChangeText={e => handleChange('email', e)}
        />
        <Button
          borderRadius={10}
          onPress={() => {
            handleAddStudent();
          }}
          text={t('KAYDET')}
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
  </Container>;
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

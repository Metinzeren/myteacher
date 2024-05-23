import {View, Text} from 'react-native';
import React, {useState} from 'react';
import Container from '../components/Container/Container';
import FormContainer from '../components/FormContainer/FormContainer';
import Input from '../components/Input/Input';
import Student from '../models/Student';
import StudentRepository from '../repositories/StudentRepository';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import {
  faEnvelope,
  faPhone,
  faSortNumericDesc,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import {useTranslation} from 'react-i18next';

export default function AddStudentScreen() {
  const {t} = useTranslation();
  const studentRepo = StudentRepository.getInstance();

  const [registerDto, setRegisterDto] = useState<Student>({
    firstName: 'deneme',
    lastName: 'deneme',
    studentNo: 1234,
    parent: 'Father',
    parentEmail: 'deneme',
    parentFirstName: 'Özkan',
    parentLastName: 'Kocakaplan',
    parentPhone: '1234567890',
  });
  const handleChange = (key: keyof typeof registerDto, value: string) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };

  const handleAddStudent = async () => {
    studentRepo
      .addStudent(registerDto)
      .then(res => {
        AlertDialog.showModal({
          title: 'Başarılı',
          message: 'Öğrenci başarıyla eklendi',
        });
      })
      .catch(err => {
        console.log('Hata: ' + err);
      });
  };
  return (
    <Container isGoBack header title="Öğrenci Ekle">
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
          keyboardType="numeric"
          value={registerDto.studentNo.toString()}
          onChangeText={e => handleChange('studentNo', e)}
        />
        <Input
          placeholder="Veli adı"
          icon={faUser}
          value={registerDto.parentFirstName}
          onChangeText={e => handleChange('parentFirstName', e)}
        />
        <Input
          placeholder="Veli telefon numarası"
          icon={faPhone}
          keyboardType="numeric"
          maxLength={11}
          value={registerDto.parentPhone}
          onChangeText={e => handleChange('parentPhone', e)}
        />
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Veli e-mail"
          icon={faEnvelope}
          value={registerDto.parentEmail}
          onChangeText={e => handleChange('parentEmail', e)}
        />
        <Button
          borderRadius={10}
          onPress={() => {
            handleAddStudent();
          }}
          text={t('KAYDET')}
        />
      </FormContainer>
    </Container>
  );
}

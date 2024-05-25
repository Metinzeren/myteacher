import {View, Text} from 'react-native';
import React, {useRef, useState} from 'react';
import Container from '../components/Container/Container';
import FormContainer, {
  FormContainerRef,
} from '../components/FormContainer/FormContainer';
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
import {useStudents} from '../context/StudentContext';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {RootStackParamList} from '../types/Navigation';
import ValidationHelper from '../components/Utils/ValidationHelper';

export default function AddStudentScreen(
  props: NativeStackScreenProps<RootStackParamList>,
) {
  const {t} = useTranslation();
  const studentRepo = StudentRepository.getInstance();
  const {addStudent} = useStudents();
  const [registerDto, setRegisterDto] = useState<Student>({
    firstName: '',
    lastName: '',
    studentNo: 1,
    parent: 'Father',
    parentEmail: '',
    parentFirstName: '',
    parentLastName: '',
    parentPhone: '',
  });

  const formRef = useRef<FormContainerRef>(null);
  const handleChange = (key: keyof typeof registerDto, value: string) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };

  const handleAddStudent = async () => {
    let isEmpty = formRef.current?.validate();
    if (!isEmpty) {
      const entity = await studentRepo.addStudent(registerDto);
      addStudent(entity);
      AlertDialog.showModal({
        title: 'Başarılı',
        message: 'Öğrenci başarıyla eklendi',
        onConfirm() {
          props.navigation.goBack();
        },
      });
    } else {
      let errorFields = ValidationHelper.createErrorMessageByField(registerDto);
      formRef.current?.setErrorDataFiels(errorFields);
    }
  };
  return (
    <Container isGoBack header title="Öğrenci Ekle">
      <FormContainer formContainerRef={formRef}>
        <Input
          type="text"
          id="firstName"
          errorMessage=""
          placeholder="Ad"
          icon={faUser}
          value={registerDto.firstName}
          onChangeText={e => handleChange('firstName', e)}
        />
        <Input
          type="text"
          id="lastName"
          errorMessage=""
          placeholder="Soyad"
          icon={faUser}
          value={registerDto.lastName}
          onChangeText={e => handleChange('lastName', e)}
        />
        <Input
          type="text"
          errorMessage=""
          id="studentNo"
          placeholder="Öğrenci okul numarası"
          icon={faSortNumericDesc}
          keyboardType="numeric"
          value={registerDto.studentNo.toString()}
          onChangeText={e => handleChange('studentNo', e)}
        />
        <Input
          errorMessage=""
          type="text"
          id="parentFirstName"
          placeholder="Veli adı"
          icon={faUser}
          value={registerDto.parentFirstName}
          onChangeText={e => handleChange('parentFirstName', e)}
        />
        <Input
          type="text"
          id="parentPhone"
          placeholder="Veli telefon numarası"
          icon={faPhone}
          keyboardType="numeric"
          maxLength={11}
          value={registerDto.parentPhone}
          onChangeText={e => handleChange('parentPhone', e)}
        />
        <Input
          type="text"
          id="parentEmail"
          errorMessage=""
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

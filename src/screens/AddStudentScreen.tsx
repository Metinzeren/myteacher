import { View, Text, Keyboard } from 'react-native';
import React, { useRef, useState } from 'react';
import Container from '../components/Container/Container';
import Input from '../components/Input/Input';
import Student from '../models/Student';
import FormContainer, { FormContainerRef } from '../components/FormContainer';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import {
  faEnvelope,
  faPhone,
  faSortNumericDesc,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types/Navigation';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { useClassRooms } from '../context/ClassRoomContext';
import uuid from 'react-native-uuid';
export default function AddStudentScreen(
  props: NativeStackScreenProps<RootStackParamList, "AddStudentScreen">,
) {
  const t = useTranslation().t;
  const classRoomId = props.route.params.classRoomId;
  const classRoomRepo = ClassRoomRepository.getInstance();
  const { addStudentFromClassRoom } = useClassRooms();
  const [loading, setLoading] = useState(false);
  const [registerDto, setRegisterDto] = useState<Student>({
    id: uuid.v4().toString(),
    firstName: '',
    lastName: '',
    studentNo: '',
    parent: 'Father',
    parentEmail: '',
    parentFirstName: '',
    parentLastName: '',
    parentPhone: '',
    absenteeism: []
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

    console.log(isEmpty);
    return;
    if (isEmpty) {
      Keyboard.dismiss();
      setLoading(true);
      const entity = await classRoomRepo.addStudentToClassRoom(classRoomId, registerDto);
      setLoading(false);
      addStudentFromClassRoom(classRoomId, entity)
      AlertDialog.showModal({
        title: 'Başarılı',
        message: 'Öğrenci başarıyla eklendi',
        onConfirm() {
          props.navigation.goBack();
        },
      });
    }
  };
  return (
    <Container p={10} goBackShow header title="Öğrenci Ekle">
      <FormContainer
        style={{ gap: 10 }}
        formId='addStudentForm'
        formContainerRef={formRef}>
        <Input
          required
          id="firstName"
          placeholder="Ad"
          icon={faUser}
          value={registerDto?.firstName}
          onChangeText={e => handleChange('firstName', e)}
        />
        <Input
          required
          id="lastName"

          placeholder="Soyad"
          icon={faUser}
          value={registerDto?.lastName}
          onChangeText={e => handleChange('lastName', e)}
        />
        <Input
          required
          errorMessage=""
          id="studentNo"
          placeholder="Öğrenci okul numarası"
          icon={faSortNumericDesc}
          keyboardType="numeric"
          value={registerDto?.studentNo.toString()}
          onChangeText={e => handleChange('studentNo', e)}
        />
        <Input
          required
          errorMessage=""
          id="parentFirstName"
          placeholder="Veli adı"
          icon={faUser}
          value={registerDto?.parentFirstName}
          onChangeText={e => handleChange('parentFirstName', e)}
        />
        <Input
          required
          id="parentPhone"
          placeholder="Veli telefon numarası"
          icon={faPhone}
          keyboardType="numeric"
          maxLength={11}
          value={registerDto?.parentPhone}
          onChangeText={e => handleChange('parentPhone', e)}
        />
        <Input
          required
          id="parentEmail"
          errorMessage=""
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Veli e-mail"
          icon={faEnvelope}
          value={registerDto?.parentEmail}
          onChangeText={e => handleChange('parentEmail', e)}
        />
        <Button
          loading={loading}
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

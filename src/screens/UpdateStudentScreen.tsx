import { View, Text } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import Container from '../components/Container/Container'
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types'
import { RootStackParamList } from '../types/Navigation'
import Loading from '../components/Loading/Loading'
import FormContainer from '../components/FormContainer'
import Input from '../components/Input/Input'
import { faEnvelope, faPhone, faSortNumericDesc, faUser } from '@fortawesome/free-solid-svg-icons'
import { FormContainerRef } from '../components/FormContainer'
import Student from '../models/Student'

import Button from '../components/Button/Button'
import { t } from 'i18next'
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import { useClassRooms } from '../context/ClassRoomContext'
import AlertDialog from '../components/AlertDialog/AlertDialog'
import FormKeyboardView from '../components/FormKeyboardView/FormKeyboardView'

export default function UpdateStudentScreen(
  props: NativeStackScreenProps<RootStackParamList, 'UpdateStudentScreen'>,
) {

 

  const {classRooms} = useClassRooms();
  const studentId = props.route.params.studentId;

  const classRoomId = props.route.params.classRoomId;
  const student = classRooms?.find?.((c)=>c.id == classRoomId)?.students.find(d=> d.id === studentId) as Student;
  const [updateDto, setUpdateDto] = useState<Student>({
    id: student?.id,
    firstName: student?.firstName,
    lastName: student?.lastName,
    studentNo: student?.studentNo,
    parent: student?.parent,
    parentEmail: student?.parentEmail,
    parentFirstName: student?.parentFirstName,
    parentLastName: student?.parentLastName,
    parentPhone: student?.parentPhone,
  });


  const classRoomRepo = ClassRoomRepository.getInstance();
  const { updateStudentInClassRoom } = useClassRooms();
  const formRef = useRef<FormContainerRef>(null);

  const handleChange = (key: keyof Student, value: string) => {
    setUpdateDto(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updateStudent = async () => {
    const isEmpty = formRef.current?.validate();

    if (!isEmpty) {
      AlertDialog.showModal({
        title: "Uyarı",
        message:"Öğrencinin bilgileri düzenleme hay aq ",
        onConfirm() {
          classRoomRepo.updateStudentInClassRoom(classRoomId, updateDto);
          updateStudentInClassRoom(classRoomId, updateDto);
          AlertDialog.dismiss();
          props.navigation.goBack();
        },
      });

    }
  };

  return (
    <Container p={10} goBackShow header title='Öğrenci Güncelle'>
      <Loading>
      <FormKeyboardView>
      <FormContainer
          style={{gap:10}}
           
          formId="addStudentForm"
          formContainerRef={formRef}>
          <Input
            required
            id="firstName"
            errorMessage=""
            placeholder="Ad"
            icon={faUser}
            value={updateDto.firstName}
            onChangeText={e => handleChange('firstName', e)}
          />
          <Input
            required
            id="lastName"
            errorMessage=""
            placeholder="Soyad"
            icon={faUser}
            value={updateDto.lastName}
            onChangeText={e => handleChange('lastName', e)}
          />
          <Input
            required
            errorMessage=""
            id="studentNo"
            placeholder="Öğrenci okul numarası"
            icon={faSortNumericDesc}
            keyboardType="numeric"
            value={updateDto.studentNo?.toString()}
            onChangeText={e => handleChange('studentNo', e)}
          />
          <Input
            required
            errorMessage=""
            id="parentFirstName"
            placeholder="Veli adı"
            icon={faUser}
            value={updateDto.parentFirstName}
            onChangeText={e => handleChange('parentFirstName', e)}
          />
          <Input
            required
            errorMessage=""
            id="parentLastName"
            placeholder="Veli Soyadı"
            icon={faUser}
            value={updateDto.parentLastName}
            onChangeText={e => handleChange('parentLastName', e)}
          />
          <Input
            required
            id="parentPhone"
            placeholder="Veli telefon numarası"
            icon={faPhone}
            keyboardType="numeric"
            maxLength={11}
            value={updateDto.parentPhone}
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
            value={updateDto.parentEmail}
            onChangeText={e => handleChange('parentEmail', e)}
          />
          <Button
            borderRadius={10}
            onPress={updateStudent}
            text={t('GÜNCELLE')}
          />
        </FormContainer>
      </FormKeyboardView>
      </Loading>
    </Container>
  )
}

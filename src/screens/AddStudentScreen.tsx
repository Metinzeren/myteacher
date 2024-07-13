import {View, Text, Keyboard} from 'react-native';
import React, {useRef, useState} from 'react';
import Container from '../components/Container/Container';
import Input from '../components/Input/Input';
import Student from '../models/Student';
import FormContainer, {FormContainerRef} from '../components/FormContainer';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import {
  faEnvelope,
  faPhone,
  faSortNumericDesc,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import axios, {AxiosError} from 'axios';
import Button from '../components/Button/Button';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {RootStackParamList} from '../types/Navigation';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import {useClassRooms} from '../context/ClassRoomContext';
import {getResourceByKey} from '../lang/i18n';
import {getLocalStorage} from '../utils/AsyncStorageUtils';
export default function AddStudentScreen(
  props: NativeStackScreenProps<RootStackParamList, 'AddStudentScreen'>,
) {
  const t = useTranslation().t;
  const classRoomId = props.route.params.classRoomId;
  const classRoomRepo = ClassRoomRepository.getInstance();
  const {addStudentFromClassRoom} = useClassRooms();
  const [loading, setLoading] = useState(false);
  const [registerDto, setRegisterDto] = useState<Student>({
    firstName: '',
    lastName: '',
    studentNo: '',
    parentEmail: '',
    parentFirstName: '',
    parentLastName: '',
    parentPhone: '',
    absenteeism: [],
  });

  const formRef = useRef<FormContainerRef>(null);
  const handleChange = (key: keyof typeof registerDto, value: string) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };

  const handleAddStudent = async () => {
    let isEmpty = formRef.current?.validate(getResourceByKey('addStudentForm'));

    if (isEmpty) {
      Keyboard.dismiss();
      setLoading(true);

      try {
        const user = await getLocalStorage('authUser');
        const accessToken = user?.stsTokenManager?.accessToken;
        let data = {
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          email: registerDto.parentEmail,
          phone: registerDto.parentPhone,
        };

        const response = await axios.post(
          'https://europe-west1-my-teacher-553bb.cloudfunctions.net/createUser',
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (response.status === 201) {
          const entity = response.data;
          addStudentFromClassRoom(classRoomId, entity);

          AlertDialog.showModal({
            title: 'Başarılı',
            message: 'Öğrenci başarıyla eklendi',
            onConfirm() {
              props.navigation.goBack();
            },
          });
        }
      } catch (error: AxiosError | any) {
        console.error('Error adding student:', error.response.error);
        AlertDialog.showModal({
          title: 'Hata',
          message: 'Öğrenci eklenirken bir hata oluştu.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container p={10} goBackShow header title="Öğrenci Ekle">
      <FormContainer style={{gap: 10}} formContainerRef={formRef}>
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
          errorMessage=""
          id="parentLastName"
          placeholder="Veli Soyadı"
          icon={faUser}
          value={registerDto?.parentLastName}
          onChangeText={e => handleChange('parentLastName', e)}
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

import { View, Text, Keyboard } from 'react-native';
import React, { useRef, useState } from 'react';
import Container from '../components/Container/Container';
import ClassRoom from '../models/ClassRoom';
import uuid from 'react-native-uuid';
import { FormContainerRef } from '../components/FormContainer';
import FormContainer from 'react-native-form-container';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { faSortNumericDesc, faUser } from '@fortawesome/free-solid-svg-icons';
import { t } from 'i18next';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import { useClassRooms } from '../context/ClassRoomContext';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import { useTranslation } from 'react-i18next';
import { getResourceByKey } from '../lang/i18n';
import { getUserId } from '../utils/AsyncStorageUtils';

export default function AddClassScreen(
  props: NativeStackScreenProps<RootStackParamList, 'AddClassScreen'>,
) {
  const [registerDto, setRegisterDto] = useState<ClassRoom>({
    id: uuid.v4().toString(),
    name: '',
    students: [],
    teachers: [],
  });

  const classRoomRepo = ClassRoomRepository.getInstance();
  const { addClassRoom } = useClassRooms();

  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormContainerRef>(null);
  const handleChange = (key: keyof typeof registerDto, value: string) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };

  const handleAddStudent = async () => {
    let userId = await getUserId()
    let addedUserIdFromTeacher = { ...registerDto, teachers: [userId] };
    let isEmpty = formRef.current?.validate(
      getResourceByKey('addClassRoomForm'),
    );
    if (isEmpty) {
      Keyboard.dismiss();
      setLoading(true);
      const entity = await classRoomRepo.addClassRoom(addedUserIdFromTeacher);
      setLoading(false);
      addClassRoom(entity);
      AlertDialog.showModal({
        title: 'Başarılı',
        message: 'Sınıf başarıyla eklendi',
        onConfirm() {
          props.navigation.goBack();
        },
      });
    }
  };
  return (
    <Container p={10} header goBackShow title="Sınıf ekle">
      <FormContainer style={{ gap: 10 }} formContainerRef={formRef}>
        <Input
          required
          id="name"
          placeholder="Sınıf adı"
          icon={faUser}
          value={registerDto?.name}
          onChangeText={e => handleChange('name', e)}
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

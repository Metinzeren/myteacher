import { View, Text } from 'react-native';
import React, { useRef, useState } from 'react';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import Container from '../components/Container/Container';
import FormContainer, { FormContainerRef } from '../components/FormContainer';
import Input from '../components/Input/Input';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ClassRoom from '../models/ClassRoom';
import Button from '../components/Button/Button';
import { t } from 'i18next';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import { useClassRooms } from '../context/ClassRoomContext';

export default function UpdateClassScreen(
  props: NativeStackScreenProps<RootStackParamList, 'UpdateClassScreen'>,
) {
  const formRef = useRef<FormContainerRef>(null);
  const classInfo = props.route.params.classRoom;
  const classRoomRepo = ClassRoomRepository.getInstance();
  const [className, setClassName] = useState(classInfo);

  const { updateClassRoom } = useClassRooms();

  const handleChange = (key: keyof ClassRoom, value: string) => {
    setClassName(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };
  const updateClass = () => {
    const result = formRef.current?.validate({ className: "Bu alanı boş bırakamazsınız." })
    if (result) {
      classRoomRepo
        .updateClassRoom(className)
        .then(res => {
          if (res) {
            updateClassRoom(res);
            AlertDialog.showModal({
              title: 'Başarılı',
              message: 'Sınıf başarıyla güncellendi',
              onConfirmText: 'Tamam',
              onConfirm: () => {
                props.navigation.goBack();
              },
            });
          }
        })
        .catch(er => {
          console.log(er);
          AlertDialog.showModal({
            title: 'Hata',
            message: 'Sınıf güncellenirken bir hata oluştu',
          });
        });
    }

  };
  return (
    <Container p={10} header title="Sınıf Bilgisi Güncelle" goBackShow>
      <FormContainer
        style={{ gap: 10 }}
        formContainerRef={formRef}>
        <Input
          required
          id="className"
          errorMessage=""
          placeholder="Ad"
          icon={faUser}
          value={className.name}
          onChangeText={e => handleChange('name', e)}
        />
        <Button borderRadius={10} onPress={updateClass} text={t('KAYDET')} />
      </FormContainer>
    </Container>
  );
}

import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types'
import { RootStackParamList } from '../types/Navigation'
import Container from '../components/Container/Container'
import FormContainer, { FormContainerRef } from '../components/FormContainer'
import Input from '../components/Input/Input'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import ClassRoom from '../models/ClassRoom'
import Button from '../components/Button/Button'
import { t } from 'i18next'
import AlertDialog from '../components/AlertDialog/AlertDialog'
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import { useClassRooms } from '../context/ClassRoomContext'

export default function UpdateClassScreen(
    props: NativeStackScreenProps<RootStackParamList>,
) {
    const formRef = useRef<FormContainerRef>(null);
    const classInfo = props.route.params.classRoom
    const classRoomRepo = ClassRoomRepository.getInstance();
    const { updateClassRoom } = useClassRooms();
    console.log(classInfo);
    
    const [className, setClassName] = useState(classInfo);
    console.log(classInfo.name,"deneme");
    const handleChange = (key: keyof ClassRoom, value: string) => {
        setClassName(prevState => ({
          ...prevState,
          [key]: value,
        }));
      };
      const updateClass = async () => {
        const isEmpty = formRef.current?.validate();
        console.log(className.className);
        
        // if (isEmpty) {
        //   AlertDialog.showModal({
        //     title: "Uyarı",
        //     message:"Öğrencinin bilgileri düzenleme",
        //     onConfirm() {
        //       classRoomRepo.updateClassRoom(classInfo.id, className);
        //       updateClassRoom(classInfo.id, className);
        //       AlertDialog.dismiss();
        //       props.navigation.goBack();
        //     },
        //   });
    
        // }
      };
  return (
    <Container p={10} header title='Sınıf Güncelle' goBackShow>
         <FormContainer
          style={{gap:10}}    
          formId="addStudentForm"
          formContainerRef={formRef}>
          <Input
            required
            id="className"
            errorMessage=""
            placeholder="Ad"
            icon={faUser}
            value={className.name}
            onChangeText={e => handleChange('className', e)}
          />
            <Button
            borderRadius={10}
            onPress={updateClass}
            text={t('GÜNCELLE')}
          />
          </FormContainer>
    </Container>
  )
}
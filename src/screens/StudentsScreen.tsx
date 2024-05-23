import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../components/Container/Container';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {RootStackParamList} from '../types/Navigation';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';
import {
  faEnvelope,
  faLock,
  faPhone,
  faSortNumericDesc,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import Input from '../components/Input/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FormContainer from '../components/FormContainer/FormContainer';
import {addDoc, collection, doc, setDoc} from 'firebase/firestore';
import {db} from '../firebase/config';
import StudentRepository from '../repositories/StudentRepository';
import Student from '../models/Student';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import Loading from '../components/Loading/Loading';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
export default function StudentsScreen(
  props: NativeStackScreenProps<RootStackParamList, 'StudentsScreen'>,
) {
  const studentRepo = StudentRepository.getInstance();

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([] as Student[]);

  useEffect(() => {
    loadStudents();
    return () => {
      setStudents([] as Student[]);
      setLoading(true);
    };
  }, []);

  const loadStudents = () => {
    setLoading(true);
    studentRepo
      .getAllStudents()
      .then(res => {
        setStudents(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const RenderItem = ({item, index}: {item: Student; index: number}) => {
    return (
      <ListItem key={index}>
        <CustomText color="grey">Öğrenci Adı:</CustomText>
        <CustomText color="grey">
          {item.firstName} {item.lastName}
        </CustomText>
      </ListItem>
    );
  };
  return (
    <Container isGoBack header title="Öğrenciler">
      <Loading loading={loading}>
        <ListContainer>
          <CustomFlatList
            notFoundText="Öğrenci Bulunamadı."
            filter={(entity, value, index) => {
              return (
                entity.firstName.toLowerCase().includes(value.toLowerCase()) ||
                entity.lastName.toLowerCase().includes(value.toLowerCase())
              );
            }}
            isSearchable
            data={students}
            renderItem={RenderItem}
          />
        </ListContainer>
        <ButtonContainer>
          <Button
            borderRadius={10}
            text="Öğrenci Ekle"
            onPress={() =>
              props.navigation.navigate('AddStudentScreen')
            }></Button>
        </ButtonContainer>
      </Loading>
    </Container>
  );
}
const ListContainer = styled(View)`
  flex: 1;
  padding: 10px;
`;
const ButtonContainer = styled(View)`
  flex: 0.2;
  justify-content: center;
  padding-horizontal: 10px;
`;
const ListItem = styled(TouchableOpacity)`
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
`;

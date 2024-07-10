import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../components/Container/Container';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';

import Button from '../components/Button/Button';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import StudentRepository from '../repositories/StudentRepository';
import Student from '../models/Student';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import Loading from '../components/Loading/Loading';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
import { useStudents } from '../context/StudentContext';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import { useClassRooms } from '../context/ClassRoomContext';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLORS, SIZES } from '../constant/theme';
import QuestionsList from '../components/QuestionsList/QuestionsList';
import useThemeColors from '../constant/useColor';
import FormContainer from '../components/FormContainer';
export default function StudentsScreen(
  props: NativeStackScreenProps<RootStackParamList, 'StudentsScreen'>,
) {
  const colors = useThemeColors();
  const { classRooms } = useClassRooms();
  const classRoomId = props.route.params?.classRoomId;
  const students = classRooms?.find?.(x => x.id == classRoomId)?.students || [];
  const refRBSheet = React.useRef<any>(null);

  const [selectedStudent, setSelectedStudent] = useState<Student>(
    {} as Student,
  );

  const RenderItem = ({ item, index }: { item: Student; index: number }) => {
    return (
      <ListItem
        onPress={() =>
          props.navigation.navigate('UpdateStudentScreen', {
            studentId: item.id as string,
            classRoomId: classRoomId,
          })
        }
        key={index}>
        <ListItemContainer>
          <CustomText color="grey">Öğrenci Adı:</CustomText>
          <CustomText color="grey">
            {item?.firstName} {item.lastName}
          </CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <CustomText color="grey">Öğrenci Numarası:</CustomText>
          <CustomText color="grey">{item.studentNo}</CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <CustomText color="grey">Veli Adı:</CustomText>
          <CustomText color="grey">
            {item.parentFirstName} {item.parentLastName}
          </CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <View></View>
          <View style={{ marginTop: 10 }}>
            <Button
              size="sm"
              text="Değerlendirme Ekle"
              onPress={() => {
                setSelectedStudent(item);
                refRBSheet.current.open();
              }}></Button>
          </View>
        </ListItemContainer>
      </ListItem>
    );
  };
  return (
    <Container goBackShow header title="Öğrenciler">
      <Loading>
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
              props.navigation.navigate('AddStudentScreen', {
                classRoomId: classRoomId,
              })
            }></Button>
        </ButtonContainer>
      </Loading>
      <RBSheet
        ref={refRBSheet}
        draggable
        onClose={() => { }}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: COLORS.grey,
          },
          container: {
            backgroundColor: colors.background,
            paddingVertical: 10,
          },
        }}
        height={SIZES.height / 1.2}
        customModalProps={{
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: true,
        }}>
        <QuestionsList student={selectedStudent} />
      </RBSheet>
    </Container>
  );
}
const ListContainer = styled(View)`
  flex: 1;
  padding: 10px;
`;
const ButtonContainer = styled(View)`
  flex: 0.2;
  max-height: 50px;
  margin-bottom: 20px;
  justify-content: center;
  padding-horizontal: 10px;
`;
const ListItem = styled(TouchableOpacity)`
  background-color: #fff;
  padding: 15px;
  margin-horizontal: 2px;
  border-radius: 8px;
  flex-direction: column;
  margin-bottom: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`;

const ListItemContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import ClassRoom from '../models/ClassRoom';
import Container from '../components/Container/Container';
import Loading from '../components/Loading/Loading';
import styled from 'styled-components';
import Button from '../components/Button/Button';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
import CustomText from '../components/Text/Text';
import { useClassRooms } from '../context/ClassRoomContext';
import AlertDialog from '../components/AlertDialog/AlertDialog';

export default function ClassRoomScreen(
  props: NativeStackScreenProps<RootStackParamList>,
) {
  const classRoomRepo = ClassRoomRepository.getInstance();
  const [loading, setLoading] = useState(true);
  const { setClassRooms, classRooms , deleteClassRoom} = useClassRooms();
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      loadClassRoom();
    });
    return () => {
      setClassRooms([]);
    };
  }, []);
  const loadClassRoom = () => {
    setLoading(true);
    classRoomRepo
      .getAllClassRooms()
      .then(res => {
        setClassRooms(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const deleteClass = (id:string)=>{
    AlertDialog.showModal({
      title: "Uyarı",
      message:'Sınıfı kalıcı olarak silmeye emin misiniz?',
      onConfirm() {
        classRoomRepo.deleteClassRoom(id as string)
        deleteClassRoom(id as string);
        AlertDialog.dismiss();
      },
    });
  }
  const RenderItem = ({ item, index }: { item: ClassRoom; index: number }) => {
    return (
      <ListItem
        onPress={() => {
          props.navigation.navigate('StudentsScreen', {
            classRoomId: item.id as string,
          });
        }}
        key={index}>
        <ListItemContainer>
          <CustomText color="grey">Sınıf Adı:</CustomText>
          <CustomText color="grey">{item.name}</CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <CustomText color="grey">Öğrenciler</CustomText>
          <CustomText color="grey">Git</CustomText>
        </ListItemContainer>
        <DeleteItemContainer>
        <Button
          borderRadius={10}
          text="Sınıfı Sil"
          onPress={() => {
            deleteClass(item.id as string)
          }}></Button>
        </DeleteItemContainer>
      </ListItem>
    );
  };
  return (
    <Container goBackShow header title="Sınıflar">
      <Loading loading={loading}>
        <ListContainer>
          <CustomFlatList
            notFoundText="Sınıf Bulunamadı."
            filter={(entity, value, index) => {
              return entity.name.toLowerCase().includes(value.toLowerCase());
            }}
            isSearchable
            data={classRooms}
            renderItem={RenderItem}
          />
        </ListContainer>
        <ButtonContainer>
          <Button
          
            borderRadius={10}
            text="Sınıf Ekle"
            onPress={() => {
              props.navigation.navigate("AddClassScreen")
            }}></Button>
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

const DeleteItemContainer = styled(View)`
  justify-content:flex-end;
  flex:1;
`

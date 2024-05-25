import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../components/Container/Container'
import StudentRepository from '../repositories/StudentRepository';
import Student from '../models/Student';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import Loading from '../components/Loading/Loading';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';
import BookSvgIcon from '../assets/icons/BookSvgIcon';
import Button from '../components/Button/Button';
import { useNavigation } from '@react-navigation/native';
import { useStudents } from '../context/StudentContext';

export default function StudentDetailScreen(props: NativeStackScreenProps<RootStackParamList, 'StudentDetailScreen'>) {
    const studentRepo = StudentRepository.getInstance();
    const {deleteStudent} = useStudents()

    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState<string>(props.route.params.studentId)
    const [student, setStudent] = useState([] as Student[]);
    const navigation = useNavigation();

    useEffect(() => {
        loadStudents();
        return () => {
            setStudent([] as Student[]);
            setLoading(true);
        };
    }, []);

    const loadStudents = () => {
        setLoading(true);
        studentRepo
            .getStudent(studentId)
            .then(res => {

                setStudent([res]);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    
    const pressToDelete = ()=>{
        setLoading(true)
        studentRepo.deleteStudent(studentId).then(res => {
            deleteStudent(studentId);
            props.navigation.goBack();
        })
        .finally(()=>{
            setLoading(false)
        })
    }
    const RenderItem = ({ item, index }: { item: Student; index: number }) => {
        return (
            <ListItem onPress={() => props.navigation.navigate('StudentDetailScreen', { studentId: item.id as string })}
                key={index}>
                <ListItemPhoto>
                    <Image height={300} width={300} source={item.photo
                        ? { uri: item.photo }
                        : { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7ZLUi-ge0TEHx5zB1ZVNfTaAPDw5FSfpr3oR67ZkQmg&s' }} />
                </ListItemPhoto>
                <ListItemContainer>
                    <CustomText color="grey"  >Öğrenci Adı:</CustomText>
                    <CustomText color="grey" >{item.firstName}</CustomText>
                </ListItemContainer>
                <ListItemContainer>
                    <CustomText color="grey" >Öğrenci Soyadı:</CustomText>
                    <CustomText color="grey" >{item.lastName}</CustomText>
                </ListItemContainer>
                <ListItemContainer>
                    <CustomText color="grey" >Öğrenci Numarası:</CustomText>
                    <CustomText color="grey" >{item.studentNo}</CustomText>
                </ListItemContainer>
                <ListItemContainer>
                    <CustomText color="grey" >Veli Adı:</CustomText>
                    <CustomText color="grey" >{item.parentFirstName}</CustomText>
                </ListItemContainer>
                <ListItemContainer>
                    <CustomText color="grey" >Veli Soyadı:</CustomText>
                    <CustomText color="grey" >{item.parentLastName}</CustomText>
                </ListItemContainer>
                <ListItemContainer>
                    <CustomText color="grey" >Veli E-mail:</CustomText>
                    <CustomText color="grey" >{item.parentEmail}</CustomText>
                </ListItemContainer>
                <ListItemContainer>
                    <CustomText color="grey" >Veli Telefon Numarası:</CustomText>
                    <CustomText color="grey" >{item.parentPhone}</CustomText>
                </ListItemContainer>
            </ListItem>
        );
    };
    return (
        <Container isGoBack header>
            <Loading loading={loading}>
                <ListContainer>
                    <CustomFlatList
                        notFoundText="Öğrenci Bulunamadı."
                        data={student}
                        renderItem={RenderItem}
                    />
                </ListContainer>
                <ButtonContainer>
                    <Button onPress={()=>pressToDelete()} text='Öğrenciyi Sil'/>
                    <Button text='Öğrenciyi Güncelle'/>
                </ButtonContainer>
            </Loading>
        </Container>
    )
}

const ListContainer = styled(View)`
  flex: 1;
`;

const ListItem = styled(TouchableOpacity)`
  background-color: #fff;
  padding: 15px;
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
  margin-bottom: 20px;
`;
const ListItemPhoto = styled(View)`
    align-items:center;
    justify-content:center;
`
const ButtonContainer = styled(View)`
    margin:20px;
    justify-content:space-between;
    align-items:center;
    flex-direction:row;
`
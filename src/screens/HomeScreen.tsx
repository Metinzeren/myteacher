import { View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Container from '../components/Container/Container';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faAngleRight,
  faClose,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import useThemeColors from '../constant/useColor';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import { homeMenu } from '../data/data';
import Button from '../components/Button/Button';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { ScrollView } from 'react-native-gesture-handler';
import Input from '../components/Input/Input';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import ClassRoom from '../models/ClassRoom';
import IconButton from '../components/IconButton/IconButton';
import Loading from '../components/Loading/Loading';
import AlertDialog from '../components/AlertDialog/AlertDialog';

const HomeScreen = (
  props: NativeStackScreenProps<RootStackParamList, 'HomeScreen'>,
) => {
  const classRoomRepo = ClassRoomRepository.getInstance();
  const colors = useThemeColors();

  const [loading, setLoading] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');
  const [focusToSearch, setFocusToSearch] = useState(false);
  const [searchStudents, setSearchStudents] = useState<Array<ClassRoom>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  return (
    <Container title="Anasayfa" header showNotification>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <HomeTopContainer>
          <View style={{ flex: 1 }}>
            <Input
              autoCapitalize="none"
              id="searchStudent"
              placeholder="Öğrenci Ara"
              icon={faSearch}
              value={searchStudent}
              onChangeText={search => {
                if (search.length === 0) {
                  setSearchStudents([]);
                }
                setSearchStudent(search);
              }}
              onSubmitEditing={async () => {
                setSearchLoading(true);
                const result =
                  await classRoomRepo.getStudentByStudentNameForQuery(
                    searchStudent,
                  );
                setSearchLoading(false);
                setSearchStudents(result);
              }}
              onFocus={() => {
                if (searchStudent.length === 0 && searchStudents.length !== 0) {
                  setSearchStudents([]);
                }
                setFocusToSearch(true);
              }}
              inputMode="search"
              onBlur={() => {
                if (searchStudent === '' && searchStudents.length === 0) {
                  setFocusToSearch(false);
                }
              }}
            />
          </View>
          {focusToSearch && (
            <IconButton
              onPress={() => {
                setSearchStudent('');
                setSearchStudents([]);
                setFocusToSearch(false);
              }}
              icon={faClose}>

            </IconButton>
          )}
          {/* <HomeWidgets /> */}
        </HomeTopContainer>
        {focusToSearch ? (
          <Loading loading={searchLoading}>
            {searchStudents.map((item, index) => (
              <View
                key={index}
              >
                {item.students.map((student, studentIndex) => (
                  <TouchableOpacity
                    key={studentIndex}
                    onPress={() => {
                      props.navigation.navigate('UpdateStudentScreen', { student: student, classRoomId: item.id as string })
                    }}>
                    <ListContainer>
                      <ListItem>
                        <ListItemContainer>
                          <CustomText color="grey" >Öğrenci Adı: </CustomText>
                          <CustomText color="grey" >{student?.firstName} {student.lastName}</CustomText>
                        </ListItemContainer>
                        <ListItemContainer>
                          <CustomText color="grey" >Öğrenci Numarası:</CustomText>
                          <CustomText color="grey" >{student.studentNo}</CustomText>
                        </ListItemContainer>
                        <ListItemContainer>
                          <CustomText color="grey" >Veli Adı:</CustomText>
                          <CustomText color="grey" >{student.parentFirstName} {student.parentLastName}</CustomText>
                        </ListItemContainer>
                      </ListItem>
                    </ListContainer>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </Loading>
        ) : (
          <HomeBottomContainer>
            {homeMenu.map((item, index) => (
              <TouchableOpacity
                onPress={() => props.navigation.navigate(item?.link as any)}
                key={index}>
                <MenuItem>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item?.icon}
                    <CustomText fontSizes="h5" color="primaryText" center>
                      {item.name}
                    </CustomText>
                  </View>
                  <MenuItemButton>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      color={colors.iconColor}
                      size={20}
                    />
                  </MenuItemButton>
                </MenuItem>
              </TouchableOpacity>
            ))}

          </HomeBottomContainer>
        )}
      </ScrollView>
      <LogoutButton>
        <Button
          loading={loading}
          text="Çıkış Yap"
          onPress={() => {
            AlertDialog.showModal({
              title: "Çıkış yapmak istediğinize emin misiniz?",
              onConfirm() {
                setLoading(true);
                signOut(auth)
                  .then(() => {
                    props.navigation.navigate('LoginScreen');
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              },
              onCancel() {

              },
            })
          }}
        />
      </LogoutButton>
    </Container>
  );
};
const HomeBottomContainer = styled(View)``;
const HomeTopContainer = styled(View)`
  margin-horizontal: 10px;
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const MenuItem = styled(View)`
  flex-direction: row;
  padding-vertical: 10px;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-horizontal: 10px;
  margin-top: 10px;
  padding-right: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-color: #ddd;
`;
const MenuItemButton = styled(TouchableOpacity)``;
const LogoutButton = styled(View)`
  margin-vertical: 20px;
  margin-horizontal: 10px;
`;
const ListItem = styled(View)`
  background-color: #fff;
  padding: 15px;
  margin-horizontal: 2px;
  border-radius: 8px;
  flex-direction: column;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`;
const ListContainer = styled(View)`
  flex: 1;
  padding: 10px;
`;
const ListItemContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export default HomeScreen;

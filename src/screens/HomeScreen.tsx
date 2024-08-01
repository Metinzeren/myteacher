import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import CustomFlatList from '../components/Flatlist/CustomFlatList';

const HomeScreen = (
  props: NativeStackScreenProps<RootStackParamList, 'HomeScreen'>,
) => {
  const classRoomRepo = ClassRoomRepository.getInstance();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');
  const [focusToSearch, setFocusToSearch] = useState(false);
  const [searchStudents, setSearchStudents] = useState<Array<ClassRoom>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  return (
    <Container title={focusToSearch ? t('SEARCH_RESULTS') : t('HOME')} header showNotification={!focusToSearch}>
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
              placeholder={t('SEARCH_STUDENT')}
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
              icon={faClose}></IconButton>
          )}
          {/* <HomeWidgets /> */}
        </HomeTopContainer>
        {focusToSearch ? (
          <Loading loading={searchLoading}>
            {searchStudents.map((item, index) => (
              <View key={index}>
                {item.students.map((student, studentIndex) => (
                  <TouchableOpacity
                    key={studentIndex}
                    onPress={() => {
                      props.navigation.navigate('UpdateStudentScreen', {
                        student: student,
                        classRoomId: item.id as string,
                      });
                    }}>
                    <ListContainer>
                      <ListItem>
                        <ListItemContainer>
                          <CustomText color="grey">Öğrenci Adı: </CustomText>
                          <CustomText color="grey">
                            {student?.firstName} {student.lastName}
                          </CustomText>
                        </ListItemContainer>
                        <ListItemContainer>
                          <CustomText color="grey">
                            Öğrenci Numarası:
                          </CustomText>
                          <CustomText color="grey">
                            {student.studentNo}
                          </CustomText>
                        </ListItemContainer>
                        <ListItemContainer>
                          <CustomText color="grey">Veli Adı:</CustomText>
                          <CustomText color="grey">
                            {student.parentFirstName} {student.parentLastName}
                          </CustomText>
                        </ListItemContainer>
                      </ListItem>
                    </ListContainer>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </Loading>
        ) : (
          <NoSearchContainer>
            <HomeBottomContainer>
              {homeMenu.map((item, index) => (
                <TouchableOpacity
                  onPress={() => props.navigation.navigate(item?.link as any)}
                  key={index}>
                  <MenuItem>
                    <IconContainer>
                      {item?.icon}
                      <CustomText fontSizes="body5" color="primaryText" center>
                        {item.name}
                      </CustomText>
                    </IconContainer>
                  </MenuItem>
                </TouchableOpacity>
              ))}
            </HomeBottomContainer>

            <LogoutButton>
              <Button
                loading={loading}
                text={t('LOGOUT')}
                onPress={() => {
                  AlertDialog.showModal({
                    title: 'Çıkış yapmak istediğinize emin misiniz?',
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
                    onCancel() { },
                  });
                }}
              />
            </LogoutButton>
          </NoSearchContainer>

        )}
      </ScrollView>

    </Container>
  );
};
const screenWidth = Dimensions.get('window').width;
const HomeBottomContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
  margin-horizontal: 10px;
`;
const NoSearchContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  flex-direction: column;
`;

const IconContainer = styled(View)`
  flex-direction: column;
  align-items: center;
 width: ${screenWidth * 0.3}px;`
  ;
const HomeTopContainer = styled(View)`
  margin-horizontal: 10px;
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const MenuItem = styled(View)`
  flex-basis: 80%;
  height: 120px;
  margin: 10px; 
  padding: 15px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 3;
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

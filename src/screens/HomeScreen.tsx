import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Container from '../components/Container/Container';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';
import {
  faClose,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import useThemeColors from '../constant/useColor';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import { homeMenu } from '../data/data';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import Input from '../components/Input/Input';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import ClassRoom from '../models/ClassRoom';
import IconButton from '../components/IconButton/IconButton';
import Loading from '../components/Loading/Loading';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import { useTranslation } from 'react-i18next';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
import useFcmToken from '../hooks/useFcmToken';
import DevicesRepository from '../repositories/DeviceRepository';
import useUser from '../hooks/useUser';
import Footer from '../components/Footer/Footer';
import { SvgXml } from 'react-native-svg';
import { ICONS, SIZES } from '../constant/theme';
const HomeScreen = (
  props: NativeStackScreenProps<RootStackParamList, 'HomeScreen'>,
) => {
  const deviceRepo = DevicesRepository.getInstance();
  const classRoomRepo = ClassRoomRepository.getInstance();
  const { user } = useUser() as any;
  const { fcmToken } = useFcmToken();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');
  const [focusToSearch, setFocusToSearch] = useState(false);
  const [searchStudents, setSearchStudents] = useState<Array<ClassRoom>>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (fcmToken !== '') {
      saveFcmTokenToDevice();
    }
  }, [fcmToken]);

  const saveFcmTokenToDevice = () => {
    deviceRepo.addDevice({
      userId: auth.currentUser?.uid as string,
      fcmToken: fcmToken,
    });
  };

  const MenuItemCard = ({ item, index }: { item: any; index: number }) => {
    let maxItem = homeMenu.length;
    let isEven = maxItem % 2 === 0;
    let isLastItem = index === maxItem - 1;
    return (
      <TouchableOpacity
        style={{
          width: !isEven && !isLastItem ? '50%' : '100%',
        }}
        onPress={() => {
          if (item.link !== '') {
            props.navigation.navigate(item.link);
          } else {
            handleLogout();
          }
        }}>
        <MenuItem theme={{
          rtl: isLastItem && !isEven ? 'row' : 'column',
          justifyContent: isLastItem && !isEven ? "flex-start" : "center",
          minHeight: isLastItem && !isEven ? "auto" : "170px",
        }}>
          <SvgXml
            height={100}
            width={140}
            xml={item.icon}
          />
          <CustomText fontSizes="body5" color="primaryText" center>
            {item.name}
          </CustomText>
        </MenuItem>
      </TouchableOpacity>
    );
  };
  const handleLogout = () => {
    AlertDialog.showModal({
      title: 'Çıkış Yap',
      message: 'Çıkış yapmak istediğinize emin misiniz?',
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
  };

  return (
    <Container
      title={focusToSearch ? t('SEARCH_RESULTS') : t('HOME')}
      header
      isHome={true}
      userName={user ? user.firstName + ' ' + user.lastName : ''}
      showNotification={!focusToSearch}>
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
                        <CustomText color="grey">Öğrenci Numarası:</CustomText>
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
            <View>
              <CustomFlatList
                numColumns={2}
                data={homeMenu}
                renderItem={({ item, index }: { item: any; index: number }) => {
                  return (
                    <MenuItemCard
                      index={index}
                      item={{
                        name: item.name,
                        icon: item.icon,
                        link: item.link,
                      }}
                    />
                  );
                }}
              />
            </View>
          </HomeBottomContainer>
        </NoSearchContainer>
      )}
      <Footer />
    </Container>
  );
};
const HomeBottomContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const NoSearchContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  flex-direction: column;
`;

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
  flex-direction: ${props => props.theme.rtl || "column"};
  margin: 10px;
  min-height: ${props => props.theme.minHeight ?? "170px"};
  gap: 5px;
  padding: 15px;
  background-color: #fff;
  justify-content: ${props => (props.theme.justifyContent ?? "center")};
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 3;
`;
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

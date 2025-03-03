import { View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../components/Container/Container';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';
import { faAngleRight, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import { auth } from '../firebase/config';
import Input from '../components/Input/Input';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import ClassRoom from '../models/ClassRoom';
import IconButton from '../components/IconButton/IconButton';
import Loading from '../components/Loading/Loading';

import { useTranslation } from 'react-i18next';

import useFcmToken from '../hooks/useFcmToken';
import DevicesRepository from '../repositories/DeviceRepository';
import useUser from '../hooks/useUser';
import Footer from '../components/Footer/Footer';

import MenuItems from '../sections/Home/MenuItems';
import { getLanguage } from '../lang/i18n';
import LottieView from 'lottie-react-native';
type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const deviceRepo = DevicesRepository.getInstance();
  const classRoomRepo = ClassRoomRepository.getInstance();
  const { user, getUser } = useUser() as any;
  const [profile, setProfile] = useState(user);
  const { fcmToken } = useFcmToken();
  const { t } = useTranslation();
  const [searchStudent, setSearchStudent] = useState('');
  const [focusToSearch, setFocusToSearch] = useState(false);
  const [searchStudents, setSearchStudents] = useState<Array<ClassRoom>>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setSearchStudent('');
      setSearchStudents([]);
      setFocusToSearch(false);
      let user = await getUser();
      if (user) {
        setProfile(user);
      }
    });

    return unsubscribe;
  }, []);

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

  return (
    <>
      <Container
        title={focusToSearch ? t('SEARCH_RESULTS') : t('HOME')}
        header
        isHome={true}
        showNotification={!focusToSearch}>
        <HomeTopContainer>

          <View style={{ flex: 1, flexDirection: "column", gap: 20 }}>
            {!focusToSearch && <WelcomeContainer
              onPress={() => {
                navigation.navigate('ProfileScreen')
              }}
            >
              <LottieView
                style={{ width: 65, height: 65 }}
                autoPlay
                loop
                source={profile?.role === "parent" ? require('../assets/animations/lottie/parental-support.json') : require('../assets/animations/lottie/teacher-teaching-lesson.json')}
              />
              <View
                style={{ flex: 1, justifyContent: 'center', flexDirection: "column" }}
              >
                <CustomText fontSizes='body5' color='textBlack'>{profile ? profile.firstName + ' ' + profile.lastName : ''}</CustomText>
                <CustomText fontSizes='body6' color='grey'>{profile ? profile.email : ""}</CustomText>
              </View>
              <IconButton
                icon={faAngleRight}
                backgroundColor='transparent'
                iconColor='black'
              />
            </WelcomeContainer>
            }
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
            {searchStudents?.map((item, index) => (
              <View key={index}>
                {item?.students.map((student, studentIndex) => (
                  <TouchableOpacity
                    key={studentIndex}
                    onPress={() => {
                      navigation.navigate('UpdateStudentScreen', {
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
          <MenuItems lang={getLanguage()} />
        )}
        {!focusToSearch && <Footer />}
      </Container>
    </>

  );
};

const HomeTopContainer = styled(View)`
  margin-horizontal: 10px;
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
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
const WelcomeContainer = styled(TouchableOpacity)`
    background-color: #fff;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    flex-direction: row;
`;
export default HomeScreen;

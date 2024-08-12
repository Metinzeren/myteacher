import { View, Text, Platform, Alert, PermissionsAndroid, Image, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import Input from '../components/Input/Input';
import { faAdd, faAngleLeft, faFilter, faSearch, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import Container from '../components/Container/Container';
import useThemeColors from '../constant/useColor';
import CustomBottomSheet, { BottomSheetRef } from '../components/CustomBottomSheet/CustomBottomSheet';
import CustomText from '../components/Text/Text';
import styled from 'styled-components';
import Button from '../components/Button/Button';
import { useTranslation } from 'react-i18next';
import { getResourceByKey } from '../lang/i18n';
import FormContainer, { FormContainerRef } from 'react-native-form-container';
import uuid from 'react-native-uuid';
import { add, format, set } from 'date-fns';
import IconButton from '../components/IconButton/IconButton';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Homework from '../models/Homework';
import PlaceholderInput from '../components/PlaceholderInput/PlaceholderInput';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import ClassRoom from '../models/ClassRoom';
import Loading from '../components/Loading/Loading';
import Student from '../models/Student';

export default function CalendarScreen() {
  const filterBottomSheetRef = useRef<BottomSheetRef>(null);
  const addHomeworkBottomSheetRef = useRef<BottomSheetRef>(null);
  const photoButtonRef = useRef<BottomSheetRef>(null);
  const formRef = useRef<FormContainerRef>(null);
  const classRoomRepo = ClassRoomRepository.getInstance();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [loadingClassRooms, setLoadingClassRooms] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const today = format(new Date(), 'yyyy-MM-dd');
  const [classRooms, setClassRooms] = useState<Array<ClassRoom>>([]);
  const [students, setstudents] = useState<Array<Student>>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  let homeworkLanguage = getResourceByKey('homeworks');
  const [bottomSheetType, setBottomSheetType] = useState('saveStep');
  const [registerDto, setRegisterDto] = useState<Homework>({
    title: '',
    description: '',
    id: uuid.v4().toString(),
    photo: [],
    endDate: "",
    isCompleted: false,
    type: "",
    teacherId: "",
    classroomId: "",
    studentId: "",
    startDate: "",
  });
  const handleChange = (key: keyof typeof registerDto, value: string) => {
    setRegisterDto({
      ...registerDto,
      [key]: value,
    });
  };
  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo' as const,
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options as any, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri || null);
        handleChange('photo', uri || '');
      }
    });
  };
  const PhotoButtonContent = () => {
    return (
      <Buttons>
        <Button
          text="Select Image"
          onPress={() => {
            photoButtonRef.current?.close();
            handleSelectImage();
          }}
        />
        <Button
          text="Take Photo"
          onPress={() => {
            photoButtonRef.current?.close();
            requestCameraPermission();
          }}
        />
      </Buttons>
    );
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        handleTakePhoto();
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const handleTakePhoto = () => {
    const options = {
      mediaType: 'photo' as const,
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchCamera(options as any, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri || null);
        handleChange('photo', uri || '');
      }
    });
  };
  const StartDateCalendar = () => {
    return (
      <View>
        <IconButton
          icon={faAngleLeft}
          style={{ justifyContent: "flex-start" }}
          backgroundColor='transparent'
          iconColor='#20B2AA'
          iconSize={25}
          onPress={() => setBottomSheetType("saveStep")}
        />
        <Calendar
          minDate={today}
          onDayPress={(day: any) => {
            handleChange('startDate', day.dateString);
            setBottomSheetType("saveStep");
          }}
        />
      </View>

    );
  };

  const EndDateCalendar = () => {
    return (
      <View>
        <IconButton
          icon={faAngleLeft}
          style={{ justifyContent: "flex-start" }}
          backgroundColor='transparent'
          iconColor='#20B2AA'
          iconSize={25}
          onPress={() => setBottomSheetType("saveStep")}
        />
        <Calendar
          minDate={today && registerDto.startDate}
          onDayPress={(day: any) => {
            handleChange('endDate', day.dateString);
            setBottomSheetType("saveStep");
          }}
        />
      </View>

    );
  };


  const loadClassRoom = () => {
    setLoadingClassRooms(true);
    classRoomRepo
      .getAllClassRooms()
      .then(res => {
        setClassRooms(res);
      })
      .finally(() => {
        setLoadingClassRooms(false);
      });
  };

  const loadStudents = () => {
    setLoadingStudents(true);
    classRoomRepo
      .getStudentsByClassRoomId(registerDto.classroomId as string)
      .then(res => {
        setstudents(res)
      })
      .finally(() => {
        setLoadingStudents(false);
      });
  }

  const AddHomeworkContent = () => {
    return (
      <Container p={10} type='container'>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: colors.background,
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {bottomSheetType === "saveStep" && <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <FormContainer style={{ gap: 10 }} formContainerRef={formRef}>
                <View>
                  <CustomText fontSizes="body4" color="primaryText">
                    {t('ADD_PHOTO')}{' '}
                    <CustomText fontSizes="body6" color="textLink">
                      ({t('OPTIONAL')})
                    </CustomText>{' '}
                  </CustomText>
                </View>
                <AddPhotoContainer>
                  <IconContainer>
                    <IconButton
                      onPress={() => photoButtonRef.current?.open()}
                      icon={faAdd}
                    />
                  </IconContainer>
                  <ImageContainer>
                    {imageUri && <StyledImage source={{ uri: imageUri }} />}
                    {imageUri && (
                      <DeleteIconContainer>
                        <IconButton
                          iconSize={15}
                          backgroundColor="#fff"
                          iconColor="orange"
                          onPress={() => {
                            setRegisterDto({ ...registerDto, photo: [] });
                            setImageUri(null);
                          }}
                          icon={faTrash}
                        />
                      </DeleteIconContainer>
                    )}
                  </ImageContainer>
                </AddPhotoContainer>
                <Input
                  required
                  placeholder="Ödev adı"
                  icon={faUser}
                  value={registerDto?.title}
                  onChangeText={e => handleChange('title', e)}
                />
                <Input
                  required
                  placeholder="Ödev açıklaması"
                  icon={faUser}
                  multiline
                  value={registerDto?.description}
                  onChangeText={e => handleChange('description', e)}
                />
                <PlaceholderInput
                  required
                  id="startDate"
                  value={
                    registerDto.startDate
                      ? dayjs(registerDto?.startDate).format('DD.MM.YYYY')
                      : ` ${t('START_DATE')}`
                  }
                  onPress={() => {
                    setBottomSheetType("startCalendarStep");
                  }}
                />
                <PlaceholderInput
                  required
                  id="endDate"
                  value={
                    registerDto.endDate
                      ? dayjs(registerDto?.endDate).format('DD.MM.YYYY')
                      : ` ${t('END_DATE')}`
                  }
                  onPress={() => {
                    setBottomSheetType("endCalendarStep");
                  }}
                />
                <PlaceholderInput
                  required
                  id="type"
                  value={registerDto.type || ` ${t('TYPE')}`}
                  onPress={() => setBottomSheetType("selectTypeStep")}
                />
                <PlaceholderInput
                  required
                  id="type"
                  value={registerDto.type || ` ${t('TYPE')}`}
                  onPress={() => {
                    loadClassRoom()
                    setBottomSheetType("selectClassroom")
                  }}
                />
                <PlaceholderInput
                  required
                  id="type"
                  value={registerDto.type || ` ${t('TYPE')}`}
                  onPress={() => {
                    loadStudents()
                    setBottomSheetType("selectStudentStep")
                  }}
                />
              </FormContainer>
            </View>
            <View style={{ flex: 0.1 }}>
              <Button
                borderRadius={10}
                onPress={() => addHomeworkBottomSheetRef.current?.open()}
                text={t("SAVE")}
              ></Button>
            </View>
          </View>}
          {bottomSheetType === "selectTypeStep" && (
            <View style={{ flex: 1, gap: 50 }}>
              <IconButton
                icon={faAngleLeft}
                style={{ justifyContent: "flex-start" }}
                onPress={() => setBottomSheetType("saveStep")}
              />

              <Buttons>
                <Button
                  text="Günlük ödev"
                  onPress={() => {
                    handleChange("type", "daily");
                    setBottomSheetType("saveStep");
                  }}
                />
                <Button
                  text="Performans ödevi"
                  onPress={() => {
                    handleChange("type", "performance");
                    setBottomSheetType("saveStep");
                  }}
                />
              </Buttons>
            </View>
          )}
          {
            bottomSheetType === "startCalendarStep" && <StartDateCalendar />
          }
          {
            bottomSheetType === "endCalendarStep" && <EndDateCalendar />
          }
          {
            bottomSheetType === "selectClassroom" && <View style={{ flex: 1, gap: 50 }}>
              <IconButton
                icon={faAngleLeft}
                style={{ justifyContent: "flex-start" }}
                onPress={() => setBottomSheetType("saveStep")}
              />
              <Loading loading={loadingClassRooms}>

                <Buttons>
                  {classRooms.map((item, index) => (
                    <Button
                      key={index}
                      text={item.name}
                      onPress={() => {
                        handleChange("classroomId", item.id as string);
                        setBottomSheetType("saveStep");
                      }}
                    />
                  ))}
                </Buttons>
              </Loading>

            </View>
          }
          {
            bottomSheetType === "selectStudentStep" && <View style={{ flex: 1, gap: 50 }}>

              <IconButton
                icon={faAngleLeft}
                style={{ justifyContent: "flex-start" }}
                onPress={() => setBottomSheetType("saveStep")}
              />
              <Loading loading={loadingStudents}>

                <Buttons>
                  {students.map((item, index) => (
                    <Button
                      key={index}
                      text={item.firstName}
                      onPress={() => {
                        handleChange("classroomId", item.id as string);
                        setBottomSheetType("saveStep");
                      }}
                    />
                  ))}
                </Buttons>
              </Loading>

            </View>
          }
        </ScrollView>
      </Container>
    )
  }


  const getSnapPoints = () => {
    if (bottomSheetType === "selectTypeStep") {
      return ['50%', '40%'];
    } else if (bottomSheetType === "selectClassroom" || bottomSheetType === "selectStudentStep") {
      return ['90%', '80%'];
    }
    else if (bottomSheetType === "startCalendarStep" || bottomSheetType === "endCalendarStep") {
      return ['60%', '55%'];
    }
    else {
      return ['70%', '80%'];
    }
  };


  return (
    <Container
      goBackShow
      header
      title="Ödev Takvimi"
      extraIcon={faFilter}
      extraIconPress={() => {
        filterBottomSheetRef.current?.open();
      }}>
      {Platform.OS === 'android' ? <AndroidContaier /> : <IosContainer />}
      <HomeWorksContainer>

      </HomeWorksContainer>
      <ButtonContainer>
        <Button
          borderRadius={10}
          onPress={() => addHomeworkBottomSheetRef.current?.open()}
          text={t(homeworkLanguage.HOMEWORK_ADD)}
        ></Button>
      </ButtonContainer>
      <CustomBottomSheet ref={filterBottomSheetRef} snapPoints={["50%"]}>
        <CustomText color='black'>
          Buraya öğrencinin ödevlerini listeleyeceğimiz bir component gelecek
        </CustomText>
      </CustomBottomSheet>
      <CustomBottomSheet ref={addHomeworkBottomSheetRef} snapPoints={getSnapPoints()}>
        <AddHomeworkContent />
      </CustomBottomSheet>
      <CustomBottomSheet snapPoints={['20%', '40%']} ref={photoButtonRef}>
        <PhotoButtonContent />
      </CustomBottomSheet>
    </Container>
  );
}
const AndroidContaier = () => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'));
  const [search, setSearch] = useState('');
  const colors = useThemeColors();
  return (
    <SafeAreaView
      style={{
        height: 140,
        backgroundColor: colors.primary,
      }}>
      <CalendarProvider date={selectedDay}>
        <View>
          <WeekCalendar
            date={selectedDay}
            onDayPress={day => {
              setSelectedDay(day.dateString);
            }}
            firstDay={1}
            theme={{
              calendarBackground: 'transparent',
              backgroundColor: 'transparent',
              dayTextColor: '#fff',
              textSectionTitleColor: '#fff',
              selectedDayBackgroundColor: '#34495b',
            }}
          />
        </View>
      </CalendarProvider>
      <View style={{ marginTop: 10, marginBottom: 7, marginHorizontal: 10 }}>
        <Input
          id="search"
          enableFocusBorder={false}
          inputSize="md"
          style={{ backgroundColor: '#fff' }}
          icon={faSearch}
          placeholder="Ödev Ara"
          onChangeText={text => setSearch(text)}
          value={search}
        />
      </View>
    </SafeAreaView>
  );
};
const IosContainer = () => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'));
  const [search, setSearch] = useState('');
  const colors = useThemeColors();
  return (
    <View>
      <SafeAreaView>
        <CalendarProvider date={selectedDay}>
          <View
            style={{
              height: 140,
              position: 'absolute',
              top: -60,
              bottom: 0,
              backgroundColor: colors.primary,
            }}>
            <WeekCalendar
              date={selectedDay}
              onDayPress={day => {
                setSelectedDay(day.dateString);
              }}
              firstDay={1}
              theme={{
                calendarBackground: 'transparent',
                backgroundColor: 'transparent',
                dayTextColor: '#fff',
                textSectionTitleColor: '#fff',
                selectedDayBackgroundColor: '#34495b',
              }}
            />
            <View style={{ marginHorizontal: 10 }}>
              <Input
                id="search"
                enableFocusBorder={false}
                inputSize="md"
                style={{ backgroundColor: '#fff' }}
                icon={faSearch}
                placeholder="Ödev Ara"
                onChangeText={text => setSearch(text)}
                value={search}
              />
            </View>
          </View>
        </CalendarProvider>
      </SafeAreaView>
    </View>
  );
};
const HomeWorksContainer = styled(View)`
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

const IconContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #ebeff3;
  padding: 0px 5px;
  height: 100px;
`;

const DeleteIconContainer = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
`;

const AddPhotoContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100px;
`;

const ImageContainer = styled(View)`
  position: relative;
  height: 100px;
`;


const Buttons = styled(View)`
  flex-direction: column;
  gap: 10px;
  margin-horizontal: 10px;
`;
const StyledImage = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #ebeff3;
`;

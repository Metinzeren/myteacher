import { View, Platform, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import Input from '../components/Input/Input';
import { faFilter, faPen, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import Container from '../components/Container/Container';
import useThemeColors from '../constant/useColor';
import CustomBottomSheet, {
  BottomSheetRef,
} from '../components/CustomBottomSheet/CustomBottomSheet';
import CustomText from '../components/Text/Text';
import styled from 'styled-components';
import Button from '../components/Button/Button';
import { useTranslation } from 'react-i18next';
import { getResourceByKey } from '../lang/i18n';
import AddHomeWorkContent from '../bottomSheetContents/AddHomeWorkContent';
import { useHomeworks } from '../context/HomeworkContext';
import HomeworkRepository from '../repositories/HomeworkRepository';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import Loading from '../components/Loading/Loading';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
import Homework from '../models/Homework';
import IconButton from '../components/IconButton/IconButton';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import UpdateHomeWorkContent from '../bottomSheetContents/UpdateHomeWorkContent';
import FilteredHomwork from '../bottomSheetContents/FilteredHomwork';
export default function CalendarScreen(
  props: NativeStackScreenProps<RootStackParamList>,
) {
  const filterBottomSheetRef = useRef<BottomSheetRef>(null);
  const { setHomeworks, homeworks, deleteHomework, setSelectedHomework } = useHomeworks();
  const [loading, setLoading] = useState(true);
  const homeworkRepo = HomeworkRepository.getInstance();
  const [search, setSearch] = useState('');
  const addHomeworkBottomSheetRef = useRef<BottomSheetRef>(null);
  const updateHomeworkBottomSheetRef = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();
  let homeworkLanguage = getResourceByKey('homeworks');
  const getSnapPoints = () => {
    return ['85%'];
  };
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      loadHomeworks();
    });
  }, []);


  const loadHomeworks = () => {
    setLoading(true);
    homeworkRepo.getAllHomeworks().then(res => {
      setHomeworks(res);
    }).finally(() => {
      setLoading(false);
    }
    );
  }

  const RenderItem = ({ item, index }: { item: Homework; index: number }) => {
    return (
      <ListItem
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 1.24,
          elevation: 3,
        }}
        onPress={() => {

        }}
        key={index}>
        <ListItemContainer>
          <CustomText color="grey">{homeworkLanguage.HOMEWORK_TITLE}</CustomText>
          <CustomText color="grey">{item.homeworkTitle.substring(0, 20)}</CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <CustomText color="grey">{homeworkLanguage.HOMEWORK_DESCRIPTION}</CustomText>
          <CustomText color="grey">{item.description.substring(0, 20)}</CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <CustomText color="grey">{homeworkLanguage.HOMEWORK_TYPE}</CustomText>
          <CustomText color="grey">{item.homeWorkType.substring(0, 20)}</CustomText>
        </ListItemContainer>
        <ListItemButtonContainer>
          <IconButton
            icon={faTrash}
            onPress={() => {
              AlertDialog.showModal({
                title: t('WARNING'),
                message: t(homeworkLanguage.HOMEWORK_DELETE),
                onConfirm() {
                  deleteHomework(item.id);
                  homeworkRepo.deleteHomework(item.id);
                  AlertDialog.dismiss();
                },
                onCancel() { },
              });
            }}></IconButton>
          <IconButton
            icon={faPen}
            onPress={() => {
              setSelectedHomework(item);
              updateHomeworkBottomSheetRef.current?.open()
            }}></IconButton>
        </ListItemButtonContainer>
      </ListItem>
    );
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
      {Platform.OS === 'android' ? <AndroidContaier search={search} setSearch={setSearch} /> : <IosContainer />}
      <Loading loading={loading}>
        <HomeWorksContainer>
          <ListContainer>
            <CustomFlatList
              notFoundText={t('CLASS_NOT_FOUND')}
              filter={(entity: Homework) => {
                return entity.homeworkTitle.toLowerCase().includes(search.toLowerCase());
              }}
              data={homeworks}
              renderItem={RenderItem}
            />
          </ListContainer>
        </HomeWorksContainer>
        <ButtonContainer>
          <Button
            borderRadius={10}
            onPress={() => addHomeworkBottomSheetRef.current?.open()}
            text={t(homeworkLanguage.HOMEWORK_ADD)}></Button>
        </ButtonContainer>
        <CustomBottomSheet ref={filterBottomSheetRef} snapPoints={getSnapPoints()}>
          <FilteredHomwork />
        </CustomBottomSheet>
        <CustomBottomSheet
          ref={addHomeworkBottomSheetRef}
          snapPoints={getSnapPoints()}>
          <AddHomeWorkContent />
        </CustomBottomSheet>
        <CustomBottomSheet
          ref={updateHomeworkBottomSheetRef}
          snapPoints={getSnapPoints()}>
          <UpdateHomeWorkContent />
        </CustomBottomSheet>
      </Loading>
    </Container>
  );
}
const AndroidContaier = ({ search, setSearch }: any) => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'));
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
const ListContainer = styled(View)`
  flex: 1;
  padding: 10px;
`;

const ListItem = styled(TouchableOpacity)`
  background-color: #fff;
  padding: 15px;
  margin-horizontal: 2px;
  border-radius: 8px;
  flex-direction: column;
  margin-bottom: 10px;
`;

const ListItemContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ListItemButtonContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
`;
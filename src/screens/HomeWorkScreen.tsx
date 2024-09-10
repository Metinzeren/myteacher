import { View, Platform, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  LocaleConfig,
} from 'react-native-calendars';
import {
  faFilter,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Container from '../components/Container/Container';
import CustomBottomSheet, {
  BottomSheetRef,
} from '../components/CustomBottomSheet/CustomBottomSheet';
import CustomText from '../components/Text/Text';
import styled from 'styled-components';
import Button from '../components/Button/Button';
import { useTranslation } from 'react-i18next';
import { getResourceByKey } from '../lang/i18n';
import AddHomeWorkContent from '../BottomSheetContents/AddHomeWorkContent';
import { useHomeworks } from '../context/HomeworkContext';
import HomeworkRepository from '../repositories/HomeworkRepository';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import Loading from '../components/Loading/Loading';
import CustomFlatList from '../components/Flatlist/CustomFlatList';
import Homework from '../models/Homework';
import IconButton from '../components/IconButton/IconButton';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import UpdateHomeWorkContent from '../BottomSheetContents/UpdateHomeWorkContent';
import FilteredHomwork from '../BottomSheetContents/FilteredHomework';
import i18next from 'i18next';
import withLocalStorage from '../hoc/withLocalStorage';
import AndroidHeader from '../sections/HomeWork/AndroidHeader';
import IosHeader from '../sections/HomeWork/IosHeader';
LocaleConfig.locales.tr = {
  monthNames: [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ],
  monthNamesShort: [
    'Oca',
    'Şub',
    'Mar',
    'Nis',
    'May',
    'Haz',
    'Tem',
    'Ağu',
    'Eyl',
    'Eki',
    'Kas',
    'Ara',
  ],
  dayNames: [
    'Pazar',
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
  ],
  dayNamesShort: ['Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'],
};
LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};
const currentLanguage = i18next.language;
LocaleConfig.defaultLocale = currentLanguage || 'tr';
type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'> & {
  storedValue: any;
};

const CalendarScreen: React.FC<Props> = ({ navigation, storedValue }) => {
  const filterBottomSheetRef = useRef<BottomSheetRef>(null);
  const { setHomeworks, getHomeWorks, deleteHomework, setSelectedHomework } =
    useHomeworks();
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
    navigation.addListener('focus', () => {
      loadHomeworks();
    });
  }, []);

  const loadHomeworks = () => {
    setLoading(true);
    homeworkRepo
      .getAllHomeworks()
      .then(res => {
        setHomeworks(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        onPress={() => { }}
        key={index}>
        <ListItemContainer>
          <CustomText color="grey">
            {homeworkLanguage.HOMEWORK_TITLE}
          </CustomText>
          <CustomText color="grey">
            {item.homeworkTitle.substring(0, 20)}
          </CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <CustomText color="grey">
            {homeworkLanguage.HOMEWORK_DESCRIPTION}
          </CustomText>
          <CustomText color="grey">
            {item.description.substring(0, 20)}
          </CustomText>
        </ListItemContainer>
        <ListItemContainer>
          <CustomText color="grey">{homeworkLanguage.HOMEWORK_TYPE}</CustomText>
          <CustomText color="grey">
            {item.homeWorkType.substring(0, 20)}
          </CustomText>
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
              updateHomeworkBottomSheetRef.current?.open();
            }}></IconButton>
        </ListItemButtonContainer>
      </ListItem>
    );
  };

  return (
    <Container
      goBackShow
      header
      title={t(homeworkLanguage.HOMEWORK_CALENDAR)}
      extraIcon={faFilter}
      extraIconPress={() => {
        filterBottomSheetRef.current?.open();
      }}>
      {Platform.OS === 'android' ? (
        <AndroidHeader search={search} setSearch={setSearch} />
      ) : (
        <IosHeader search={search} setSearch={setSearch} />
      )}
      <Loading loading={loading}>
        <HomeWorksContainer>
          <ListContainer>
            <CustomFlatList
              notFoundText={t(homeworkLanguage.HOMEWORK_NOT_FOUND)}
              filter={(entity: Homework) => {
                return entity.homeworkTitle
                  .toLowerCase()
                  .includes(search.toLowerCase());
              }}
              data={getHomeWorks()}
              renderItem={RenderItem}
            />
          </ListContainer>
        </HomeWorksContainer>
        {storedValue?.userCollection?.role === 'teacher' && (
          <ButtonContainer>
            <Button
              borderRadius={10}
              onPress={() => addHomeworkBottomSheetRef.current?.open()}
              text={t(homeworkLanguage.HOMEWORK_ADD)}></Button>
          </ButtonContainer>
        )}

        <CustomBottomSheet
          ref={filterBottomSheetRef}
          snapPoints={getSnapPoints()}>
          <FilteredHomwork
            onClose={() => {
              filterBottomSheetRef.current?.close();
            }}
          />
        </CustomBottomSheet>
        <CustomBottomSheet
          ref={addHomeworkBottomSheetRef}
          snapPoints={getSnapPoints()}>
          <AddHomeWorkContent
            onClose={() => {
              addHomeworkBottomSheetRef.current?.close();
            }}
          />
        </CustomBottomSheet>
        <CustomBottomSheet
          ref={updateHomeworkBottomSheetRef}
          snapPoints={getSnapPoints()}>
          <UpdateHomeWorkContent />
        </CustomBottomSheet>
      </Loading>
    </Container>
  );
};

export default withLocalStorage(CalendarScreen, 'AUTH_USER');

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

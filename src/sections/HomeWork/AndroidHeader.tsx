import {View, Text, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import useThemeColors from '../../constant/useColor';
import dayjs from 'dayjs';
import {CalendarProvider, WeekCalendar} from 'react-native-calendars';
import Input from '../../components/Input/Input';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

const AndroidHeader = ({search, setSearch}: any) => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'));
  const colors = useThemeColors();

  // useEffect(() => {
  //   if (currentLanguage) {
  //     LocaleConfig.defaultLocale = currentLanguage;
  //     console.log(LocaleConfig.defaultLocale);

  //   }
  // }, [currentLanguage]);
  // console.log(LocaleConfig.defaultLocale);
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
      <View style={{marginTop: 10, marginBottom: 7, marginHorizontal: 10}}>
        <Input
          id="search"
          enableFocusBorder={false}
          inputSize="md"
          style={{backgroundColor: '#fff'}}
          icon={faSearch}
          placeholder="Ödev Ara"
          onChangeText={text => setSearch(text)}
          value={search}
        />
      </View>
    </SafeAreaView>
  );
};
export default AndroidHeader;

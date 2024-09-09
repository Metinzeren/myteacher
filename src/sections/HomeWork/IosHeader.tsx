import {View, Text, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import dayjs from 'dayjs';
import useThemeColors from '../../constant/useColor';
import {CalendarProvider, WeekCalendar} from 'react-native-calendars';
import Input from '../../components/Input/Input';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

const IosHeader = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'));
  const colors = useThemeColors();
  return (
    <SafeAreaView style={{marginBottom: 140}}>
      <CalendarProvider date={selectedDay}>
        <View
          style={{
            height: 140,
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
          <View style={{marginHorizontal: 10}}>
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
        </View>
      </CalendarProvider>
    </SafeAreaView>
  );
};
export default IosHeader;

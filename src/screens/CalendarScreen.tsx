import { View, Text, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import Input from '../components/Input/Input';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import Container from '../components/Container/Container';
import useThemeColors from '../constant/useColor';
import CustomBottomSheet, { BottomSheetRef } from '../components/CustomBottomSheet/CustomBottomSheet';
import CustomText from '../components/Text/Text';

export default function CalendarScreen() {
  const filterBottomSheetRef = React.useRef<BottomSheetRef>(null);
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
      <CustomBottomSheet ref={filterBottomSheetRef} snapPoints={["50%"]}>
        <CustomText>
          Buraya öğrencinin ödevlerini listeleyeceğimiz bir component gelecek
        </CustomText>
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

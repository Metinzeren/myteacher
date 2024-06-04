import { View, Text, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import Input from '../components/Input/Input';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import Container from '../components/Container/Container';

export default function CalendarScreen() {
    const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'));
    const [search, setSearch] = useState('')

    const AndroidContaier = ()=>{
        return(
            <SafeAreaView
            style={{
                height:140,
                backgroundColor: '#E78577',
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
                    enableFocusBorder={false}
                    inputSize="md"
                    style={{ backgroundColor: '#fff' }}
                    icon={faSearch}
                    placeholder="Ürün Ara"
                    onChangeText={text => setSearch(text)}
                    value={search}
                />
            </View>
        </SafeAreaView>
        )

    }
    const IosContainer = () =>{
       return(
        <Container goBackShow header title="Ödev Takvimi">
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
                <View style={{marginHorizontal: 10}}>
                  <Input
                    id="search"
                    enableFocusBorder={false}
                    inputSize="md"
                    style={{backgroundColor: '#fff'}}
                    icon={faSearch}
                    placeholder="Ürün Ara"
                    onChangeText={text => setSearch(text)}
                    value={search}
                  />
                </View>
              </View>
            </CalendarProvider>
          </SafeAreaView>
        </View>
      </Container>
       )
    }

    return (<Container goBackShow header title='Ödev Takvimi'>
       {
        Platform.OS === "android" ? <AndroidContaier/> : <IosContainer/>
       }
    </Container>

    )
}
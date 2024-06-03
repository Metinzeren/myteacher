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
    return (<Container goBackShow header title='Ödev Takvimi'>
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
    </Container>

    )
}
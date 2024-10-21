import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Container from '../components/Container/Container'
import Button from '../components/Button/Button'
import styled from 'styled-components'
import Loading from '../components/Loading/Loading'
import { database } from '../firebase/config'
import { onValue, ref } from 'firebase/database'
import CustomFlatList from '../components/Flatlist/CustomFlatList'
import CustomText from '../components/Text/Text'
import CustomBottomSheet, { BottomSheetRef } from '../components/CustomBottomSheet/CustomBottomSheet'
import CreateGameRoom from '../BottomSheetContents/CreateGameRoom'
import Game from '../models/Game'

export default function GameRoomScreen() {
    const [rooms, setRooms] = useState<Game[]>([])
    const addRoom = useRef<BottomSheetRef>(null);
    const [loading, setLoading] = useState(false);
    const query = ref(database, "rooms");
    const getSnapPoints = () => {
        return ['50%'];
    };
    useEffect(() => {
        setLoading(true);
        return onValue(query, (snapshot) => {
            const data = snapshot.val();

            if (snapshot.exists()) {
                const activeRooms: any[] = [];
                Object.values(data).forEach((roomSet: any) => {
                    Object.values(roomSet.rooms).forEach((room: any) => {
                        if (room.isGameActive) {
                            activeRooms.push(room);
                        }
                    });
                });
                setRooms(activeRooms);
            }
            setLoading(false);
        });
    }, []);

    const RenderItem = ({ item, index }: { item: any, index: any }) => {

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
                key={index}>
                <ListItemContainer>
                    <CustomText color="grey">Oyun adı</CustomText>
                    <CustomText color="grey">
                        {item ? item.roomName : "Oyuncu bulunamadı"}
                    </CustomText>
                </ListItemContainer>
                <ListItemContainer>
                    <TouchableOpacity

                    >
                        <CustomText color="darkBlue">Oynamak için dokun</CustomText>
                    </TouchableOpacity>
                </ListItemContainer>
            </ListItem>
        );
    };

    return (
        <Container header goBackShow title="Oyun">
            <Loading loading={loading}>

                <ListContainer>
                    <CustomFlatList
                        notFoundText="Oda bulunamadı"

                        data={rooms}
                        renderItem={RenderItem}
                    />
                </ListContainer>

                <ButtonContainer>
                    <Button
                        borderRadius={10}
                        onPress={() => {
                            addRoom.current?.open();
                        }}
                        text="Oyun Oluştur"
                    >
                        Oyun Oluştur
                    </Button>
                </ButtonContainer>
                <CustomBottomSheet
                    ref={addRoom}
                    snapPoints={getSnapPoints()}>
                    <CreateGameRoom
                        onClose={() => { addRoom.current?.close() }}

                    />
                </CustomBottomSheet>
            </Loading>
        </Container>
    )
}
const ListContainer = styled(View)`
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


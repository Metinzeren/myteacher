import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import Container from '../components/Container/Container';
import Game from '../models/Game';
import { onValue, ref } from 'firebase/database';
import { database } from '../firebase/config';
import styled from 'styled-components';
import LottieView from 'lottie-react-native';
import CustomText from '../components/Text/Text';

export default function LobbyScreen(
    props: NativeStackScreenProps<RootStackParamList, 'LobbyScreen'>
) {
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState<Game | null>(null);
    const roomId = props.route.params.roomId;

    useEffect(() => {
        setLoading(true);
        const roomRef = ref(database, `rooms/${roomId}`);

        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setRoom(data);
            } else {
                console.error("Oda bulunamadı");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <Container header goBackShow title='Lobi'>
                <Text>Yükleniyor...</Text>
            </Container>
        );
    }

    return (
        <Container header goBackShow title='Lobi'>
            <LoadingContainer>
                <LottieView
                    style={{ width: 150, height: 150 }}
                    autoPlay
                    loop
                    source={require('../assets/animations/lottie/game-controller.json')}
                />
                <CustomText fontSizes='h1' color='textLink'>Rakip bekleniyor...</CustomText>
            </LoadingContainer>
            {room ? (
                <LobbyContent>

                    {Object.values(room.players).map((player: any, index) => (
                        <PlayerContainer key={index}>
                            <CustomText fontSizes='body2' color='darkRed'>{player.name}</CustomText>
                            <CustomText fontSizes='description' color='darkBlue'>{player.isReady ? "Hazır" : "Hazır Değil"}</CustomText>
                        </PlayerContainer>
                    ))}
                </LobbyContent>
            ) : (
                <Text>Oda bulunamadı</Text>
            )}
        </Container>
    );
}
const LoadingContainer = styled(View)`
    align-items: center;
    flex: .1;
`;

const LobbyContent = styled(View)`
    flex:.5;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
`;

const PlayerContainer = styled(View)`
    margin-top: 10px;
    align-items: center;
    flex-direction: column;
`;
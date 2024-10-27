import { Alert, View } from 'react-native'
import React, { useState } from 'react'
import Container from '../components/Container/Container'
import Input from '../components/Input/Input'
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import useUser from '../hooks/useUser';
import styled from 'styled-components';
import Button from '../components/Button/Button';
import { database } from '../firebase/config';  // Firebase bağlantısı
import { ref, push, set } from 'firebase/database'; // Realtime DB için push ve set fonksiyonları
import AlertDialog from '../components/AlertDialog/AlertDialog';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export default function CreateGameRoom({ onClose }: { onClose: () => void }) {
    const [roomName, setRoomName] = useState('');
    const { user } = useUser() as any;
    const { t } = useTranslation();
    const handleChange = (key: string, value: string) => {
        setRoomName(value);
    }
    const navigation = useNavigation<any>();
    const handleAddRoom = () => {
        if (!roomName) {
            AlertDialog.showModal({
                title: t('ERROR'),
                message: "Lütfen oda ismi giriniz.",
                onConfirm() {
                    onClose();
                },
                disableCloseOnTouchOutside: true,
            });
            return;
        }

        const roomRef = ref(database, 'rooms');

        const newRoomRef = push(roomRef);

        set(newRoomRef, {
            roomName: roomName,
            isGameActive: true,
            round: 1,
            roomId: newRoomRef.key as string,
            players: {
                player1: {
                    id: user.id,
                    name: user.firstName,
                    score: 0,
                    isReady: false
                },
                player2: {
                    id: "",
                    name: "",
                    score: 0,
                    isReady: false
                }
            },
            currentQuestion: {
                questionText: "What is the translation of 'Hello'?",
                choices: ["Merhaba", "Hoşça kal", "Teşekkürler"],
                correctAnswer: "Merhaba"
            }
        }).then(() => {
            AlertDialog.showModal({
                title: t('SUCCESS'),
                message: t('HOMEWORK_ADD_SUCCESS'),
                onConfirm() {
                    onClose();
                    navigation.navigate('LobbyScreen', { roomId: newRoomRef.key as string });
                },
                disableCloseOnTouchOutside: true,
            });
            setRoomName('');
        }).catch(error => {
            console.error("Oda oluşturulurken bir hata oluştu:", error);
        });
    };

    return (
        <Container type='container' p={10}>
            <InputContainer>
                <Input
                    id="roomName"
                    required
                    placeholder="Oyun adı"
                    icon={faGamepad}
                    value={roomName}
                    onChangeText={e => handleChange('roomName', e)}
                />
            </InputContainer>

            <ButtonContainer>
                <Button
                    borderRadius={10}
                    onPress={handleAddRoom}
                    text="Oyun Oluştur"
                >
                    Oyun Oluştur
                </Button>
            </ButtonContainer>
        </Container>
    )
}

const InputContainer = styled(View)`
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

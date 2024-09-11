import React, { useState } from 'react'
import Container from '../components/Container/Container'
import FormContainer from '../components/FormContainer'
import Input from '../components/Input/Input'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Button from '../components/Button/Button'
import { View } from 'react-native'
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import AlertDialog from '../components/AlertDialog/AlertDialog'


export default function ChangePasswordContent() {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const [registerDto, setRegisterDto] = useState({
        password: '',
        confirmPassword: "",
        currentPassword: "",
    });

    const handleChange = (key: keyof typeof registerDto, value: string) => {
        setRegisterDto({
            ...registerDto,
            [key]: value,
        });
    };

    const reauthenticateUser = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user && user.email) {
            const credential = EmailAuthProvider.credential(user.email, registerDto.currentPassword);
            try {
                await reauthenticateWithCredential(user, credential);
                return true;
            } catch (error: any) {
                AlertDialog.showModal({
                    title: t("ERROR"),
                    message: t("WRONG_CURRENT_PASSWORD"),
                    onConfirm() {
                    },
                });
                return false;
            }
        }
        return false;
    };

    const handleChangePassword = async () => {
        if (registerDto.password !== registerDto.confirmPassword) {
            AlertDialog.showModal({
                title: t("ERROR"),
                message: t("PASSWORDS_DO_NOT_MATCH"),
                onConfirm() {
                },
            });
            return;
        }

        const isReauthenticated = await reauthenticateUser();
        if (!isReauthenticated) return;

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            try {
                await updatePassword(user, registerDto.password);
                handleLogout();
                AlertDialog.showModal({
                    title: t("SUCCESS"),
                    message: t("PASSWORD_CHANGE_SUCCESS"),
                    onConfirm() {

                    },
                });
            } catch (error: any) {
                AlertDialog.showModal({
                    title: t("ERROR"),
                    message: t("PASSWORD_CHANGE_FAILED"),
                    onConfirm() {
                    },
                });
            }
        } else {
            AlertDialog.showModal({
                title: t("ERROR"),
                message: t("USER_NOT_FOUND"),
                onConfirm() {
                },
            });
        }
    };

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <Container p={10} type='container'>
                <FormContainer style={{ gap: 10 }}>
                    <Input
                        required
                        id="currentPassword"
                        placeholder={t('CURRENT_PASSWORD')}
                        icon={faLock}
                        secureTextEntry={true}
                        value={registerDto.currentPassword}
                        onChangeText={e => handleChange('currentPassword', e)}
                    />
                    <Input
                        required
                        id="password"
                        placeholder={t('PASSWORD')}
                        icon={faLock}
                        secureTextEntry={true}
                        value={registerDto.password}
                        onChangeText={e => handleChange('password', e)}
                    />
                    <Input
                        required
                        id="confirmPassword"
                        placeholder={t('CONFIRM_PASSWORD')}
                        icon={faLock}
                        secureTextEntry={true}
                        value={registerDto.confirmPassword}
                        onChangeText={e => handleChange('confirmPassword', e)}
                    />
                </FormContainer>
            </Container>
            <ButtonContainer>
                <Button
                    disabled={!registerDto.password || !registerDto.confirmPassword || !registerDto.currentPassword}
                    borderRadius={10}
                    text={t("SAVE")}
                    onPress={handleChangePassword}
                />
            </ButtonContainer>
        </>
    );
}

const ButtonContainer = styled(View)`
  flex: 0.2;
  max-height: 50px;
  margin-bottom: 20px;
  justify-content: center;
  padding-horizontal: 10px;
`;

import { View, Text, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Container from '../components/Container/Container'
import { getResourceByKey } from '../lang/i18n'
import FormContainer, { FormContainerRef } from 'react-native-form-container'
import Input from '../components/Input/Input'
import { faEnvelope, faLock, faPhone, faUser } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import Button from '../components/Button/Button'
import styled from 'styled-components'
import useUser from '../hooks/useUser'
import Loading from '../components/Loading/Loading'
import UserRepository from '../repositories/UserRepository'
import User from '../models/User'
import { setLocalStorage } from '../utils/AsyncStorageUtils'

export default function ProfileScreen() {
    const profileLanguage = getResourceByKey('profile')
    const { t } = useTranslation();
    const userRepo = UserRepository.getInstance();
    const [loading, setLoading] = useState(false);
    const { user } = useUser() as any;
    const userId = user?.id || '';


    const [updateDto, setUpdateDto] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        id: "",
        role: "",
    })
    useEffect(() => {
        if (userId) {
            getUser(userId);
        }
    }, [userId]);


    const getUser = async (id: string) => {
        setLoading(true);
        try {
            const user = await userRepo.getUser(id);
            setUpdateDto({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                password: "123456",
                confirmPassword: "123456",
                id: user.id,
                role: user.role
            });
        } catch (error) {
            console.error('Error during getting user:', error);
        } finally {
            setLoading(false);
        }
    }

    const formRef = useRef<FormContainerRef>(null);
    const handleChange = (key: keyof typeof updateDto, value: string) => {
        setUpdateDto({
            ...updateDto,
            [key]: value,
        });
    };


    const handleUpdateProfile = async () => {
        let isEmpty = formRef.current?.validate(getResourceByKey('profileForm'));
        if (isEmpty) {
            Keyboard.dismiss();
            setLoading(true);
            try {
                await userRepo.updateUser(updateDto as User);
            } catch (error) {
                console.error('Error during updating profile:', error);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <Container header goBackShow title={profileLanguage.PROFILE}>
            <Loading loading={loading}>
                <Container type='container' p={10}>
                    <FormContainer
                        style={{ gap: 10 }} formContainerRef={formRef}
                    >
                        <Input
                            placeholder={t("FIRST_NAME")}
                            required
                            id="firstName"
                            icon={faUser}
                            value={updateDto.firstName}
                            onChangeText={e => handleChange('firstName', e)}
                        />
                        <Input
                            id="lastName"
                            required
                            placeholder={t("LAST_NAME")}
                            icon={faUser}
                            value={updateDto.lastName}
                            onChangeText={e => handleChange('lastName', e)}
                        />
                        <Input
                            required
                            id="phone"
                            placeholder={t('PHONE')}
                            icon={faPhone}
                            value={updateDto.phone}
                            onChangeText={e => handleChange('phone', e)}
                        />
                        <Input
                            required
                            id="email"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder={t('EMAIL')}
                            icon={faEnvelope}
                            value={updateDto.email}
                            onChangeText={e => handleChange('email', e)}
                        />
                        <Input
                            required
                            id="password"
                            placeholder={t('PASSWORD')}
                            icon={faLock}
                            secureTextEntry={true}
                            value={updateDto.password}
                            onChangeText={e => handleChange('password', e)}
                        />
                        <Input
                            required
                            id="confirmPassword"
                            placeholder={t('CONFIRM_PASSWORD')}
                            icon={faLock}
                            secureTextEntry={true}
                            value={updateDto.confirmPassword}
                            onChangeText={e => handleChange('confirmPassword', e)}
                        />
                    </FormContainer>

                </Container>
                <ButtonContainer>
                    <Button
                        borderRadius={10}
                        text={t("SAVE")}
                        onPress={() => {
                            handleUpdateProfile()
                        }}
                    ></Button>
                </ButtonContainer>
            </Loading>
        </Container>
    )
}

const ButtonContainer = styled(View)`
  flex: 0.2;
  max-height: 50px;
  margin-bottom: 20px;
  justify-content: center;
  padding-horizontal: 10px;
`;
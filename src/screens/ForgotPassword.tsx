import React from 'react'
import { View } from 'react-native'
import CustomText from '../components/Text/Text'
import Container from '../components/Container/Container'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import styled from 'styled-components'
import Input from '../components/Input/Input'
import Button from '../components/Button/Button'
import AlertDialog from '../components/AlertDialog/AlertDialog'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

export default function ForgotPassword() {
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
        <Container>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <IconBack
                    icon={faArrowLeft}
                    size={25}
                    color="#000"
                />
            </TouchableOpacity>

            <FormContainer>
                <CustomText color={'textBlack'} title center>
                    Şifre yenilemek için lütfen kayıtlı e-posta adresini girin
                </CustomText>
                <Input placeholder="E-mail" icon={faEnvelope} />
                <Button
                    onPress={() => {
                        AlertDialog.showModal({
                            title: 'Başlık',
                            message: 'Mesaj',
                        });
                    }}
                    borderRadius={10}
                    text={t('Gönder')}
                />
            </FormContainer>
        </Container>
    )
}
const IconBack = styled(FontAwesomeIcon)`
    margin:10px;
    
`
const FormContainer = styled(View)`
  margin: 60px 20px 20px 20px;
  gap: 20px;
`;

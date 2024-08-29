import React, { useState } from 'react';
import { View } from 'react-native';
import CustomText from '../components/Text/Text';
import Container from '../components/Container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import { useTranslation } from 'react-i18next';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import ValidationHelper from '../components/Utils/ValidationHelper';

export default function ForgotPassword(props: any) {
  const { t } = useTranslation();
  const firebaseTranslation = useTranslation('firebase').t;
  const [email, setEmail] = useState('');
  return (
    <Container>
      <TouchableOpacity
        hitSlop={15}
        onPress={() => props.navigation.navigate('LoginScreen')}>
        <IconBack icon={faArrowLeft} size={25} color="#000" />
      </TouchableOpacity>

      <FormContainer>
        <CustomText fontSizes='h2' color="purple" center>
          {t('FORGOT_PASSWORD')}
        </CustomText>
        <CustomText color={'grey'} center>
          {t('FORGOT_PASSWORD_DESCRIPTION')}
        </CustomText>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={e => setEmail(e)}
          value={email}
          placeholder="E-mail"
          icon={faEnvelope}
        />
        <Button
          disabled={ValidationHelper.regexEmail(email) ? false : true}
          onPress={() => {

            sendPasswordResetEmail(auth, email)
              .then(res => {
                AlertDialog.showModal({
                  title: 'Success',
                  message: 'Email sent',
                });
              })
              .catch(er => {
                const errorMessage = firebaseTranslation(`${er.code}`);
                AlertDialog.showModal({
                  title: t('ERROR'),
                  message: errorMessage,
                });
              });
          }}
          borderRadius={10}
          text={t('SEND')}
        />
      </FormContainer>
    </Container>
  );
}
const IconBack = styled(FontAwesomeIcon)`
  margin: 10px;
`;
const FormContainer = styled(View)`
  margin: 20px;
  gap: 20px;
`;

import React, {useState} from 'react';
import {View} from 'react-native';
import CustomText from '../components/Text/Text';
import Container from '../components/Container/Container';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faEnvelope,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import {sendPasswordResetEmail} from 'firebase/auth';
import {auth} from '../firebase/config';

export default function ForgotPassword(props: any) {
  const {t} = useTranslation();
  const [email, setEmail] = useState('');
  return (
    <Container>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('LoginScreen')}>
        <IconBack icon={faArrowLeft} size={25} color="#000" />
      </TouchableOpacity>

      <FormContainer>
        <CustomText color={'textBlack'} title center>
          Şifre yenilemek için lütfen kayıtlı e-posta adresini girin
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
          onPress={() => {
            sendPasswordResetEmail(auth, email)
              .then(res => {
                console.log(res);
                AlertDialog.showModal({
                  title: 'Success',
                  message: 'Email sent',
                });
              })
              .catch(er => {
                AlertDialog.showModal({
                  title: er.code,
                  message: er.message,
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
  margin: 60px 20px 20px 20px;
  gap: 20px;
`;

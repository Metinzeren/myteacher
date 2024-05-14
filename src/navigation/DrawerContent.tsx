import {View, Text, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import CustomText from '../components/Text/Text';
import Button from '../components/Button/Button';
import {signOut} from 'firebase/auth';
import {auth} from '../firebase/config';

export default function DrawerContent(props: DrawerContentComponentProps) {
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView>
      <View>
        <Button
          loading={loading}
          text="Çıkış Yap"
          onPress={() => {
            setLoading(true);
            signOut(auth)
              .then(() => {
                props.navigation.navigate('LoginScreen');
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

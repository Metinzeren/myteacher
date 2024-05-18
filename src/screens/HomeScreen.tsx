import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Container from '../components/Container/Container';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAngleRight,
  faBook,
  faCalendar,
  faMoneyBillAlt,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import GroupSvgIcon from '../assets/icons/GroupSvgIcon';
import BookSvgIcon from '../assets/icons/BookSvgIcon';
import ScheduleSvgIcon from '../assets/icons/ScheduleSvgIcon';
import useThemeColors from '../constant/useColor';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {RootStackParamList} from '../types/Navigation';

const HomeScreen = (
  props: NativeStackScreenProps<RootStackParamList, 'HomeScreen'>,
) => {
  const homeMenu = [
    {
      name: 'Öğrenciler',
      icon: <BookSvgIcon height={35} width={50} />,
      link: 'StudentsScreen',
    },
    {
      name: 'Ödevler',
      icon: <BookSvgIcon height={35} width={50} />,
      link: 'StudentsScreen',
    },
    {
      name: 'Ödev Takvimi',
      icon: <ScheduleSvgIcon height={35} width={50} />,
      link: 'StudentsScreen',
    },
    {
      name: 'Veliler',
      icon: <GroupSvgIcon height={35} width={50} />,
      link: 'StudentsScreen',
    },
  ];

  return (
    <Container title="Anasayfa" header showNotification>
      <HomeContainer>
        {homeMenu.map((item, index) => (
          <TouchableOpacity
            onPress={() => props.navigation.navigate(item?.link as any)}
            key={index}>
            <MenuItem>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item?.icon}
                <CustomText fontSizes="h5" color="primaryText" center>
                  {item.name}
                </CustomText>
              </View>
              <MenuItemButton>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  color={useThemeColors().iconColor}
                  size={20}
                />
              </MenuItemButton>
            </MenuItem>
          </TouchableOpacity>
        ))}
      </HomeContainer>
    </Container>
  );
};
const HomeContainer = styled(View)``;
const MenuItem = styled(View)`
  flex-direction: row;
  padding-vertical: 10px;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-horizontal: 10px;
  margin-top: 10px;
  padding-right: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-color: #ddd;
`;
const MenuItemButton = styled(TouchableOpacity)``;

export default HomeScreen;

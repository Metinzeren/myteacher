import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Container from '../components/Container/Container';
import styled from 'styled-components';
import CustomText from '../components/Text/Text';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBook, faCalendar, faMoneyBillAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

const HomeScreen = (props: any) => {
  const homeMenu = [
    {
      name: "Dersler",
      icon: faBook,
      link: "SubjectsScreen"
    },
    {
      name: "Reservations",
      icon: faCalendar,
      link: "SubjectsScreen"
    },
    {
      name: "Payment",
      icon: faMoneyBillAlt,
      link: "SubjectsScreen"
    },
    {
      name: "Groups",
      icon: faUsers,
      link: "SubjectsScreen"
    },
    {
      name: "Groups",
      icon: faUsers,
      link: "SubjectsScreen"
    },
  ];

  return (
    <Container title='anasayfa' header>
      <HomeContainer>

        {homeMenu.map((item, index,) => (
          <TouchableOpacity onPress={() => props.navigation.navigate(item.link)} key={index}>
            <MenuItem>
              <FontAwesomeIcon
                icon={item.icon}
                size={70}
                color='orange'
              />
              <View style={{ marginTop: 10 }}>
                <CustomText color="textBlack" center >{item.name}</CustomText>
              </View>
            </MenuItem>
          </TouchableOpacity>

        ))}
      </HomeContainer>

    </Container>
  );
};
const HomeContainer = styled(View)`
  width:100%;
  flex-direction:row;
  flex-wrap:wrap;
  align-items: center;
  justify-content: center;
`
const MenuItem = styled(View)`
  width: 160px;
  height: 160px;
  background-color: #fff;
  elevation: 4;
  margin:10px;
  align-items: center;
  justify-content: center;
  border-radius:10px;
`

export default HomeScreen;

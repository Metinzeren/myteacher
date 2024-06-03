import {View, Text, SafeAreaView, TouchableOpacity, Platform} from 'react-native';

import styled from 'styled-components';
import useThemeColors from '../../constant/useColor';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faBars} from '@fortawesome/free-solid-svg-icons';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {faBell} from '@fortawesome/free-regular-svg-icons';
import CustomText from '../Text/Text';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

export interface HeaderProps {
  title?: string;
  showNotification?: boolean;
  goBackShow?: boolean;
  onShowNotification?: () => void;
  extraIcon?: IconProp;
  extraIconPress?: () => void;
}
export default function Header({
  title,
  showNotification = false,
  goBackShow = false,
  onShowNotification,
  extraIcon,
  extraIconPress,
}: HeaderProps) {
  const navigation = useNavigation();
  const colors = useThemeColors();
  return (
    <HeaderContainer
      theme={{
        background: colors.primary,
      }}>
      <Container>
        {goBackShow && (
          <IconLeft
            hitSlop={15}
            onPress={() => {
              if (goBackShow) {
                navigation.goBack();
              } else {
                navigation.dispatch(DrawerActions.openDrawer());
              }
            }}>
            <FontAwesomeIcon icon={faAngleLeft} color={'#fff'} size={25} />
          </IconLeft>
        )}
        {title?.length != 0 && (
          <TitleContainer>
            <HeaderTitle adjustsFontSizeToFit={true}>{title}</HeaderTitle>
          </TitleContainer>
        )}
        <ExtraContainer>
          {showNotification && (
            <IconRight
              onPress={() => {
                if (onShowNotification) {
                  onShowNotification();
                } else {
                }
              }}
              hitSlop={15}>
              <FontAwesomeIcon icon={faBell} color={'#fff'} size={20} />
            </IconRight>
          )}
          {extraIcon && (
            <IconRight
              onPress={() => {
                if (extraIconPress) {
                  extraIconPress();
                }
              }}
              hitSlop={15}>
              <FontAwesomeIcon icon={extraIcon} color={'#fff'} size={20} />
            </IconRight>
          )}
        </ExtraContainer>
      </Container>
    </HeaderContainer>
  );
}
const HeaderContainer = styled(SafeAreaView)`
  background-color: ${props => props.theme.background};
  height:${Platform.OS === 'android' ? 55 : 'auto'};
  justify-content:center;
`;
const Container = styled(View)`
  justify-content: center;
  align-items: center;
  padding-bottom: 40px;
  top: 0;
`;
const IconLeft = styled(TouchableOpacity)`
  position: absolute;
  left: 20px;
`;
const IconRight = styled(TouchableOpacity)``;
const TitleContainer = styled(View)`
  position: absolute;
`;
const HeaderTitle = styled(CustomText)`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
`;
const ExtraContainer = styled(View)`
  position: absolute;
  right: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
`;
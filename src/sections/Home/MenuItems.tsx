import { View, TouchableOpacity } from 'react-native';
import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { homeMenu } from '../../data/data';
import { getResourceByKey } from '../../lang/i18n';
import { useNavigation } from '@react-navigation/native';
import CustomFlatList from '../../components/Flatlist/CustomFlatList';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import { signOut } from 'firebase/auth';
import CustomText from '../../components/Text/Text';
import { SvgXml } from 'react-native-svg';
import { auth } from '../../firebase/config';
import withLocalStorage from '../../hoc/withLocalStorage';

const MenuItems = ({ storedValue }: { storedValue: any }) => {
  const navigation = useNavigation<any>();
  const menuTranslate = getResourceByKey('menu');
  const MenuItemCard = ({ item, index }: { item: any; index: number }) => {
    let maxItem = homeMenu.length;
    let isEven = maxItem % 2 === 0;
    let isLastItem = index === maxItem - 1;
    return (
      <TouchableOpacity
        style={{
          width: !isEven && !isLastItem ? '50%' : '100%',
        }}
        onPress={() => {
          if (item.link !== '') {
            navigation.navigate(item.link);
          } else {
            handleLogout();
          }
        }}>
        <MenuItem
          theme={{
            rtl: isLastItem && !isEven ? 'row' : 'column',
            justifyContent: isLastItem && !isEven ? 'flex-start' : 'center',
            minHeight: isLastItem && !isEven ? 'auto' : '170px',
          }}>
          <SvgXml height={100} width={140} xml={item.icon} />
          <CustomText fontSizes="body5" color="primaryText" center>
            {item.name}
          </CustomText>
        </MenuItem>
      </TouchableOpacity>
    );
  };
  const handleLogout = () => {
    AlertDialog.showModal({
      title: 'Çıkış Yap',
      message: 'Çıkış yapmak istediğinize emin misiniz?',
      onConfirm() {
        AlertDialog.showSpecialLoading();
        signOut(auth)
          .then(() => {
            navigation.navigate('LoginScreen');
          })
          .finally(() => {
            AlertDialog.hideLoading();
          });
      },
      onCancel() { },
    });
  };

  useCallback(() => {
    return homeMenu.filter((entity: any) =>
      entity?.role?.includes?.(storedValue?.userCollection?.role),
    );
  }, [storedValue]);

  return (
    <NoSearchContainer>
      <HomeBottomContainer>
        <View>
          <CustomFlatList
            numColumns={2}
            notFoundText={menuTranslate.DATA_NOT_FOUND}
            filter={(entity: any) =>
              entity.role.includes(storedValue?.userCollection?.role)
            }
            data={homeMenu}
            renderItem={({ item, index }: { item: any; index: number }) => {
              let translatedName = menuTranslate[item.name];
              return (
                <MenuItemCard
                  index={index}
                  item={{
                    name: translatedName,
                    icon: item.icon,
                    link: item.link,
                  }}
                />
              );
            }}
          />
        </View>
      </HomeBottomContainer>
    </NoSearchContainer>
  );
};

const HomeBottomContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const NoSearchContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  flex-direction: column;
`;
const MenuItem = styled(View)`
  flex-basis: 80%;
  flex-direction: ${props => props.theme.rtl || 'column'};
  margin: 10px;
  min-height: ${props => props.theme.minHeight ?? '170px'};
  gap: 5px;
  padding: 15px;
  background-color: #fff;
  justify-content: ${props => props.theme.justifyContent ?? 'center'};
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 3;
`;
export default memo(withLocalStorage(MenuItems, 'AUTH_USER'));

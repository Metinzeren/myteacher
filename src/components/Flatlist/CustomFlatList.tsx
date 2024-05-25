import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useState} from 'react';
import CustomListProps from './CustomFlatListProps';
import Input from '../Input/Input';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import CustomText from '../Text/Text';

export default function CustomFlatList(props: CustomListProps) {
  const [onRefresh, setOnRefresh] = useState(false);
  const [search, setSearch] = useState('');

  const GetData = () => {
    
    if (props.data) {
      if (props.filter && props.sort) {
        return props.data
          .sort(props.sort)
          .filter((item: any, index: any) =>
            props.filter != undefined
              ? props.filter(item, search, index)
              : item,
          );
      } else {
        if (props.sort) {
          return props.data.sort(props.sort);
        } else if (props.filter) {
          return props.data.filter((item: any, index: any) =>
            props.filter != undefined
              ? props.filter(item, search, index)
              : item,
          );
        } else {
          return props.data;
        }
      }
    } else {
      return [];
    }
  };

  return (
    <>
      {props.isSearchable && (
        <View style={{marginBottom: 10}}>
          <Input
            icon={faSearch}
            placeholder="Ara"
            onChangeText={e => setSearch(e)}
            value={search}
          />
        </View>
      )}
      {GetData() && GetData().length != 0 ? (
        !props.isBottomSheet ? (
          <FlatList
            {...props}
            contentContainerStyle={props?.contentContainerStyle}
            data={GetData() as any}
            keyExtractor={(item, index) => index.toString()}
            scrollEventThrottle={16}
            onEndReachedThreshold={0.5}
            renderItem={props.renderItem}
            refreshControl={
              <RefreshControl
                refreshing={onRefresh}
                onRefresh={() => {
                  setOnRefresh(true);
                  if (props.handleRefresh) {
                    props.handleRefresh();
                  }
                  setOnRefresh(false);
                }}
              />
            }
          />
        ) : null
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: Dimensions.get('window').height,
          }}>
          <CustomText fontSizes="h4" color="textLink">
            {props.notFoundText || 'Veri bulunamadı.'}
          </CustomText>
        </View>
      )}
    </>
  );
}

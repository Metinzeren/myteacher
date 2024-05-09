import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  Platform,
} from 'react-native';
import React from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import useThemeColors from '../../constant/useColor';

interface CheckInputProps extends TouchableOpacityProps {
  checked?: boolean;
  label?: string;
  clickLabel?: () => void;
  clickedLabel?: string;
}
export default function CheckInput(props: CheckInputProps) {
  const colors = useThemeColors();

  const RenderLabel = () => {
    let added = false;
    if (props.clickLabel && props.clickedLabel) {
      let findIndex = FindLabelByIndex();
      let words = props.label?.split(' ');
      return (
        <Label>
          {words
            ?.filter((c, i) => {
              if (findIndex.length === 1 && i === findIndex[0]) {
                return c;
              } else if (
                findIndex.length > 1 &&
                findIndex.includes(i) &&
                i !== findIndex[0]
              ) {
                return false;
              }
              return c;
            })
            .map((item, index) => {
              if (findIndex.includes(index) && !added) {
                added = true;
                return (
                  <TouchableOpacity
                    onPress={props.clickLabel}
                    key={index}
                    style={{backgroundColor: 'transparent'}}>
                    <Label key={index} style={{color: colors.primary}}>
                      {ConvertLabelByIndex() + ' '}
                    </Label>
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity activeOpacity={1} key={index}>
                  <Label>{item} </Label>
                </TouchableOpacity>
              );
            })}
        </Label>
      );
    }
    return <Label>{props.label}</Label>;
  };

  const FindLabelByIndex = () => {
    let wordIndexs: number[] = [];
    props.label?.split(' ').map((item, index) => {
      if (props.clickedLabel?.includes(item)) {
        wordIndexs.push(index);
      }
    });
    return wordIndexs;
  };
  const ConvertLabelByIndex = () => {
    let newWord = '';
    props.label?.split(' ').map((item, index) => {
      if (props.clickedLabel?.includes(item)) {
        if (index === 0) newWord += item;
        else newWord += ' ' + item;
      }
    });
    return newWord;
  };

  return (
    <Container>
      <InputContainer {...props} activeOpacity={0.7}>
        {!props.checked ? (
          <FontAwesomeIcon color={colors.iconColor} size={20} icon={faCheck} />
        ) : null}
      </InputContainer>
      <View style={{marginTop: Platform.OS === 'ios' ? 4 : 0}}>
        <RenderLabel />
      </View>
    </Container>
  );
}
const InputContainer = styled(TouchableOpacity)`
  padding: 15px;
  max-width: 30px;
  max-height: 30px;
  border-radius: 5px;
  background-color: #ebeff3;
  align-items: center;
  justify-content: center;
`;
const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;
const Label = styled(Text)`
  font-size: 13px;
  font-weight: 400;
  color: #444;
`;

import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import CustomText from '../Text/Text';
import useThemeColors from '../../constant/useColor';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';

type AccordionProps = {
  title: string;
  children?: React.ReactNode;
};

const Accordion = ({title, children}: AccordionProps) => {
  const [expanded, setExpanded] = useState(false);
  const colors = useThemeColors();
  return (
    <AccordionContainer
      theme={{
        backgroundColor: colors.primary,
        borderColor: colors.primary,
      }}>
      <TouchableOpacity
        hitSlop={15}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 1,
          paddingBottom: expanded ? 10 : 0,
          borderColor: 'transparent',
        }}
        onPress={() => setExpanded(!expanded)}>
        <CustomText fontSizes="body4" color={'white'}>
          {title}
        </CustomText>
        <FontAwesomeIcon
          color={'white'}
          icon={expanded ? faAngleUp : faAngleDown}
        />
      </TouchableOpacity>
      {expanded && children}
    </AccordionContainer>
  );
};

const AccordionContainer = styled(View)`
  padding: 10px;
  margin-vertical: 10px;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 8px;
  background-color: ${props => props.theme.backgroundColor};
`;

export default Accordion;

import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import CustomText from '../Text/Text';
import useThemeColors from '../../constant/useColor';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

type AccordionProps = {
  title: string;
  children?: React.ReactNode;
};

const Accordion = ({ title, children }: AccordionProps) => {
  const [expanded, setExpanded] = useState(false);
  const colors = useThemeColors();
  return (
    <AccordionContainer
      theme={{
        backgroundColor: expanded ? colors.primary : 'white',
        borderColor: expanded ? colors.primary : 'black',
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 1,
          paddingBottom: expanded ? 10 : 0,
          borderColor: expanded ? colors.primary : 'transparent',
        }}
        onPress={() => setExpanded(!expanded)}>
        <CustomText fontSizes="body4" color={expanded ? "white" : "grey"}>
          {title}
        </CustomText>
        <FontAwesomeIcon
          color={expanded ? "white" : colors.primary}
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

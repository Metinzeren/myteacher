import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styled from 'styled-components';
import CustomText from '../Text/Text';

type AccordionProps = {
    title: string;
    children: React.ReactNode;
};

const Accordion = ({ title, children }: AccordionProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <AccordionContainer>
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <CustomText fontSizes='body4' color='textBlack'>{title}</CustomText>
            </TouchableOpacity>
            {expanded && (
                <CustomText color='primaryText'>
                    {children}
                </CustomText>
            )}
        </AccordionContainer>
    );
};

const AccordionContainer = styled(View)`
    padding:10px;
    margin-vertical:10px;
    border:1px solid #ccc;
    border-radius: 8px;
`

export default Accordion;
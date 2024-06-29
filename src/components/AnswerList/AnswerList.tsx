import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import CustomText from '../Text/Text';
import IconButton from '../IconButton/IconButton';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface AnswerListProps {
    answers: string[];
    onDeleteAnswer: (index: number) => void;
}

const AnswerList = ({ answers, onDeleteAnswer }: AnswerListProps) => {
    return (
        <AnswerListContainer>
            {answers.map((answer, index) => (
                <ContentContainer key={index}>
                    <CustomText color='textLink' fontSizes='body4' >{answer}</CustomText>
                    <IconButton icon={faTrash} onPress={() => onDeleteAnswer(index)} />
                </ContentContainer>
            ))}
        </AnswerListContainer>
    );
};

const AnswerListContainer = styled(View)`
    gap:5px;
    margin-top:10px;
`
const ContentContainer = styled(View)`
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
`


export default AnswerList;

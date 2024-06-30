import React, { useState } from 'react';
import { View } from 'react-native';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styled from 'styled-components';

interface AnswerFormProps {
    onAddAnswer: (answer: string) => void;
    onClose: () => void;
}

const AnswerForm = ({ onAddAnswer, onClose }: AnswerFormProps) => {
    const [answer, setAnswer] = useState('');

    const handleAddAnswer = () => {
        if (answer.trim()) {
            onAddAnswer(answer.trim());
            setAnswer('');
            onClose();
        }
    };

    return (
        <AnswerFormContainer>
            <Input
                id='question'
                placeholder="Cevap"
                value={answer}
                onChangeText={setAnswer}
            />
            <Button text="Ekle" onPress={handleAddAnswer} />
            <Button text="İptal" onPress={onClose} />
        </AnswerFormContainer>
    );
};

const AnswerFormContainer = styled(View)`
    gap:10px;
`


export default AnswerForm;
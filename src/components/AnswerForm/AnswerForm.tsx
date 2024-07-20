import React, { useState } from 'react';
import { View } from 'react-native';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface AnswerFormProps {
    onAddAnswer: (answer: string) => void;
    onClose: () => void;
}

const AnswerForm = ({ onAddAnswer, onClose }: AnswerFormProps) => {
    const [answer, setAnswer] = useState('');
    const { t } = useTranslation();
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
                placeholder={t('ANSWER')}
                value={answer}
                onChangeText={setAnswer}
            />
            <Button text={t("ADD")} onPress={handleAddAnswer} />
            <Button text={t('CANCEL')} onPress={onClose} />
        </AnswerFormContainer>
    );
};

const AnswerFormContainer = styled(View)`
    gap:10px;
`


export default AnswerForm;
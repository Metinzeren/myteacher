import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View } from 'react-native';
import styled from 'styled-components';

export default function FormContainer(props: { children: React.ReactNode }) {
    return (
        <KeyboardAwareScrollView
            extraHeight={100}
            enableOnAndroid={true}
            contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <FormContent>
                {props.children}
            </FormContent>
        </KeyboardAwareScrollView>
    );
}

const FormContent = styled(View)`
    margin:20px;
    gap:20px;
`
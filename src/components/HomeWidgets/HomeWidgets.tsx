import { View, Text, ImageBackground } from 'react-native';
import React from 'react';
import Container from '../Container/Container';
import { homeWidget } from '../../data/data';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomText from '../Text/Text';

export default function HomeWidgets() {
    return (

        <WidgetContainer>
            {homeWidget.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => console.log(`${item.title} clicked!`)}>
                    <WidgetItem>
                        <WidgetCount>
                            <CustomText fontSizes="hGiant" color="primaryText" center>
                                {item.count}
                            </CustomText>
                        </WidgetCount>
                        <WidgetTitle>
                            <CustomText fontSizes="body4" color="primaryText" center>
                                {item.title}
                            </CustomText>
                        </WidgetTitle>
                    </WidgetItem>
                </TouchableOpacity>
            ))}
        </WidgetContainer>
    );
}

const WidgetContainer = styled(View)`
    justify-content: center;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
`;

const WidgetItem = styled(View)`
    width: 150px;
    height: 150px;
    padding: 20px;
    border-radius: 15px;
    background-color: #ffffff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    elevation: 8;
    justify-content: center;
    align-items: center;
    margin: 10px;
`;

const WidgetTitle = styled(View)`
    margin-bottom: 10px;
    height:50px;
    max-height:50px;
`;

const WidgetCount = styled(View)`
    padding-top: 10px;
    margin-top: 10px;
    width: 100%;
    height:100px;
    align-items: center;
`;

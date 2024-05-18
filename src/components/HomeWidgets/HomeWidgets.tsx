import { View, Text } from 'react-native'
import React from 'react'
import Container from '../Container/Container'
import { homeWidget } from '../../data/data'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomText from '../Text/Text'

export default function HomeWidgets() {
    return (
        <View>
            <WidgetContainer>
                {homeWidget.map((item, index) => (
                    <WidgetItem key={index}>
                        <CustomText fontSizes="h4" color="textLink" center>
                            {item.title}
                        </CustomText>
                        <CustomText borderTop borderColor='textBlack' fontSizes="body3" color="primaryText" center>
                            {item.count}
                        </CustomText>
                    </WidgetItem>
                ))}
            </WidgetContainer>
        </View>
    )
}

const WidgetContainer = styled(View)`
    justify-content:center;
    align-items:center;
    flex-direction:row;
    flex-wrap:wrap;
    margin-vertical:20px;
    gap:15px;
`
const WidgetItem = styled(View)`
    width: 120px;
    height: 120px;
    padding: 15px;
    border-radius: 10px;
    background-color: #fff;
    elevation: 4;
    justify-content:space-between;
    flex-direction:column;
`;
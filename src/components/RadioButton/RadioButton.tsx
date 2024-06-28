import { View, Text } from 'react-native'
import React from 'react'
import styled from 'styled-components'
import useThemeColors from '../../constant/useColor'

export default function RadioButton() {
    const color = useThemeColors()
    return (
        <FilledCircle theme={{ borderColor: color.primary }}
        />)
}

const EmptyCircle = styled(View)`
    height:25px;
    width:25px;
    border-radius:100px;
    border:3px solid ${(props) => props.theme.borderColor};
`
const FilledCircle = styled(View)`
    height:25px;
    width:25px;
    border-radius:100px;
    border:3px solid ${(props) => props.theme.borderColor};
    justify-content:center;
    align-items:center;
    padding:4px;
`


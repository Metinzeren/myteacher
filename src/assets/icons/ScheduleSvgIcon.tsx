import {View, Text} from 'react-native';
import React from 'react';
import {Circle, G, Path, Rect, Svg} from 'react-native-svg';
import {SvgType} from '../../types/type';

export default function ScheduleSvgIcon({width = 45, height = 45}: SvgType) {
  return (
    <Svg height={height} width={width} viewBox="0 0 48 48">
      <Path
        fill="#CFD8DC"
        d="M5,38V14h38v24c0,2.2-1.8,4-4,4H9C6.8,42,5,40.2,5,38z"
      />
      <Path
        fill="#F44336"
        d="M43,10v6H5v-6c0-2.2,1.8-4,4-4h30C41.2,6,43,7.8,43,10z"
      />
      <G fill="#B71C1C">
        <Circle cx="33" cy="10" r="3" />
        <Circle cx="15" cy="10" r="3" />
      </G>
      <G fill="#B0BEC5">
        <Path d="M33,3c-1.1,0-2,0.9-2,2v5c0,1.1,0.9,2,2,2s2-0.9,2-2V5C35,3.9,34.1,3,33,3z" />
        <Path d="M15,3c-1.1,0-2,0.9-2,2v5c0,1.1,0.9,2,2,2s2-0.9,2-2V5C17,3.9,16.1,3,15,3z" />
      </G>
      <G fill="#90A4AE">
        <Rect x="13" y="20" width="4" height="4" />
        <Rect x="19" y="20" width="4" height="4" />
        <Rect x="25" y="20" width="4" height="4" />
        <Rect x="31" y="20" width="4" height="4" />
        <Rect x="13" y="26" width="4" height="4" />
        <Rect x="19" y="26" width="4" height="4" />
        <Rect x="25" y="26" width="4" height="4" />
        <Rect x="31" y="26" width="4" height="4" />
        <Rect x="13" y="32" width="4" height="4" />
        <Rect x="19" y="32" width="4" height="4" />
        <Rect x="25" y="32" width="4" height="4" />
        <Rect x="31" y="32" width="4" height="4" />
      </G>
    </Svg>
  );
}

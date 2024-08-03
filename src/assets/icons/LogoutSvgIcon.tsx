import {View, Text} from 'react-native';
import React from 'react';
import {G, Path, Svg} from 'react-native-svg';
import {SvgType} from '../../types/type';

export default function LogoutSvgIcon({height = 45, width = 45}: SvgType) {
  return (
    <Svg height={height} width={width} viewBox="0 0 16 16">
      <G fill="#F44336">
        <Path d="m 13 5 v 0.003906 c 0.265625 0 0.519531 0.105469 0.707031 0.289063 l 2 2 c 0.390625 0.390625 0.390625 1.023437 0 1.414062 l -2 2 c -0.1875 0.183594 -0.441406 0.289063 -0.707031 0.285157 v 0.007812 h -1 v -2 h -5 c -0.550781 0 -1 -0.449219 -1 -1 s 0.449219 -1 1 -1 h 5 v -2 z m 0 0" />
        <Path d="m 4 1 c -1.644531 0 -3 1.355469 -3 3 v 8 c 0 1.644531 1.355469 3 3 3 h 4 c 1.644531 0 3 -1.355469 3 -3 v -1 c 0 -0.550781 -0.449219 -1 -1 -1 s -1 0.449219 -1 1 v 1 c 0 0.570312 -0.429688 1 -1 1 h -4 c -0.570312 0 -1 -0.429688 -1 -1 v -8 c 0 -0.570312 0.429688 -1 1 -1 h 4 c 0.570312 0 1 0.429688 1 1 v 1 c 0 0.550781 0.449219 1 1 1 s 1 -0.449219 1 -1 v -1 c 0 -1.644531 -1.355469 -3 -3 -3 z m 0 0" />
      </G>
    </Svg>
  );
}

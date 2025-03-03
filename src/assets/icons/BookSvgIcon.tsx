import { View, Text } from 'react-native';
import React from 'react';
import { SvgType } from '../../types/type';
import { G, Path, Svg } from 'react-native-svg';

export default function BookSvgIcon({ height = 60, width = 60 }: SvgType) {
  return (
    <Svg height={height} width={width} role="img" viewBox="0 0 64 64">
      <Path
        d="M54.9 39.7l7.3 7.6l-32.1 16.1s-4.2 2.1-6.2-1.2c-8-13 31-22.5 31-22.5"
        fill="#256382"></Path>

      <Path
        d="M29.2 53.9s-6.1 2.3-5 6.6c1.2 4.5 6.1 1.8 6.1 1.8l30.5-15s-1.7-4.8 1.4-8l-33 14.6"
        fill="#d9e3e8"></Path>

      <Path fill="#42ade2" d="M34.4 8.9L63.6 39L29.1 53.3L7 16.7z"></Path>

      <G fill="#94989b">
        <Path d="M60.7 42.6l-20.4 8.8l20-9.7z"></Path>

        <Path d="M60.4 45.2l-21.7 9.5L60 44.3z"></Path>

        <Path d="M60.6 46.7L32.9 59.4l27.3-13.6z"></Path>
      </G>

      <Path
        d="M23.8 62.1c-3.4-7.5 5.3-8.8 5.3-8.8L7 16.7s-5-.1-5 5.4c0 2.3 1 4 1 4l20.8 36"
        fill="#428bc1"></Path>

      <Path
        d="M8.7 32.2l-7.3 7.6l32.1 16.1s4.2 2.1 6.2-1.2c8-13-31-22.5-31-22.5"
        fill="#547725"></Path>

      <Path
        d="M34.3 46.4s6.1 2.3 5 6.6c-1.2 4.5-6 1.8-6 1.8l-30.5-15s1.7-4.8-1.4-8l32.9 14.6"
        fill="#d9e3e8"></Path>

      <Path fill="#83bf4f" d="M29.2 1.4L0 31.5l34.5 14.3L56.6 9.2z"></Path>

      <G fill="#94989b">
        <Path d="M3.2 34.2l20 9.7l-20.4-8.8z"></Path>

        <Path d="M3.6 36.8l21.2 10.4l-21.7-9.5z"></Path>

        <Path d="M3.4 38.3l27.2 13.6L2.9 39.2z"></Path>
      </G>

      <Path
        d="M39.8 54.6c3.4-7.5-5.3-8.8-5.3-8.8L56.6 9.2s5-.1 5 5.4c0 2.3-1 4-1 4l-20.8 36"
        fill="#699635"></Path>

      <Path
        d="M56.7 26l6.1 6.4l-27.1 13.5s-3.6 1.7-5.3-1C23.8 34 56.7 26 56.7 26z"
        fill="#962c2c"></Path>

      <Path
        d="M35 38s-5.2 1.9-4.2 5.6c1 3.8 5.1 1.5 5.1 1.5l25.7-12.7s-1.4-4 1.2-6.7L35 38z"
        fill="#d9e3e8"></Path>

      <Path fill="#ECA45B" d="M39.4 0L64 25.4L34.9 37.5L16.2 6.6z"></Path>

      <Path fill="#ffffff" d="M40.1 5.8l4.8 5.3l-17.7 6.7L23 11z"></Path>

      <G fill="#94989b">
        <Path d="M61.6 28.5l-17.2 7.3l16.8-8.2z"></Path>

        <Path d="M61.4 30.7L43 38.6l18-8.8z"></Path>

        <Path d="M61.6 31.9L38.2 42.6L61.1 31z"></Path>
      </G>

      <Path
        d="M30.5 44.9c-2.8-6.3 4.5-7.4 4.5-7.4L16.2 6.6s-4.3-.1-4.3 4.5c0 1.9.8 3.4.8 3.4l17.8 30.4"
        fill="#ECA45B"></Path>
    </Svg>
  );
}

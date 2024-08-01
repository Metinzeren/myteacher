import { View } from 'react-native';
import React from 'react';
import { Svg, G, Path, Rect, Text } from 'react-native-svg';
import { SvgType } from '../../types/type';

export default function ClassroomSvgIcon({ height = 60, width = 60 }: SvgType) {
    return (
        <Svg height={height} width={width} viewBox="0 0 64 64">
            <G>
                {/* Blackboard */}
                <Rect x="5" y="5" width="54" height="28" fill="#444" />
                <Text
                    x="32"
                    y="20"
                    fontSize="12"
                    fill="white"
                    textAnchor="middle"
                    fontFamily="Arial"
                >
                    Class Room
                </Text>

                {/* Desks */}
                <Rect x="10" y="40" width="14" height="8" fill="#c0c0c0" />
                <Rect x="26" y="40" width="14" height="8" fill="#c0c0c0" />
                <Rect x="42" y="40" width="14" height="8" fill="#c0c0c0" />

                {/* Students */}
                <G>
                    <Path
                        d="M14 39 a5 5 0 1 1 10 0 a5 5 0 1 1 -10 0"
                        fill="#ffcc99"
                    />
                    <Path
                        d="M30 39 a5 5 0 1 1 10 0 a5 5 0 1 1 -10 0"
                        fill="#ffcc99"
                    />
                    <Path
                        d="M46 39 a5 5 0 1 1 10 0 a5 5 0 1 1 -10 0"
                        fill="#ffcc99"
                    />
                </G>

                {/* Teacher */}
                <G>
                    <Path
                        d="M30 10 a6 6 0 1 1 12 0 a6 6 0 1 1 -12 0"
                        fill="#ffcc99"
                    />
                    <Rect x="28" y="18" width="16" height="8" fill="#3e3e3e" />
                </G>
            </G>
        </Svg>
    );
}

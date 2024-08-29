import { View } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
export default function Loading({
  children,
  loading = false,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {

  return loading ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LottieView
        style={{ width: 300, height: 300 }}
        autoPlay
        loop
        source={require('../../assets/animations/lottie/loading.json')}
      />
    </View>
  ) : (
    <>{children}</>
  );
}

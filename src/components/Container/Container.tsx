import {View, Text, SafeAreaView} from 'react-native';
import useThemeColors from '../../constant/useColor';
import styled from 'styled-components';
import Header, {HeaderProps} from '../Header/Header';

interface ContainerProps extends HeaderProps {
  children?: React.ReactNode;
  type?: 'container' | 'page';
  header?: boolean;
  goBackShow?: boolean;
  bgColor?: string;
  gap?: number;
  m?: number;
  mr?: number;
  ml?: number;
  mt?: number;
  mb?: number;
  mx?: number;
  my?: number;
  p?: number;
  pl?: number;
  pr?: number;
  pt?: number;
  pb?: number;
  px?: number;
  py?: number;
  isHome?: boolean;
  userName?: string;
}

export default function Container({
  children,
  header,
  goBackShow = false,
  isHome = false,
  type = 'page',
  bgColor,
  userName,
  ...props
}: ContainerProps) {
  const colors = useThemeColors();
  return !header ? (
    <SafeViewContainer
      style={{
        flex: 1,
        backgroundColor: bgColor ? bgColor : colors.background,
      }}>
      {type === 'container' ? (
        <View
          style={{
            flex: 1,
            margin: props.m,
            marginRight: props.mr,
            marginLeft: props.ml,
            marginTop: props.mt,
            padding: props.p,
            paddingLeft: props.pl,
            paddingRight: props.pr,
            paddingTop: props.pt,
            paddingBottom: props.pb,
            gap: props.gap,
            marginHorizontal: props.mx,
            marginVertical: props.my,
            paddingHorizontal: props.px,
            paddingVertical: props.py,
          }}>
          {children}
        </View>
      ) : (
        children
      )}
    </SafeViewContainer>
  ) : (
    <ViewContainer
      style={{
        backgroundColor: bgColor ? bgColor : colors.background,
      }}>
      <View>
        {header && (
          <Header
            {...props}
            isHome={isHome}
            userName={userName}
            goBackShow={goBackShow}
          />
        )}
      </View>
      {type === 'container' ? (
        <View
          style={{
            margin: props.m,
            marginRight: props.mr,
            marginLeft: props.ml,
            marginTop: props.mt,
            padding: props.p,
            paddingLeft: props.pl,
            paddingRight: props.pr,
            paddingTop: props.pt,
            paddingBottom: props.pb,
            gap: props.gap,
            marginHorizontal: props.mx,
            marginVertical: props.my,
            paddingHorizontal: props.px,
            paddingVertical: props.py,
          }}></View>
      ) : (
        children
      )}
    </ViewContainer>
  );
}
const ViewContainer = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.background};
`;
const SafeViewContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

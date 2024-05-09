import {View, Text, SafeAreaView} from 'react-native';
import useThemeColors from '../../constant/useColor';
import styled from 'styled-components';
import Header, {HeaderProps} from '../Header/Header';

interface ContainerProps extends HeaderProps {
  children?: React.ReactNode;
  header?: boolean;
}

export default function Container(props: ContainerProps) {
  const colors = useThemeColors();
  return !props.header ? (
    <SafeViewContainer style={{backgroundColor: colors.background}}>
      {props.children}
    </SafeViewContainer>
  ) : (
    <ViewContainer style={{backgroundColor: colors.background}}>
      {props.header && <Header {...props} />}
      {props.children}
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

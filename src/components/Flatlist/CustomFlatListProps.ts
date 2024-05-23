import {StyleProp, ViewStyle} from 'react-native';

interface CustomListProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
  numColumns?: number;
  data: any[];
  filter?: (entity: any, value: any, index: number) => boolean;
  sort?: (a: any, b: any) => number;
  handleRefresh?: () => void;
  isSearchable?: boolean;
  searchStyle?: StyleProp<ViewStyle>;
  searchPlaceholder?: string;
  isBottomSheet?: boolean;
  renderItem: any;
  notFoundText?: string;
}
export default CustomListProps;

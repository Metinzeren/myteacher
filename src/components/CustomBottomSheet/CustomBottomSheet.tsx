import React, {
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useEffect,
  Ref,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

interface BottomSheetComponentProps {
  children?: React.ReactNode;
  snapPoints: string[];
  indicator?: boolean;
}

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

const CustomBottomSheet = forwardRef<BottomSheetRef, BottomSheetComponentProps>(
  (props, ref) => {
    const { children, snapPoints, indicator = true } = props;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isOpen, setIsOpen] = useState(false);

    const cSnapPoints = useMemo(() => snapPoints || ["70%"], []);

    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.expand();
        setIsOpen(true);
      },
      close: () => {
        bottomSheetRef.current?.close();
        setIsOpen(false);
      },
    }));

    const handleSheetChanges = (index: number) => {
      setIsOpen(index !== -1);
    };
    const renderBackdrop = (props: BottomSheetBackgroundProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}

        snapPoints={cSnapPoints}
        enablePanDownToClose={true}
        containerStyle={{ zIndex: 100 }}
        backgroundStyle={styles.contentContainer}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ display: indicator ? 'flex' : 'none' }}
        onChange={handleSheetChanges}>

        {isOpen && children}

      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'white',
  },
});

export default CustomBottomSheet;

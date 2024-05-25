import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {View} from 'react-native';
import styled from 'styled-components';

export interface FormContainerProps {
  children: ReactNode;
  gap?: number;
  formContainerRef?: MutableRefObject<FormContainerRef | null>;
}

export interface FormContainerRef {
  setErrorDataFiels: (errorData: any) => void;
  validate: () => boolean;
}

export default function FormContainer(props: FormContainerProps) {
  const {children: initialChildren, gap = 10, formContainerRef} = props;
  const [children, setChildren] = useState<ReactNode[] | any>(
    React.Children.toArray(initialChildren),
  );
  const [errors, setErrors] = useState<{[key: string]: string | undefined}>({});
  const checkValidation = useCallback((errorData: any) => {
    setErrors(errorData);
  }, []);

  const inputCheckValidation = useCallback((): boolean => {
    let isEmpty = false;

    React.Children.forEach(initialChildren, child => {
      if (React.isValidElement(child)) {
        const childProps = {...child.props};
        if (childProps.id) {
          if (childProps.type === 'text' && childProps.value === '') {
            isEmpty = true;
          }
        }
      }
    });
    return isEmpty;
  }, [initialChildren]);

  useEffect(() => {
    if (formContainerRef) {
      formContainerRef.current = {
        setErrorDataFiels: (errorData: any) => {
          checkValidation(errorData);
        },
        validate: inputCheckValidation,
      };
    }
  }, [formContainerRef, inputCheckValidation]);
  useEffect(() => {
    setChildren(
      React.Children.map(initialChildren, child => {
        if (React.isValidElement(child)) {
          const childProps = {...child.props};
          const error = errors[childProps.id];
          if (error && error !== '') {
            if (childProps.type === 'text') {
              if (childProps.value === '') {
                childProps.errorMessage = error;
              } else {
                delete childProps.errorMessage;
              }
            }
            if (childProps.type === 'checkbox') {
              if (!childProps.checked) {
                childProps.errorMessage = error;
              } else {
                delete childProps.errorMessage;
              }
            }
          } else {
            delete childProps.errorMessage;
          }
          return React.cloneElement(child, childProps);
        }
        return child;
      }),
    );
  }, [initialChildren, errors]);
  return (
    <KeyboardAwareScrollView
      extraHeight={100}
      enableOnAndroid={true}
      contentContainerStyle={{flexGrow: 1}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      <FormContent theme={{gap}}>{children}</FormContent>
    </KeyboardAwareScrollView>
  );
}

const FormContent = styled(View)`
  margin: 20px;
  gap: ${props => props.theme.gap}px;
`;

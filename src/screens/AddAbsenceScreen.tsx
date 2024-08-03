import { View, Text, Keyboard, Image, StyleSheet, PermissionsAndroid, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../components/Container/Container';
import { useTranslation } from 'react-i18next';
import FormContainer, { FormContainerRef } from '../components/FormContainer';
import Input from '../components/Input/Input';
import { faAdd, faCalendar, faCamera, faFileAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import Absenteeism from '../models/Absenteeism';
import uuid from 'react-native-uuid';
import { Calendar } from 'react-native-calendars';
import CustomBottomSheet, { BottomSheetRef } from '../components/CustomBottomSheet/CustomBottomSheet';
import PlaceholderInput from '../components/PlaceholderInput/PlaceholderInput';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import styled from 'styled-components';
import IconButton from '../components/IconButton/IconButton';
import { getResourceByKey } from '../lang/i18n';
import AbsenteeismRepository from '../repositories/AbsenteeismRepository';
import AlertDialog from '../components/AlertDialog/AlertDialog';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types/Navigation';
import { getLocalStorage } from '../utils/AsyncStorageUtils';
import UserRepository from '../repositories/UserRepository';
import CustomText from '../components/Text/Text';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { initStorage } from '../firebase/config';
import { format } from 'date-fns';
export default function AddAbsenceScreen(
    props: NativeStackScreenProps<RootStackParamList, 'AddAbsenceScreen'>,

) {


    const { t } = useTranslation();
    const formRef = useRef<FormContainerRef>(null);
    const AbsenteeismRepo = AbsenteeismRepository.getInstance();
    const UserRepo = UserRepository.getInstance();
    const startDateBottomSheetRef = useRef<BottomSheetRef>(null);
    const endDateBottomSheetRef = useRef<BottomSheetRef>(null);
    const photoButtonRef = useRef<BottomSheetRef>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState({} as any);
    const today = format(new Date(), 'yyyy-MM-dd');
    const [registerDto, setRegisterDto] = useState<Absenteeism>({
        id: uuid.v4().toString(),
        studentId: '',
        classRoomId: '',
        startDate: '',
        endDate: '',
        description: '',
        photo: '',
    });

    const handleChange = (key: keyof typeof registerDto, value: string) => {
        setRegisterDto({
            ...registerDto,
            [key]: value,
        });
    };

    const StartDateCalendar = () => {
        return (
            <Calendar
                minDate={today}
                onDayPress={(day: any) => {
                    handleChange('startDate', day.dateString);
                    startDateBottomSheetRef.current?.close();
                }}
            />
        );
    };

    const EndDateCalendar = () => {
        return (
            <Calendar
                minDate={today}
                onDayPress={(day: any) => {
                    handleChange('endDate', day.dateString);
                    endDateBottomSheetRef.current?.close();
                }}
            />
        );
    };

    const handleSelectImage = () => {

        const options = {
            mediaType: 'photo' as const,
            maxWidth: 300,
            maxHeight: 300,
            quality: 1,
        };

        launchImageLibrary(options as any, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                setImageUri(uri || null);
                handleChange('photo', uri || '');
            }
        });
    };
    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message: "App needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                handleTakePhoto()
                console.log("Camera permission given");
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const handleTakePhoto = () => {
        const options = {
            mediaType: 'photo' as const,
            maxWidth: 300,
            maxHeight: 300,
            quality: 1,
        };

        launchCamera(options as any, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                setImageUri(uri || null);
                handleChange('photo', uri || '');
            }
        });
    };
    const PhotoButtonContent = () => {
        return (
            <Buttons>
                <Button text="Select Image" onPress={() => {
                    photoButtonRef.current?.close()
                    handleSelectImage()
                }} />
                <Button text="Take Photo" onPress={() => {
                    photoButtonRef.current?.close()
                    requestCameraPermission()
                }} />
            </Buttons>
        );
    }
    const getUser = async () => {
        const user = await getLocalStorage('authUser');
        const response = await UserRepo.getUser(user.uid);
        setUserInfo(response)
    }
    useEffect(() => {
        props.navigation.addListener('focus', () => {
            getUser()
        })
    }, [])

    const handleAddAbsence = async () => {
        let isEmpty = formRef.current?.validate(
            getResourceByKey('addAbsenceForm'),
        );
        if (isEmpty) {
            Keyboard.dismiss();
            setLoading(true);
            let photoUrl = '';

            if (imageUri) {
                let bytes = await fetch(imageUri).then((res) => res.blob());
                let storageRef = ref(initStorage, `absenteeism/${userInfo.id}/${registerDto.id}`);
                await uploadBytes(storageRef, bytes);
                photoUrl = await getDownloadURL(storageRef);
            }


            let data = {
                studentId: userInfo.id,
                startDate: registerDto.startDate,
                endDate: registerDto.endDate,
                description: registerDto.description,
                photo: photoUrl,
                classRoomId: userInfo.classRoomId,
            };

            try {
                await AbsenteeismRepo.addAbsenteeism(data);
                AlertDialog.showModal({
                    title: t("SUCCESS"),
                    message: t("CLASS_ADD_SUCCESS"),
                    onConfirm() {
                        props.navigation.goBack();
                    },
                });
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
                setImageUri(null);
            }
        }
    };



    return (
        <Container goBackShow title={t("STUDENT_ABSENCE")} header>
            <Container p={10} type='container'>
                <FormContainer style={{ gap: 10 }} formContainerRef={formRef}>
                    <View>
                        <CustomText fontSizes='body4' color='primaryText'>{t("ADD_PHOTO")} <CustomText fontSizes='body6' color='textLink'>({t("OPTIONAL")})</CustomText> </CustomText>
                    </View>
                    <AddPhotoContainer>
                        <IconContainer>
                            <IconButton onPress={() => photoButtonRef.current?.open()} icon={faAdd} />
                        </IconContainer>
                        <ImageContainer>
                            {imageUri && <StyledImage source={{ uri: imageUri }} />}
                            {imageUri && (
                                <DeleteIconContainer>
                                    <IconButton iconSize={15} backgroundColor='#fff' iconColor='orange' onPress={() => {
                                        setRegisterDto({ ...registerDto, photo: '' });
                                        setImageUri(null)
                                    }} icon={faTrash} />
                                </DeleteIconContainer>
                            )}
                        </ImageContainer>
                    </AddPhotoContainer>

                    <PlaceholderInput
                        required
                        id='startDate'
                        value={registerDto?.startDate}
                        placeholder={t("START_DATE")}
                        onPress={() => {
                            startDateBottomSheetRef.current?.open();
                        }}
                    />
                    <PlaceholderInput
                        required
                        id='endDate'
                        value={registerDto?.endDate}
                        placeholder={t("END_DATE")}
                        onPress={() => {
                            endDateBottomSheetRef.current?.open();
                        }}
                    />
                    <Input
                        required
                        id="description"
                        placeholder={t("DESCRIPTION")}
                        icon={faFileAlt}
                        value={registerDto?.description}
                        onChangeText={e => handleChange('description', e)}
                    />





                </FormContainer>
            </Container>
            <ButtonContainer>
                <Button
                    loading={loading}
                    borderRadius={10}
                    onPress={() => {
                        handleAddAbsence();
                    }}
                    text={t('KAYDET')}
                />
            </ButtonContainer>
            <CustomBottomSheet snapPoints={["70%", "80%"]} ref={startDateBottomSheetRef}>
                <StartDateCalendar />
            </CustomBottomSheet>
            <CustomBottomSheet snapPoints={["70%", "80%"]} ref={endDateBottomSheetRef}>
                <EndDateCalendar />
            </CustomBottomSheet>
            <CustomBottomSheet snapPoints={["30%", "40%"]} ref={photoButtonRef}>
                <PhotoButtonContent />
            </CustomBottomSheet>
        </Container>
    );
}


const Buttons = styled(View)`
    flex-direction: column;
    gap: 10px;
    margin-horizontal: 10px;
`
const ButtonContainer = styled(View)`
    margin-horizontal: 10px;
    margin-bottom: 20px;
`
const AddPhotoContainer = styled(View)`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height:100px;
`;

const ImageContainer = styled(View)`
    position: relative;
    height: 100px;
     `;

const IconContainer = styled(View)`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    border-radius: 10px;
    border-width: 1px;
    border-color: #ebeff3;
    padding: 0px 5px; 
    height: 100px;
`;

const DeleteIconContainer = styled(View)`
    position: absolute;
    top: 0;
    right: 0;
`;

const StyledImage = styled(Image)`
    width: 100px;
    height: 100px;
    border-radius: 10px;
    border-width: 1px;
    border-color: #ebeff3;
`;
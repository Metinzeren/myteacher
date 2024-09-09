import PlaceholderInput from '../components/PlaceholderInput/PlaceholderInput';
import Container from '../components/Container/Container';
import CustomText from '../components/Text/Text';
import Button from '../components/Button/Button';
import styled from 'styled-components';
import {TouchableOpacity, View} from 'react-native';
import {
  faAngleLeft,
  faCheck,
  faCheckCircle,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import FormContainer from 'react-native-form-container';
import {useHomeworks} from '../context/HomeworkContext';
import {useEffect, useState} from 'react';
import ClassRoomRepository from '../repositories/ClassRoomRepository';
import ClassRoom from '../models/ClassRoom';
import IconButton from '../components/IconButton/IconButton';
import Loading from '../components/Loading/Loading';
import CheckboxButton from '../components/CheckboxButton/CheckboxButton';

export default function FilteredHomework({onClose}: {onClose: () => void}) {
  const classRoomRepo = ClassRoomRepository.getInstance();
  const {handleFilter, homeWorkFilter, resetFilter} = useHomeworks();
  const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bottomSheetType, setBottomSheetType] = useState<
    'form' | 'classRooms' | 'students'
  >('form');
  useEffect(() => {
    loadClassRoom();
  }, []);
  const loadClassRoom = () => {
    setLoading(true);
    classRoomRepo
      .getAllClassRooms()
      .then(classRooms => {
        setClassRooms(classRooms);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const ClassRoomListStep = () => {
    return (
      <Container type="container" p={10} bgColor="white">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{position: 'absolute', left: 0}}>
            <IconButton
              icon={faAngleLeft}
              onPress={() => setBottomSheetType('form')}
            />
          </View>
          <CustomText fontSizes="body2" color="primaryText">
            Sınıf Seçimi
          </CustomText>
        </View>

        <Loading loading={loading}>
          <ClassRoomContainer>
            {classRooms.length > 0 ? (
              classRooms.map((classRoom, index) => (
                <PlaceholderInput
                  key={index}
                  onPress={() => {
                    setBottomSheetType('form');
                    let check = homeWorkFilter.classRoom.id === classRoom.id;
                    if (check) {
                      handleFilter('classRoom', {});
                    } else {
                      handleFilter('classRoom', classRoom);
                    }
                  }}
                  rightIconShow={classRoom.id === homeWorkFilter.classRoom.id}
                  rightIcon={faCheckCircle}
                  rightIconColor="green"
                  icon={faUsers}
                  placeholder={classRoom.name}
                />
              ))
            ) : (
              <CustomText fontSizes="body4" color="primaryText">
                Sınıf bulunamadı
              </CustomText>
            )}
          </ClassRoomContainer>
        </Loading>
      </Container>
    );
  };
  const StudentListStep = () => {
    return (
      <Container p={10} bgColor="white" type="container">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{position: 'absolute', left: 0}}>
            <IconButton
              icon={faAngleLeft}
              onPress={() => setBottomSheetType('form')}
            />
          </View>
          <CustomText fontSizes="body2" color="primaryText">
            {homeWorkFilter.classRoom.name} Sınıfı Öğrenci Seçimi
          </CustomText>
        </View>
        <StudentContainer>
          <StudentContainer>
            {homeWorkFilter.classRoom.students?.map((student, index) => {
              let check = homeWorkFilter.students.includes(student);
              return (
                <CheckboxContainer
                  key={index}
                  onPress={() => {
                    handleFilter('students', student);
                  }}>
                  <CheckboxButton
                    onPress={() => {
                      handleFilter('students', student);
                    }}
                    checked={check}
                    label={student.firstName + ' ' + student.lastName}
                  />
                </CheckboxContainer>
              );
            })}
          </StudentContainer>
        </StudentContainer>
      </Container>
    );
  };
  return (
    <>
      {bottomSheetType === 'form' && (
        <Container gap={10} p={10} type="container" bgColor="white">
          <PlaceholderInput
            onPress={() => setBottomSheetType('classRooms')}
            icon={faUser}
            placeholder={homeWorkFilter.classRoom.name || 'Sınıf Seçiniz'}
            required={homeWorkFilter.classRoom.name ? false : true}
            id="students"
          />
          {Object.keys(homeWorkFilter.classRoom).length != 0 && (
            <PlaceholderInput
              onPress={() => setBottomSheetType('students')}
              icon={faUser}
              placeholder={homeWorkFilter.students.length + ' Öğrenci Seçildi'}
              required={homeWorkFilter.students.length > 0 ? false : true}
              id="students"
            />
          )}
          <CustomText color="primaryText" fontSizes="body4">
            Ödev Türü
          </CustomText>
          <ButtonContainer>
            <Button
              onPress={() => handleFilter('homeWorkType', 'Quiz')}
              outline={homeWorkFilter.homeWorkType !== 'Quiz' ? true : false}
              style={{flex: 1}}
              text="Quiz"
            />
            <Button
              onPress={() => handleFilter('homeWorkType', 'Test')}
              outline={homeWorkFilter.homeWorkType !== 'Test' ? true : false}
              text={'Test'}
              style={{flex: 1}}
            />
          </ButtonContainer>
        </Container>
      )}
      {bottomSheetType === 'form' && (
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            flex: 0.2,
            marginHorizontal: 10,
          }}>
          <Button
            style={{flex: 0.8}}
            text="Filtrele"
            onPress={() => {
              handleFilter('isFiltered', true);
              onClose();
            }}
          />
          <Button
            outline
            style={{flex: 0.8}}
            text="Sıfırla"
            onPress={() => {
              resetFilter();
            }}
          />
        </View>
      )}
      {bottomSheetType === 'classRooms' && <ClassRoomListStep />}
      {bottomSheetType === 'students' && <StudentListStep />}
    </>
  );
}

const ButtonContainer = styled(View)`
  flex-direction: row;
  gap: 10px;
`;
const ClassRoomContainer = styled(View)`
  flex: 1;
  margin-top: 20px;
  gap: 10px;
`;
const StudentContainer = styled(View)`
  flex: 1;
  margin-top: 20px;
  gap: 10px;
`;
const CheckboxContainer = styled(TouchableOpacity)`
  flex-direction: row;
  gap: 10px;
  border: 1px solid #ebeff3;
  padding: 10px;
  border-radius: 10px;
`;

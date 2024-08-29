import PlaceholderInput from '../components/PlaceholderInput/PlaceholderInput'
import Container from '../components/Container/Container'
import CustomText from '../components/Text/Text'
import Button from '../components/Button/Button'
import styled from 'styled-components'
import { View } from 'react-native'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import FormContainer from 'react-native-form-container'


export default function FilteredHomwork() {

    return (
        <Container p={10} type="container">
            <FormContainer style={{ gap: 10 }}>
                <PlaceholderInput
                    icon={faUser}
                    placeholder="Sınıf Seçiniz"
                    required
                    id="students"
                />
                <PlaceholderInput
                    icon={faUser}
                    placeholder="Öğrenci Seçiniz"
                    required
                    id="students"
                />
                <CustomText color="primaryText" fontSizes="body4">
                    Ödev Türü
                </CustomText>
                <ButtonContainer>
                    <Button
                        //   onPress={() => handleChangeHomeWork('homeWorkType', 'Quiz')}
                        //   outline={homework.homeWorkType !== 'Quiz'}
                        style={{ flex: 1 }}
                        text="Quiz"
                    />
                    <Button
                        //   onPress={() => handleChangeHomeWork('homeWorkType', 'Test')}
                        //   outline={homework.homeWorkType !== 'Test'}
                        text={'Test'}
                        style={{ flex: 1 }}
                    />
                </ButtonContainer>
            </FormContainer>
        </Container>
    )
}

const ButtonContainer = styled(View)`
  flex-direction: row;
  gap: 10px;
`;
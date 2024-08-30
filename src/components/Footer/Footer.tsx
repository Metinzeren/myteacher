import { View, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CustomText from '../Text/Text';
import useThemeColors from '../../constant/useColor';
import dayjs from 'dayjs';

import { useTranslation } from 'react-i18next';
import { Flags } from '../../data/data';
import i18next from 'i18next';
import { setLanguage, setLocalStorage } from '../../utils/AsyncStorageUtils';
import AlertDialog from '../AlertDialog/AlertDialog';

export default function Footer() {
  const colors = useThemeColors();

  const [selectedLang, setSelectedLang] = useState<any>({});
  const [showOtherLanguages, setShowOtherLanguages] = useState(
    selectedLang ? false : true,
  );
  const { t } = useTranslation();

  useEffect(() => {
    const selected = Flags.find(x => x.languageCode === i18next.language);
    setSelectedLang(selected);
  }, [i18next.language]);

  return (
    <FooterContainer>
      <FooterHelpContainer>
        {selectedLang && !showOtherLanguages ? (
          <FlagsContainer
            activeOpacity={0.7}
            onPress={() => {
              setShowOtherLanguages(!showOtherLanguages);
            }}>
            <Image
              source={selectedLang?.languageIcon}
              style={{ width: 25, height: 25 }}
            />
            <CustomText color="tertiary">
              {selectedLang.languageName}
            </CustomText>
          </FlagsContainer>
        ) : (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {Flags.map((x, i) => {
                return (
                  <FlagsContainer
                    activeOpacity={0.7}
                    key={i}
                    onPress={async () => {
                      AlertDialog.showSpecialLoading();
                      await setLocalStorage('language', x.languageCode);
                      i18next.changeLanguage(x.languageCode).then(() => {
                        AlertDialog.hideLoading();
                      });
                      setShowOtherLanguages(!showOtherLanguages);

                    }}>
                    <Image
                      source={x?.languageIcon}
                      style={{ width: 25, height: 25 }}
                    />
                    <CustomText color="tertiary">{x.languageName}</CustomText>
                  </FlagsContainer>
                );
              })}
            </ScrollView>
          </View>
        )}
      </FooterHelpContainer>
      <FooterText theme={{ colors }}>
        © {dayjs().format('YYYY')} Copyright
      </FooterText>
    </FooterContainer>
  );
}
const FooterContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;
const FooterText = styled(CustomText)`
  color: ${props => props.theme.colors.descriptionColor};
  bottom: 10px;
`;
const FooterHelpContainer = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const FlagsContainer = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  background-color: #fff;
  padding-horizontal: 10px;
  padding-vertical: 5px;
  border-radius: 20px;
  border-width: 1px;
  border-color: #f1f1f1;
`;

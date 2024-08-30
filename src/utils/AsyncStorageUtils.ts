import AsyncStorage from '@react-native-async-storage/async-storage';
import initI18n from '../lang/i18n';


export const LocalStorageKeys = {
  AUTH_USER: 'authUser',
};

export const setLocalStorage = async (
  key: keyof typeof LocalStorageKeys,
  value: any,
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing value in AsyncStorage:', e);
  }
};

export const getLocalStorage = async (key: keyof typeof LocalStorageKeys): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error retrieving value from AsyncStorage:', e);
  }
};
export const getUserFromCollection = async (): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem('authUser');
    return jsonValue != null ? JSON.parse(jsonValue).userCollection : null;
  } catch (e) {
    console.error('Error retrieving value from AsyncStorage:', e);
  }
};
export const getUserId = async (): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem('authUser');
    return jsonValue != null ? JSON.parse(jsonValue).uid : '';
  } catch (e) {
    console.error('Error retrieving value from AsyncStorage:', e);
  }
};

export const getUserAccesToken = async (): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem('authUser');
    return jsonValue != null ? JSON.parse(jsonValue).accessToken : '';
  } catch (e) {
    console.error('Error retrieving value from AsyncStorage:', e);
  }
}
export const getLanguage = async (): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem('language');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error retrieving value from AsyncStorage:', e);
  }
};
export const setLanguage = async (value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    initI18n().then(i18n => {
      i18n?.changeLanguage(value);
    });
    await AsyncStorage.setItem('language', jsonValue);
  } catch (e) {
    console.error('Error storing value in AsyncStorage:', e);
  }
};

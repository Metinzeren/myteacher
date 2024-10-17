import AsyncStorage from '@react-native-async-storage/async-storage';
import initI18n from '../lang/i18n';


export const LocalStorageKeys = {
  AUTH_USER: 'authUser',
  LANGUAGE: 'language',
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
    const jsonValue = await AsyncStorage.getItem("AUTH_USER");
    return jsonValue != null ? JSON.parse(jsonValue).userCollection : null;
  } catch (e) {
    console.error('Error retrieving value from AsyncStorage:', e);
  }
};
export const updateUserFromCollection = async (updatedData: any): Promise<void> => {
  try {

    const user = await getLocalStorage("AUTH_USER") as any;
    const updatedUser = {
      ...user, userCollection: {
        ...user.userCollection,
        ...updatedData
      }
    };
    await setLocalStorage('AUTH_USER', updatedUser);

  } catch (e) {
    console.error('Error storing value in AsyncStorage:', e);
  }
}
export const getUserId = async (): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem("AUTH_USER");
    return jsonValue != null ? JSON.parse(jsonValue).uid : '';
  } catch (e) {
    console.error('Error retrieving value from AsyncStorage:', e);
  }
};

export const getUserAccesToken = async (): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem("AUTH_USER");
    return jsonValue != null ? JSON.parse(jsonValue).accessToken : '';
  } catch (e) {
    console.error('Error retrieving value from AsyncStorage:', e);
  }
}
export const getLanguage = async (): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem("LANGUAGE");
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

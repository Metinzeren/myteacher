import AsyncStorage from '@react-native-async-storage/async-storage';

export const setLocalStorage = async (
  key: string,
  value: any,
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing value in AsyncStorage:', e);
  }
};

export const getLocalStorage = async (key: string): Promise<any> => {
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

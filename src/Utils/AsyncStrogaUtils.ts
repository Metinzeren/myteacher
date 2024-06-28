import AsyncStorage from '@react-native-async-storage/async-storage';


export const setLocalStorage = async (key: string, value: any): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error("Error storing value in AsyncStorage:", e);
    }
};


export const getLocalStorage = async (key: string): Promise<any> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Error retrieving value from AsyncStorage:", e);
    }
};

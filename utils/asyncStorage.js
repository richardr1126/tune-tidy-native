import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeData(key, value) {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
  }
}

export async function getData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
      return value;
    } else {
      return null;
    }
  } catch (e) {
    // error reading value
  }
}

export async function clear() {
  try {
    //extract key 'generationLimit'
    //extract key 'lastUpdateDate'

    const generationLimit = await getData('generationLimit');
    const lastUpdateDate = await getData('lastUpdateDate');
    await AsyncStorage.clear()
    await storeData('generationLimit', generationLimit);
    await storeData('lastUpdateDate', lastUpdateDate);
  } catch (e) {
    // clear error
  }
}
import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  getLocalStorage,
  getUserFromCollection,
} from '../utils/AsyncStorageUtils';

export default function useUser() {
  const [user, setUser] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const getUserFromStorage = await getUserFromCollection();
    setUser(getUserFromStorage);
  };

  return {user};
}

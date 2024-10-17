import React, { useEffect, useState } from 'react';
import {
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
    return getUserFromStorage;
  };

  const getUser = async () => {
    let user = await loadData();
    return user;
  }

  return { user, getUser };
}

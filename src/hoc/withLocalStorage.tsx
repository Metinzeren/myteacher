
import React, { useEffect, useState } from 'react';
import { getLocalStorage, LocalStorageKeys } from '../utils/AsyncStorageUtils';


const withLocalStorage = <P extends object>(
    WrappedComponent: React.ComponentType<P>, localStorageKey: keyof typeof LocalStorageKeys) => {
    return (props: any) => {
        const [storedValue, setStoredValue] = useState<string | null>(null);

        useEffect(() => {
            const fetchLocalStorageValue = async () => {
                try {
                    const value = await getLocalStorage(localStorageKey);
                    setStoredValue(value);
                } catch (error) {
                    console.error('Error fetching localStorage value:', error);
                }
            };

            fetchLocalStorageValue();
        }, []);

        return <WrappedComponent {...props} storedValue={storedValue} />;
    };
};


export default withLocalStorage;






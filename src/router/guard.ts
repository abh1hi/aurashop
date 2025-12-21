import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

export const getCurrentUser = (): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
};

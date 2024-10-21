import { useSnackbar } from "notistack";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ExceptionStrings } from "../../lang/common/exceptions";
import { RefreshIfLoggedOut } from "../../lib/refreshIfLoggedOut";
import useTranslation from "../../utility/useTranslation";
import { LockedEntities, lockEntity as lockEntityAction, setLockedEntities, unlockEntity as unlockEntityAction } from "../slices/lockSlice";

interface LockContextProps {
    lockedEntities: LockedEntities;
    lockEntity: (entity: string, id: string, action: string, abort?: AbortController) => Promise<unknown>;
    timeLeft: (entity: string, id: string, duration?: number) => number;
}

export const LockContext = React.createContext<{
    lockedEntities: LockedEntities;
    lockEntity: (entity: string, id: string, action: string, abort?: AbortController) => Promise<unknown>;
    timeLeft: (entity: string, id: string, duration?: number) => number;
}>({} as LockContextProps);

export const LockProvider = ({ children }: { children: React.ReactNode }) => {
    const { enqueueSnackbar } = useSnackbar();
    const exception = useTranslation(ExceptionStrings).t;
    const abortController = new AbortController();
    const dispatch = useAppDispatch();
    const lockedEntities = useAppSelector((state) => state.lock.lockedEntities);

    const lockEntity = (entity: string, id: string, action: string, abort?: AbortController) => {
        // returns if the fetch was successful or not
        return new Promise((resolve, reject) => {
            fetch('/api/cms', {
                method: 'POST',
                body: JSON.stringify({
                    entity: entity,
                    id: id,
                    action: action,
                }),
                signal: abort ? abort.signal : abortController.signal,
            })
                .then(async (response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(await response.json());
                })
                .then(() => {
                    if (action === 'lock') {
                        dispatch(lockEntityAction({ entity, id }));
                    } else if (action === 'unlock') {
                        dispatch(unlockEntityAction({ entity, id }));
                    }
                    resolve(true);
                })
                .catch((err: Error) => {
                    if ((abort && abort.signal.aborted) || abortController.signal.aborted) {
                        console.log('The user aborted the request');
                        const errorObj = err;
                        errorObj.message = 'The user aborted the request';
                        reject(errorObj);
                    } else {
                        RefreshIfLoggedOut(err.message);
                        if (action === 'lock') {
                            enqueueSnackbar(exception('itemLocked'), { variant: 'error' });
                        } else if (action === 'unlock') {
                            enqueueSnackbar(exception('itemUnlocked'), { variant: 'error' });
                        }
                    }
                    reject(err);
                });
        });
    };

    const timeLeft = (entity: string, id: string, duration: number = 600) => {
        // returns the time left for the lock in seconds
        const localEntities = localStorage.getItem("lockedEntities");
        const lockedEntities = JSON.parse(localEntities || "{}");
        if (Object.keys(lockedEntities).length > 0 && lockedEntities[entity] && lockedEntities[entity][id]) {
            const lockedAt = new Date(lockedEntities[entity][id]);
            const now = new Date();
            const timeLeft = duration - Math.floor((now.getTime() - lockedAt.getTime()) / 1000);

            return timeLeft;
        }
        return 0;
    }


    React.useEffect(() => {
        const storedLockedEntities = localStorage.getItem('lockedEntities');
        if (storedLockedEntities) {
            // check if the lock is still valid and remove it if it is not
            const lockedEntities: LockedEntities = JSON.parse(storedLockedEntities);
            Object.keys(lockedEntities).forEach((entity) => {
                Object.keys(lockedEntities[entity]).forEach((id) => {
                    if (timeLeft(entity, id) <= 0) {
                        // remove the lock without fetching
                        delete lockedEntities[entity][id];
                    }
                });
            });

            // remove empty entities
            Object.keys(lockedEntities).forEach((entity) => {
                if (Object.keys(lockedEntities[entity]).length === 0) {
                    delete lockedEntities[entity];
                }
            });

            localStorage.setItem("lockedEntities", JSON.stringify(lockedEntities));
            if(dispatch) dispatch(setLockedEntities(lockedEntities));
        }
    }, [dispatch]);

    return (
        <LockContext.Provider value={{ lockedEntities, lockEntity, timeLeft }}>
            {children}
        </LockContext.Provider>
    );
};
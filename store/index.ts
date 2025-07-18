import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './admin/mainAdmin';
import ballisticsReducer from './ballistics/ballisticsSlice';

export const store = configureStore({
    reducer: {
        main: mainReducer,
        ballistics: ballisticsReducer,
    },
});
export type AppThunk<ReturnType = void> = (dispatch: AppDispatch, getState: () => RootState) => ReturnType;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
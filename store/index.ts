import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './admin/mainAdmin';

export const store = configureStore({
    reducer: {
        main: mainReducer,
        // 다른 리듀서들을 여기에 추가
    },
});
export type AppThunk<ReturnType = void> = (dispatch: AppDispatch, getState: () => RootState) => ReturnType;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
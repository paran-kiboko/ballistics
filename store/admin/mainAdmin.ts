import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MainState {
  isLoading: boolean;
  isDevmode: boolean;
  pageName: string;
  alertMessage: string;
  userInfo: any;
  theme: 'light' | 'dark' | 'system';
}

const initialState: MainState = {
  isLoading: false,
  isDevmode: false,
  pageName: '',
  alertMessage: '',
  userInfo: null,
  theme: 'system',
};

export const Admin = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsDevmode: (state, action: PayloadAction<boolean>) => {
      state.isDevmode = action.payload;
    },
    setPageName: (state, action: PayloadAction<string>) => {
      state.pageName = action.payload;
    },
    setAlertMessage: (state, action: PayloadAction<string>) => {
      state.alertMessage = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  setIsLoading,
  setIsDevmode,
  setPageName,
  setAlertMessage,
  setUserInfo,
  setTheme,
} = Admin.actions;

export default Admin.reducer;
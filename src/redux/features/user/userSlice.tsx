import {RootState} from '@/redux/store';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface UserInfo {
  id: string;
  username: string;
  email: string;
  name: string;
  position: string;
  instansi: string;
  type_user: string;
  avatar: string | null;
  slug: string;
  fcm_token: string;
}

interface UserState {
  info: UserInfo | null;
}

const initialState: UserState = {
  info: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<UserInfo>) => {
      state.info = action.payload;
    },
    clearInfo: state => {
      state.info = null;
    },
  },
});

export const {setInfo, clearInfo} = userSlice.actions;
export const selectInfo = (state: RootState) => state.user.info;
export default userSlice.reducer;

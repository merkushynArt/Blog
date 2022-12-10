import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
   user: null,
   token: null,
   isLoading: false,
   status: null,
}

//auth-назва slice, /registerUser-назва функції
export const registerUser = createAsyncThunk(
   'auth/registerUser', 
   async ({ username, password }) => {
      try {
         const { data } = await axios.post('/auth/register', {
            username,
            password,
         });

         if(data.token) {
            window.localStorage.setItem('token', data.token);
         }

         return data;
      } catch (error) {
         console.log(error);
      }
   },
);

export const loginUser = createAsyncThunk(
   'auth/loginUser', 
   async ({ username, password }) => {
      try {
         const { data } = await axios.post('/auth/login', {
            username,
            password,
         });

         if(data.token) {
            window.localStorage.setItem('token', data.token);
         }

         return data;
      } catch (error) {
         console.log(error);
      }
   },
);

export const getMe = createAsyncThunk('auth/loginUser', 
   async () => {
      try {
         const { data } = await axios.get('/auth/me');

         return data;
      } catch (error) {
         console.log(error);
      }
   },
);

export const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      logout: (state) => {
         state.user = null;
         state.token = null;
         state.isLoading = null;
         state.status = null;
      }
   },
   extraReducers: {
      //Register user
      [registerUser.pending]: (state) => {
         state.isLoading = true;
         state.status = null;
      },
      [registerUser.fulfilled]: (state, action) => {
         state.isLoading = false;
         state.status = action.payload.massage;
         state.user = action.payload.user;
         state.token = action.payload.token;
      },
      [registerUser.rejected]: (state, action) => {
         state.status = action.payload.massage;
         state.isLoading = false;
      },

      //Login user
      [loginUser.pending]: (state) => {
         state.isLoading = true;
         state.status = null;
      },
      [loginUser.fulfilled]: (state, action) => {
         state.isLoading = false;
         state.status = action.payload.massage;
         state.user = action.payload.user;
         state.token = action.payload.token;
      },
      [loginUser.rejected]: (state, action) => {
         state.status = action.payload.massage;
         state.isLoading = false;
      },

      //Get me, перевірка авторизації
      [getMe.pending]: (state) => {
         state.isLoading = true;
         state.status = null;
      },
      [getMe.fulfilled]: (state, action) => {
         state.isLoading = false;
         state.status = null;
         state.user = action.payload?.user;
         state.token = action.payload?.token;
      },
      [getMe.rejected]: (state, action) => {
         state.status = action.payload.massage;
         state.isLoading = false;
      },
   },
});

export const checkIsAuth = (state) => Boolean(state.auth.token);

export const { logout } = authSlice.actions;

export default authSlice.reducer;
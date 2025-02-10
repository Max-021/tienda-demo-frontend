import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { checkSession, logout } from "../auxiliaries/axiosHandlers";

export const checkAuth = createAsyncThunk("user/checkAuth", async (_, thunkAPI) => {
  try {
    const sessionData = await checkSession();
    if (sessionData.success) {
        return { isAuthenticated: true, user: sessionData.user };
    } else {
        return thunkAPI.rejectWithValue({ message: sessionData.message, status: sessionData.status });
    }
  } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
  }
})
export const logoutUser = createAsyncThunk("user/logoutUser", async (_, thunkAPI) => {
  try {
    await logout();
    return { isAuthenticated: false };
  } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
  }
});

const initialState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null,
    //ir completando
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        loginUser: (state) => {
          //revisar que parametros pasar
        },
        newUser: (state) => {
          //revisar que parametros pasar
        }

    },
    extraReducers:(builder) => {
      builder
        .addCase(checkAuth.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
          state.isAuthenticated = action.payload.isAuthenticated;
          state.user = action.payload.user || null;
          state.loading = false;
        })
        .addCase(checkAuth.rejected, (state,action) => {
          state.isAuthenticated = false;
          state.error = action.payload.message;
          state.loading = false;
        })
        .addCase(logoutUser.fulfilled, (state) => {
          state.isAuthenticated = false;
          state.user = null;
          state.error = null;
        })
        .addCase(logoutUser.rejected, (state,action) => {
          state.error = action.payload.message;
        })
    }
})
export const {loginUser, newUser} = userSlice.actions;

export const authenticateStatus = (state) => state.user.isAuthenticated;

export default userSlice.reducer;
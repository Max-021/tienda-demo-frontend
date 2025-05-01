import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { checkSession, logout } from "../auxiliaries/axiosHandlers";

export const checkLogin = createAsyncThunk(
  'user/checkLogin',
  async (_,thunkAPI) => {
    try {
      const data = await checkSession();
      console.log('del thunk con checkSession')
      console.log(data)
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async(_,thunkAPI) => {
    try {
      const data = await logout();
      console.log("thunk logout")
      console.log(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const initialState = {
    isAuthenticated: false,
    loading: false,
    error: null,
    userRole: null,
    username: null,
    //ir completando
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
      builder.addCase(checkLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        console.log("action payload")
        console.log(action.payload)
        state.loading = false;
        state.isAuthenticated = action.payload.message === 'logged' ? true : false;
        state.userRole = action.payload.userInfo.role || 'none';
        state.username = action.payload.userInfo.username || null;
      })
      .addCase(checkLogin.rejected, (state,action) => {
        console.log("rejected in thunk")
        state.loading = false;
        state.isAuthenticated = false;
        state.userRole = null;
        state.username = null;
        state.error = action.payload || 'unknown error'
      })
      .addCase(logoutUser.pending , (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled , (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userRole = null;
        state.username = null;
      })
      .addCase(logoutUser.rejected , (state, action) => {
        state.loading = false;
        state.error = action.payload || 'unknown error'
      })
    },
})

export const authenticateStatus = (state) => state.user.isAuthenticated;
export const userRole = (state) => state.user.userRole;
export const username = (state) => state.user.username;

export default userSlice.reducer;
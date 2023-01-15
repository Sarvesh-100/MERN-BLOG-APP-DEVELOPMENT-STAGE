import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import baseUrl from "../../../utils/baseURL";



//action

export const createCategoryAction = createAsyncThunk(
    "category/create",
    async (category, { rejectWithValue, getState, dispatch }) => {
        //get user token
        const user = getState()?.users;
        
        const { userAuth } = user;
        const config = {
            headers:{
                Authorization:`Bearer ${userAuth?.token}`
            }
        }

        //http call
        try {
            const { data } = await axios.post(`${baseUrl}/api/category`,{
                title:category?.title,
            },
            config
            );
            return data;
        } catch (error) {
            if(!error?.response){
                throw error;
            }
            return rejectWithValue(error?.response?.data);
        }
    }
);


//Slices

const categorySlices = createSlice({
    name: "category",
    initialState:{},
    extraReducers: builder => {
        builder.addCase(createCategoryAction.pending,(state, action)=>{
            state.loading = true;
        });
        builder.addCase(createCategoryAction.fulfilled, (state, action)=>{
            state.category = action?.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        builder.addCase(createCategoryAction.rejected,(state,action)=>{
            state.loading = false;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message;
        });
    },
});


export default categorySlices.reducer;
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/users/usersSlices'
import categoryReducer from '../slices/category/categorySlice'

const store = configureStore({
    reducer: {
        users:usersReducer,
        categories:categoryReducer,
    },  
});

export default store;
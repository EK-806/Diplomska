import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/hooks/userSlice';
const store = configureStore({
    reducer: { auth: userReducer },
});

export default store;
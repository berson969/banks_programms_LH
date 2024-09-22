import { configureStore } from '@reduxjs/toolkit';
import columnsReducer from '../slices';

export const store = configureStore({
    reducer: {
        table: columnsReducer,
    },
});

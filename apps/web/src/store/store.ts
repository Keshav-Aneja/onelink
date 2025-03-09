import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "@store/slices/user-slice";
import collectionReducer from "@store/slices/collections-slice";
import appReducer from "@store/slices/application-slice";
import linkReducer from "./slices/links-slice";

const persistConfig = {
  key: "onelink",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  collection: collectionReducer,
  link: linkReducer,
  app: appReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

//now instead of plain old useSelector and useDispatch use these
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);

import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

import userReducer from "@/redux/features/user/userSlice";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import { AuthService } from "./services/AuthService";
import { GlobalService } from "./services/GlobalService";
import { RegionService } from "./services/RegionService";
import { DocumentService } from "./services/DocumentService";

export const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: unknown) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

export const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export const userPersistConfig = {
  key: "user",
  storage: storage,
  whitelist: ["info"],
};

const persistedUser = persistReducer(userPersistConfig, userReducer);

const rootReducer = combineReducers({
  user: persistedUser,
  [AuthService.reducerPath]: AuthService.reducer,
  [GlobalService.reducerPath]: GlobalService.reducer,
  [RegionService.reducerPath]: RegionService.reducer,
  [DocumentService.reducerPath]: DocumentService.reducer,
});

export default rootReducer;

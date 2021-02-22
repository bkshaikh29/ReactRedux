import { createStore, combineReducers, applyMiddleware } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import users from './Login/UserReducer';
import { members } from './Members/MemberReducer';
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";

debugger
const reducers = { users, members };
const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
}
const rootReducers = combineReducers(reducers)
const persistedReducer = persistReducer(persistConfig, rootReducers);

//const store = createStore(persistedReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) ;
const store = createStore(persistedReducer, composeWithDevTools(
    applyMiddleware(thunk)
));

export default store;


import { createStore, applyMiddleware, combineReducers, Store } from 'redux';
import { thunk } from 'redux-thunk';
import loginReducer from './reducers/loginReducer';
import orderReducer from './reducers/orderReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  orders: orderReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = Store<RootState>;

export default store;

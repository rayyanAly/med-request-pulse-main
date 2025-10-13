import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import loginReducer from './reducers/loginReducer';
import orderReducer from './reducers/orderReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  orders: orderReducer,
  // Add other reducers here
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
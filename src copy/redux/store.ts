import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';
import { UnknownAction } from 'redux';

// Import reducers
import templateReducer from './reducers/templateReducer';
import whatsappReducer from './reducers/whatsappReducer';
import { abandonedCartsReducer } from './reducers/abandonedCartsReducer';
import { bannerReducer } from './reducers/bannerReducer';
import { referenceDataReducer } from './reducers/referenceDataReducer';
import promotionReducer from './reducers/promotionReducer';
import productReducer from './reducers/productReducer';
import manufacturerReducer from './reducers/manufacturerReducer';
import categoryReducer from './reducers/categoryReducer';

const rootReducer = combineReducers({
  template: templateReducer,
  whatsapp: whatsappReducer,
  abandonedCarts: abandonedCartsReducer,
  banners: bannerReducer,
  referenceData: referenceDataReducer,
  promotions: promotionReducer,
  products: productReducer,
  manufacturers: manufacturerReducer,
  categories: categoryReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

export default store;
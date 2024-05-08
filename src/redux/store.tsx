import { legacy_createStore as createStore, applyMiddleware , combineReducers } from 'redux';
import contactReducer from './contacts/contactReducer';
import userProfileReducer from './userprofile/userProfileReducer';
import verificationReducer from './credential/verificationReducer';
import locationReducer from './location/locationReducer';
import notificationReducer from './notifications/notificationReducer';
import subscripionReducer from './subscription/subscriptionReducer';

const thunkMiddleware = require('redux-thunk').thunk


const rootReducer = combineReducers({
  contacts: contactReducer,
  userProfile: userProfileReducer,
  verification: verificationReducer,
  location:locationReducer,
  notifications:notificationReducer,
  subscription:subscripionReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));


export default store;


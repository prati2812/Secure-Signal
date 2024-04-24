import { legacy_createStore as createStore, applyMiddleware , combineReducers } from 'redux';
import selectedContactsReducer from './contacts/selectedContactReducer';
import contactReducer from './contacts/contactReducer';
import userProfileReducer from './userprofile/userProfileReducer';
import verificationReducer from './credential/verificationReducer';
import locationReducer from './location/locationReducer';
import notificationReducer from './notifications/notificationReducer';

const thunkMiddleware = require('redux-thunk').thunk



const rootReducer = combineReducers({
  selectedContacts: selectedContactsReducer,
  contacts: contactReducer,
  userProfile: userProfileReducer,
  verification: verificationReducer,
  location:locationReducer,
  notifications:notificationReducer,

});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;


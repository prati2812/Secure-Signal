
import { createStore, combineReducers } from 'redux';
import selectedContactsReducer from './contacts/selectedContactReducer';
import contactReducer from './contacts/contactReducer';
import userProfileReducer from './userprofile/userProfileReducer';
import verificationReducer from './credential/verificationReducer';


const rootReducer = combineReducers({
  selectedContacts: selectedContactsReducer,
  contacts: contactReducer,
  userProfile:userProfileReducer,
  verification:verificationReducer,
});

const store = createStore(rootReducer);

export default store;

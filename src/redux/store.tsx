
import { createStore, combineReducers } from 'redux';
import selectedContactsReducer from './contacts/selectedContactReducer';
import contactReducer from './contacts/contactReducer';
import userProfileReducer from './userprofile/userProfileReducer';

const rootReducer = combineReducers({
  selectedContacts: selectedContactsReducer,
  contacts: contactReducer,
  userProfile:userProfileReducer,
});

const store = createStore(rootReducer);

export default store;

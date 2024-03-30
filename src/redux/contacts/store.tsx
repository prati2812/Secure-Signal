
import { createStore, combineReducers } from 'redux';
import selectedContactsReducer from './selectedContactReducer';
import contactReducer from './contactReducer';

const rootReducer = combineReducers({
  contacts: contactReducer,
  selectedContacts: selectedContactsReducer,
});

const store = createStore(rootReducer);

export default store;

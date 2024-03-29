
import { createStore, combineReducers } from 'redux';
import selectedContactsReducer from './selectedContactReducer';

const rootReducer = combineReducers({
  selectedContacts: selectedContactsReducer,
});

const store = createStore(rootReducer);

export default store;

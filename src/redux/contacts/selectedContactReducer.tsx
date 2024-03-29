// selectedContactsReducer.js
import { ADD_SELECTED_CONTACTS, REMOVE_SELECTED_CONTACTS } from './action';

const initialState: never[] = [];

const selectedContactsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SELECTED_CONTACTS:
      return [...state, action.payload];
    case REMOVE_SELECTED_CONTACTS:
      return state.filter(contact => contact.recordID !== action.payload);
    default:
      return state;
  }
};

export default selectedContactsReducer;

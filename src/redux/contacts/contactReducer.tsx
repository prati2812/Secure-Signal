import { ADD_CONTACTS, ADD_MATCHING_CONTACTS } from "./action";

const initialState = {
    contacts: [],
    matchingContacts: [],
  };
  
  const contactReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
      case ADD_CONTACTS:
        return {
          ...state,
          contacts: action.payload,
        };
      case ADD_MATCHING_CONTACTS:
        return{
          ...state,
          matchingContacts: action.payload,
        };  
      default:
        return state;
    }
};

export default contactReducer;
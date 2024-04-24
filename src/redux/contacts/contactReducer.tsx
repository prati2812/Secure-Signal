import { ADD_CONTACTS, ADD_MATCHING_CONTACTS , UPDATED_CONTACT_LIST } from "./action";

const initialState = {
    contacts: [],
    matchingContacts: [],
    updatedContactList : [],
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
      case UPDATED_CONTACT_LIST:
        return{
          ...state,
          updatedContactList: [],
        };    
      default:
        return state;
    }
};

export default contactReducer;
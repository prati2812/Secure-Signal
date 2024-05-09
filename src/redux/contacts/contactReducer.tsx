import { ADD_CONTACTS, ADD_MATCHING_CONTACTS , ADD_SELECTED_CONTACTS, GET_SELECTED_CONTACTS_LIST, REMOVE_SELECTED_CONTACTS, UPDATED_CONTACT_LIST } from "./action";


const initialState = {
    contacts: [],
    matchingContacts: [],
    updatedContactList : [],
    selectedContact: [],
};
  

  const contactReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
      case ADD_CONTACTS:
        return {
          ...state,
          contacts: action.payload,
        };
      case ADD_MATCHING_CONTACTS:
        return {
          ...state,
          matchingContacts: action.payload,
        };
      case UPDATED_CONTACT_LIST:
        return {
          ...state,
          updatedContactList: [],
        };
      case GET_SELECTED_CONTACTS_LIST:
        if(action.payload){
          return{
            ...state,
            selectedContact:action.payload,
          }
        }
        
      case ADD_SELECTED_CONTACTS:        
        if(action.payload){          
          return {
            ...state,
            selectedContact: [...state.selectedContact, action.payload],
          }; 
        }

      case REMOVE_SELECTED_CONTACTS:
        return{
          ...state,
          selectedContact: state.selectedContact.filter(contact => contact.recordID !== action.payload)
        } 
      default:
        return state;
  }


};

export default contactReducer;
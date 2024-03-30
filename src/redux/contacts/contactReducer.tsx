import { ADD_CONTACTS} from "./action";

const initialState = {
    contacts: [],
  };
  
  const contactReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
      case ADD_CONTACTS:
        return {
          ...state,
          contacts: action.payload,
        };
      default:
        return state;
    }
};

export default contactReducer;
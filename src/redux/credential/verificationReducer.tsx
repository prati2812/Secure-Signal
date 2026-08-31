import { ADD_VERIFICATION_ID } from "./action";


const initialState = {
    verificationId:''
};

const verificationReducer = (state = initialState ,action: { type: any; payload: any; }) => {
    switch(action.type){
        case ADD_VERIFICATION_ID:
            return{
                ...state,
                verificationId: action.payload, 
            }
        default:
            return state;     
    }
};

export default verificationReducer;
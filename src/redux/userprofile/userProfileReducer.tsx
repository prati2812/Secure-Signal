import { ADD_IMAGE_URI , CHANGE_USER_NAME } from "../action";

const initialState = {
    imageUri:'',
    userName:'',
};

const userProfileReducer = (state = initialState , action: { type: any; payload: any; }) => {
    switch(action.type){
        case ADD_IMAGE_URI:
            return {
               ...state,
               imageUri: action.payload,
            }
        case CHANGE_USER_NAME:
            return{
               ...state,
               userName: action.payload, 
            }    
        default:
            return state;    
    }
};

export default userProfileReducer;
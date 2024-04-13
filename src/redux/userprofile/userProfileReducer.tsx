import { ADD_IMAGE_URI , CHANGE_USER_NAME, ADD_IMAGE_RESPONSE , ADD_USER_ID, ADD_USER_PHONE_NUMBER , ADD_TOKEN} from "./action";

const initialState = {
    imageUri:'',
    userName:'',
    imageResponse:Object,
    userId:Object,
    phoneNumber:'',
    token:'',
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
        case ADD_IMAGE_RESPONSE: 
            return{
               ...state,
               imageResponse:action.payload, 
            }
        case ADD_USER_ID:
            return{
                ...state,
                userId:action.payload,
            }
        case ADD_USER_PHONE_NUMBER:
            return{
                ...state,
                phoneNumber:action.payload,
            }
        case ADD_TOKEN:
            return{
                ...state,
                token:action.payload,
            }                    
        default:
            return state;    
    }
};

export default userProfileReducer;
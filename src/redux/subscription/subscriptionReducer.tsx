import { IS_SUBSCRIBED, SUBSCRIPTION_END_TIME, SUBSCRIPTION_TYPE } from "./action";

const initialState = {
    isSubscribed:Boolean,
    subScriptionType:String,
    subScriptionEndTime:String,
}

const subscripionReducer = (state = initialState , action: { type: any; payload: any; }) => {
    switch(action.type){
        case IS_SUBSCRIBED:
            return{
                ...state,
                isSubscribed:action.payload,
            }

        case SUBSCRIPTION_TYPE:
            return{
                ...state,
                subScriptionType:action.payload,
            }
        
        case SUBSCRIPTION_END_TIME:
            return{
                ...state,
                subScriptionEndTime:action.payload,
            }    
        default:
            return state;    
    }

};

export default subscripionReducer;
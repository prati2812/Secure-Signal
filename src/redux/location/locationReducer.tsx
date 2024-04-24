import { FETCH_LOCATIONS } from "./action";

const initialState = {
    locations:[]
};

const locationReducer = (state=initialState , action: { type: any; payload: any; }) => {
      switch(action.type){
        case FETCH_LOCATIONS:
            return{
                ...state,
                locations:action.payload,
            }

        default:
            return state;   

      }

}

export default locationReducer;

import { FETCH_LOCATIONS, NEAREST_HOSPITAL_LOCATION, NEAREST_POLICE_STATION_LOCATION } from "./action";


const initialState = {
    locations:[],
    nearestPoliceStation:[],
    nearestHospital:[],
};

const locationReducer = (state=initialState , action: { type: any; payload: any; }) => {
      switch(action.type){
        case FETCH_LOCATIONS:
            return{
                ...state,
                locations:action.payload,
            }
        
        case NEAREST_POLICE_STATION_LOCATION:
            return{
                ...state,
                nearestPoliceStation:action.payload,
            }
        
        case NEAREST_HOSPITAL_LOCATION:
            return{
                ...state,
                nearestHospital:action.payload,
            }    

        default:
            return state;   

      }

}

export default locationReducer;

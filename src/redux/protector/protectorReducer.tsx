import { POLICE_STATIONS_DATA, PROTECTOR_STATION_DATA } from "./action";

const initialState = {
     policeStationsData : [],
     protectorData: Object,
}

const protectorReducer = (state = initialState , action: { type: any; payload: any; }) => {
    switch(action.type){
        case POLICE_STATIONS_DATA:
            return{
                ...state,
                policeStationsData: action.payload,
            }

        case PROTECTOR_STATION_DATA:
            return{
                ...state,
                protectorData: action.payload,
            }
        default:
            return state;    
    }
}

export default protectorReducer;
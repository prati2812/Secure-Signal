import { ALL_NOTIFICATION_READ, DELETE_ALL_NOTIFICATION, FETCH_EMERGENCY_CONTACTS_NOTIFICATION, FETCH_LIVE_LOCATION_NOTIFICATION, FETCH_SAFE_ARRIVAL_NOTIFICATION } from "./action";



const initialState = {
    fetchSelectedContactNotification:[],
    notificationAllReadOrNot: null,
    deleteAllNotificationOrNot : false,
    fetchLiveLocationNotification:[],
    fetchSafeArrivalNotification:[],
};


const notificationReducer = (state=initialState , action: { type: any; payload: any; }) => {
    switch(action.type){
        case FETCH_EMERGENCY_CONTACTS_NOTIFICATION:
            return{
                ...state,
                fetchSelectedContactNotification:action.payload,
            }
        
        case ALL_NOTIFICATION_READ:
            return{
                ...state,
                notificationAllReadOrNot: action.payload,
            }

        case FETCH_LIVE_LOCATION_NOTIFICATION:
            return{
                ...state,
                fetchLiveLocationNotification: action.payload,
            }    
        
        case FETCH_SAFE_ARRIVAL_NOTIFICATION:
            return{
                ...state,
                fetchSafeArrivalNotification: action.payload,
            }
                
        case DELETE_ALL_NOTIFICATION:
            return{
                ...state,
                deleteAllNotificationOrNot : action.payload,
            }    

        default:
            return state;    
    }
}


export default notificationReducer;
import { ALL_NOTIFICATION_READ, DELETE_ALL_NOTIFICATION, FETCH_EMERGENCY_CONTACTS_NOTIFICATION } from "./action";


const initialState = {
    fetchSelectedContactNotification:[],
    notificationAllReadOrNot: null,
    deleteAllNotificationOrNot : false,
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
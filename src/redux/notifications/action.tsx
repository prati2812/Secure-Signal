import axios from "axios";
import { Dispatch } from "redux";
import instance from "../../axios/axiosInstance";


export  const FETCH_EMERGENCY_CONTACTS_NOTIFICATION= 'FETCH_EMERGENCY_CONTACTS_NOTIFICATION';
export const ALL_NOTIFICATION_READ = 'ALL_NOTIFICATION_READ';
export const DELETE_ALL_NOTIFICATION = 'DELETE_ALL_NOTIFICATION';
export const FETCH_LIVE_LOCATION_NOTIFICATION = 'FETCH_LIVE_LOCATION_NOTIFICATION';


export const fetchEmergencyContactNotification = (userId : string , token:string) => {
     return async (dispatch: Dispatch) => {
       const response = await instance.post('/fetchEmergencyContactNotification',{userId});

       if (response.status === 200) {
         dispatch({
           type: FETCH_EMERGENCY_CONTACTS_NOTIFICATION,
           payload: response.data,
         });
       } else {
         console.log('something occured');
       }
     };
}

export const allNotificationReadOrNot = (userId: string , token: string) => {
  return async (dispatch : Dispatch) => {
    
     
    let isAllRead = false;
    const response = await instance.post('/fetchEmergencyContactNotification',{userId});

    if (response.status === 200) { 
      const data = response.data;
      
      if (response.data.length === 0) {   
        // dispatch({
        //   type: ALL_NOTIFICATION_READ,
        //   payload: true,
        // });
         isAllRead = true;
      } else {         
        for (let i = 0; i < data.length; i++) {
          const read = data[i].isRead;
          if(read === false){
            // dispatch({
            //   type: ALL_NOTIFICATION_READ,
            //   payload: false,
            // });
            isAllRead = false;
            break;
          }
          else{
            isAllRead = read;
          }
          
          
        }

      }
       
      
      
    }
    
   
    let isAllLiveNotificationRead = false; 
    await instance.post('/fetchLiveLocationNotification',{userId}).then((response) => {

         if(response.status === 200){
            const data = response.data;
            
            
            if (response.data.length === 0) {
              // dispatch({
              //   type: ALL_NOTIFICATION_READ,
              //   payload: true,
              // });
              isAllLiveNotificationRead = true;
            } 
            else {
              for (let i = 0; i < data.length; i++) {
                const read = data[i].isRead;
                if(read === false){
                  // dispatch({
                  //   type: ALL_NOTIFICATION_READ,
                  //   payload: false,
                  // });
                  isAllLiveNotificationRead = false;
                  break;
                }
                else{
                  isAllLiveNotificationRead = read;
                }
              }
            }      
         }
    })

    if(isAllLiveNotificationRead === false || isAllRead === false){
      dispatch({
        type: ALL_NOTIFICATION_READ,
        payload: false,
      });
    }
    else{
      dispatch({
        type: ALL_NOTIFICATION_READ,
        payload: true,
      });
    }
  }
}

export const fetchLiveLocationNotification = (userId:string, token:string) => {
  return async (dispatch: Dispatch) => {
    const response = await instance.post('/fetchLiveLocationNotification',{userId});

    if (response.status === 200) {
      dispatch({
        type: FETCH_LIVE_LOCATION_NOTIFICATION,
        payload: response.data,
      });
    } else {
      console.log('something occured');
    }
  };
}

export const deleteAllNotificationOrNot = ( notificationDelete : boolean) => ({
    type:DELETE_ALL_NOTIFICATION,
    payload: notificationDelete,
})
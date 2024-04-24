import axios from "axios";
import { Dispatch } from "redux";

export  const FETCH_EMERGENCY_CONTACTS_NOTIFICATION= 'FETCH_EMERGENCY_CONTACTS_NOTIFICATION';
export const ALL_NOTIFICATION_READ = 'ALL_NOTIFICATION_READ';
export const DELETE_ALL_NOTIFICATION = 'DELETE_ALL_NOTIFICATION';


export const fetchEmergencyContactNotification = (userId : string , token:string) => {
     return async (dispatch: Dispatch) => {
       const response = await axios.post(
         'http://10.0.2.2:3000/fetchEmergencyContactNotification',
         {
           userId,
         },
         {
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`,
           },
         },
       );

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
    const response = await axios.post(
      'http://10.0.2.2:3000/fetchEmergencyContactNotification',
      {
        userId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) { 
      const data = response.data;
      
      if (response.data.length === 0) {
        dispatch({
          type: ALL_NOTIFICATION_READ,
          payload: true,
        });
      } else {
        for (let i = 0; i < data.length; i++) {
          const read = data[i].isRead;
          isAllRead = read;
        }

        dispatch({
          type: ALL_NOTIFICATION_READ,
          payload: isAllRead,
        });
      }
       
      
      
    }
   

  }
}

export const deleteAllNotificationOrNot = ( notificationDelete : boolean) => ({
    type:DELETE_ALL_NOTIFICATION,
    payload: notificationDelete,
})
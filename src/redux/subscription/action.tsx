import axios from "axios";
import { Dispatch } from "redux";
import { startSubscriptionService } from "../../utils/SubscriptionService";

export const IS_SUBSCRIBED = 'IS_SUBSCRIBED';
export const SUBSCRIPTION_TYPE = 'SUBSCRIPTION_TYPE';
export const SUBSCRIPTION_END_TIME = 'SUBSCRIPTION_END_TIME';



export const addSubscriptionDetails = (userId:string, token:string) => {
    return async (dispatch:Dispatch) => {
        const response = await axios.post('http://10.0.2.2:3000/fetchUserDetails' , {
               userId,},{
                 headers:{
                   'Content-Type':'application/json',
                   Authorization: `Bearer ${token}`,
                 },
               });
         
         
               if(response.status === 200){
                  const responseData = await response.data;
                  const {isSubscribed} = responseData;
                  dispatch({
                    type:IS_SUBSCRIBED,
                    payload:isSubscribed,
                  });

                  startSubscriptionService();
                
                  
                  
               }
               else{
                 console.log("Something occured");
                 
               }
 
     }  
      
};


export const updateSubscriptionDetails = (userId:string) => {
  return async (dispatch:Dispatch) => {
    const response = await axios.post('http://10.0.2.2:3000/updateSubscriptionDetails' , {
           userId,},{
             headers:{
               'Content-Type':'application/json',
             },
           });
     
     
           if(response.status === 200){
              dispatch({
                type:IS_SUBSCRIBED,
                payload:false,
              });

              dispatch({
                type:SUBSCRIPTION_TYPE,
                payload:'',
              });

              dispatch({
                type:SUBSCRIPTION_END_TIME,
                payload:'',
              });
              
           }
           else{
             console.log("Something occured");
             
           }

    } 
}

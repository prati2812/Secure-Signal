import axios from "axios";
import { Dispatch } from "redux";
import { IS_SUBSCRIBED, SUBSCRIPTION_END_TIME, SUBSCRIPTION_TYPE } from "../subscription/action";
import instance from "../../axios/axiosInstance";
import base64 from 'base64-js';
import store from "../store";



export const ADD_IMAGE_URI = 'IMAGE_URI';
export const CHANGE_USER_NAME = 'CHANGE_USER_NAME';
export const ADD_IMAGE_RESPONSE = 'ADD_IMAGE_RESPONSE';
export const ADD_USER_ID = 'ADD_USER_ID';
export const ADD_USER_PHONE_NUMBER = 'ADD_USER_PHONE_NUMBER';
export const ADD_TOKEN = 'ADD_TOKEN';
export const IS_PROFILE_COMPLETED = 'IS_PROFILE_COMPLETED';
export const COMPLAINTS_DATA = 'COMPLAINTS_DATA';
export const COMPLAINT = 'COMPLAINT';



export const changeUserName = (userId:string | undefined) => {
  return async (dispatch:Dispatch) => {
      try {
        const response = await instance.post('/fetchUserDetails', {userId});

        if (response.status === 200) {
          const {userData, imageBuffer} = await response.data;

          const base64Image = base64.fromByteArray(imageBuffer.data);
          const imageUrl = `data:image/jpeg;base64,${base64Image}`;

          const {
            phoneNumber,
            userName,
            isSubscribed,
            subScriptionType,
            subscriptionEndTime,
          } = userData;

          dispatch({
            type: CHANGE_USER_NAME,
            payload: userName,
          });
          dispatch({
            type: ADD_USER_PHONE_NUMBER,
            payload: phoneNumber,
          });
          dispatch({
            type: IS_SUBSCRIBED,
            payload: isSubscribed,
          });
          dispatch({
            type: SUBSCRIPTION_TYPE,
            payload: subScriptionType,
          });
          dispatch({
            type: SUBSCRIPTION_END_TIME,
            payload: subscriptionEndTime,
          });

          dispatch({
            type: ADD_IMAGE_URI,
            payload: imageUrl,
          });
        } else {
          console.log('Something occured');
        }
      } catch (error) {}
      
    }  
       
};

export const fetchUserComplaints = (userId:string | undefined) => {
   return async (dispatch : Dispatch) => {
     try{
      const response = await instance.post("/user/fetchComplaint", {userId});
                  
        if (response.status === 200) {
          const complaintsData = await response.data;
         
          console.log("=========",complaintsData);
          dispatch({
              type:COMPLAINTS_DATA,
              payload:complaintsData,
          })
                          
        }
     }
     catch(error){

     }
   }
};

export const addImageResponse = (response: object) => ({
       type: ADD_IMAGE_RESPONSE,
       payload: response,
});


export const addToken = (token : string | null) =>({
       type: ADD_TOKEN,
       payload: token,
});


export const setProfileCompleted = (isProfile: boolean | null) => ({
     type:IS_PROFILE_COMPLETED,
     payload:isProfile,
})


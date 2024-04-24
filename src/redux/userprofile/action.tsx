import axios from "axios";
import { Dispatch } from "redux";
import RNFetchBlob from "rn-fetch-blob";

export const ADD_IMAGE_URI = 'IMAGE_URI';
export const CHANGE_USER_NAME = 'CHANGE_USER_NAME';
export const ADD_IMAGE_RESPONSE = 'ADD_IMAGE_RESPONSE';
export const ADD_USER_ID = 'ADD_USER_ID';
export const ADD_USER_PHONE_NUMBER = 'ADD_USER_PHONE_NUMBER';
export const ADD_TOKEN = 'ADD_TOKEN';
 


export const addImageUri = (userId:string,token:string) => {
     return async (dispatch:Dispatch) => {
       const response = await RNFetchBlob.fetch(
              'POST' , 
              'http://10.0.2.2:3000/fetchUserProfile',
              {
                'Content-Type' : 'application/json' , 
                'Authorization': `Bearer ${token}`,
              },
              JSON.stringify({userId})
            );

  
      if(response.data){
              const imageData = response.data;
              const image = `data:image/jpeg;base64,${imageData.toString('base64')}`;
              dispatch({
                     type: ADD_IMAGE_URI,
                     payload: image,
              });  
    
       }
       else{
              console.log("Something occured");
    
       }
     }  
       
};

export const changeUserName = (userId:string , token:string) => {
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
                const{phoneNumber , userName} = responseData;
                dispatch({
                     type: CHANGE_USER_NAME,
                     payload: userName,
                })
              }
              else{
                console.log("Something occured");
                
              }

    }  
       
};


export const addImageResponse = (response: object) => ({
       type: ADD_IMAGE_RESPONSE,
       payload: response,
});


export const addUserPhoneNumber = (userId:string,token:string) => {
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
                       const{phoneNumber , userName} = responseData;
                       dispatch({
                            type: ADD_USER_PHONE_NUMBER,
                            payload: phoneNumber
                       })
                     }
                     else{
                       console.log("Something occured");
                       
                     }
       
       }     
      
};

export const addToken = (token : string) =>({
       type: ADD_TOKEN,
       payload: token,
});

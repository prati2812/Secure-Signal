import axios from "axios";
import { Dispatch } from "redux";
import instance from "../../axios/axiosInstance";


export const FETCH_LOCATIONS = 'FETCH_LOCATIONS';
export const NEAREST_POLICE_STATION_LOCATION = 'NEAREST_POLICE_STATION_LOCATION';
export const NEAREST_HOSPITAL_LOCATION = 'NEAREST_HOSPITAL_LOCATION';

export const fetchLocation = (userId:string | undefined) => {
    
    return async (dispatch : Dispatch) => {
      const response = await instance.post('/fetchTravellingLocations', {userId});

      if(response.status === 200){
         dispatch({
            type:FETCH_LOCATIONS,
            payload: response.data,
         })
      }
      else{
        console.log("something occured");
         
      }
    }

    
}


export const findNearestPoliceStation = (userId:string | undefined) => {
    return async(dispatch : Dispatch) => {
      
      const response = await instance.post('/nearestPoliceStation',{userId});

      if(response.status === 200){
            const responseData = await response.data;
            console.log(responseData);
               
            dispatch({
               type:NEAREST_POLICE_STATION_LOCATION,
               payload:responseData,
            });       
      }
      else{
         console.log("Something went to wrong");
         
      }
    }
}
    
export const findNearestHospital = (userId:string | undefined) => {
   return async(dispatch : Dispatch) => {
     
     const response = await instance.post('/nearestHospital',{userId});

     if(response.status === 200){
           const responseData = await response.data;
           console.log("=====",responseData);
              
           dispatch({
              type:NEAREST_HOSPITAL_LOCATION,
              payload:responseData,
           });       
     }
     else{
        console.log("Something went to wrong");
        
     }
   }
}

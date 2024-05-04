import axios from "axios";
import { Dispatch } from "redux";

export const FETCH_LOCATIONS = 'FETCH_LOCATIONS';
export const NEAREST_POLICE_STATION_LOCATION = 'NEAREST_POLICE_STATION_LOCATION';

export const fetchLocation = (userId:string , token:string) => {
    
    return async (dispatch : Dispatch) => {
      const response = await axios.post('http://10.0.2.2:3000/fetchTravellingLocations', {
        userId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });

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


export const findNearestPoliceStation = (userId:string) => {
    return async(dispatch : Dispatch) => {
      const response = await axios.post('http://10.0.2.2:3000/nearestPoliceStation',{
        userId},{
          headers: {
            'Content-Type': 'application/json', 
          },            
      });

      if(response.status === 200){
            const responseData = await response.data;   
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
    

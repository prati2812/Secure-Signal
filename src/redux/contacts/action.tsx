import axios from "axios";
import { Dispatch } from "redux";

export const ADD_CONTACTS = 'ADD_CONTACTS';
export const ADD_SELECTED_CONTACTS = 'ADD_SELECTED_CONTACTS';
export const REMOVE_SELECTED_CONTACTS = 'REMOVE_SELECTED_CONTACTS';
export const ADD_MATCHING_CONTACTS = 'ADD_MATCHING_CONTACTS';
export const UPDATED_CONTACT_LIST = 'UPDATED_CONTACT_LIST';


export const addContact = (contacts: any) => ({
    type:ADD_CONTACTS,
    payload: contacts,
})

export const addSelectedContact = (userId:string , token:string) =>{

    return async (dispatch:Dispatch)=>{

        const response = await axios.post('http://10.0.2.2:3000/fetchContacts', {
            userId,
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
    
           if(response.status === 200){
    
            const responseData = await response.data;
            const {contacts} = responseData;
            dispatch({
               type: ADD_SELECTED_CONTACTS,
               payload: contacts,
            });
           }
           else{
              console.log("something occured");
               
           }
          
    }  

    
};

export const removeSelectedContact = (userId:string , contact:Object,token:string) => {
   return async (dispatch: Dispatch) => {
    const response = await axios.post('http://10.0.2.2:3000/removeSelectedContact',{
      userId , contact},
      {
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       },
     });
   
     if(response.status === 200){
      dispatch({
        type:REMOVE_SELECTED_CONTACTS,
        payload: contact.recordID,    
      })  
    }
    else{
      console.log("something occured");
    }
  }   
    
    
}

export const addMatchingContacts = (userId:string, contacts:Object[], token:string) => {
    return async (dispatch: Dispatch) => {
      const response = await axios.post('http://10.0.2.2:3000/findMatchingContacts',{
         userId , contacts},
         {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if(response.status === 200){
           const matchingUsers = await response.data;
           dispatch({
             type: ADD_MATCHING_CONTACTS,
             payload: matchingUsers,
           });
        }
    }
   
}


export const updateContactList = (contacts:any) => ({
   type: UPDATED_CONTACT_LIST,
   payload: contacts,
})





import axios from "axios";
import { Dispatch } from "redux";
import instance from "../../axios/axiosInstance";


export const ADD_CONTACTS = 'ADD_CONTACTS';
export const ADD_SELECTED_CONTACTS = 'ADD_SELECTED_CONTACTS';
export const REMOVE_SELECTED_CONTACTS = 'REMOVE_SELECTED_CONTACTS';
export const ADD_MATCHING_CONTACTS = 'ADD_MATCHING_CONTACTS';
export const UPDATED_CONTACT_LIST = 'UPDATED_CONTACT_LIST';
export const GET_SELECTED_CONTACTS_LIST = 'GET_SELECTED_CONTACTS_LIST';


export const addContact = (contacts: any) => ({
    type:ADD_CONTACTS,
    payload: contacts,
})

export const addSelectedContact = (userId:string | undefined) =>{

    return async (dispatch:Dispatch)=>{

        const response = await instance.post('/fetchContacts', {userId});
    
           if(response.status === 200){
    
            const responseData = await response.data;
            const {contacts} = responseData;
            
            
            dispatch({
               type: GET_SELECTED_CONTACTS_LIST,
               payload: contacts,
            });
           }
           else{
              console.log("something occured");
               
           }
          
    }  

    
};

export const removeSelectedContact = (userId:string | undefined, contact:Object) => {
   return async (dispatch: Dispatch) => {
    const response = await instance.post('/removeSelectedContact',{userId , contact});
   
     if(response.status === 200){
      dispatch({
        type:REMOVE_SELECTED_CONTACTS,
        payload: contact.recordID,    
      })  
    }
    else{
     
    }
  }   
    
    
}

export const addMatchingContacts = (userId:string|undefined, contacts:Object[]) => {
    return async (dispatch: Dispatch) => {
      const response = await instance.post('findMatchingContacts',{userId , contacts});
        
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





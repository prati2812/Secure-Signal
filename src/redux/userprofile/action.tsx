export const ADD_IMAGE_URI = 'IMAGE_URI';
export const CHANGE_USER_NAME = 'CHANGE_USER_NAME';
export const ADD_IMAGE_RESPONSE = 'ADD_IMAGE_RESPONSE';
export const ADD_USER_ID = 'ADD_USER_ID';
export const ADD_USER_PHONE_NUMBER = 'ADD_USER_PHONE_NUMBER';
export const ADD_TOKEN = 'ADD_TOKEN';
 


export const addImageUri = (uri:string) => ({
       type: ADD_IMAGE_URI,
       payload: uri,
});

export const changeUserName = (name : string) => ({
       type: CHANGE_USER_NAME,
       payload: name,
});


export const addImageResponse = (response: object) => ({
       type: ADD_IMAGE_RESPONSE,
       payload: response,
});

export const addUserId = (userId: string) => ({
       type: ADD_USER_ID,
       payload: userId,
});

export const addUserPhoneNumber = (phoneNumber: object) => ({
       type: ADD_USER_PHONE_NUMBER,
       payload: phoneNumber
});

export const addToken = (token : string) =>({
       type: ADD_TOKEN,
       payload: token,
});

export const ADD_VERIFICATION_ID = 'ADD_VERIFICATION_ID';

export const addVerificationId = (id:string) => ({
    type: ADD_VERIFICATION_ID,
    payload: id,
});
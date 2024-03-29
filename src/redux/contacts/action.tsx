export const ADD_SELECTED_CONTACTS = 'ADD_SELECTED_CONTACTS';
export const REMOVE_SELECTED_CONTACTS = 'REMOVE_SELECTED_CONTACTS';

export const addSelectedContact = (contact) =>({
       type:ADD_SELECTED_CONTACTS,
       payload: contact,
});

export const removeSelectedContact = (contactId) => ({
       type:REMOVE_SELECTED_CONTACTS,
       payload: contactId,
})
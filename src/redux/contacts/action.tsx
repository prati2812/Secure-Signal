export const ADD_SELECTED_CONTACTS = 'ADD_SELECTED_CONTACTS';
export const REMOVE_SELECTED_CONTACTS = 'REMOVE_SELECTED_CONTACTS';
export const ADD_CONTACTS = 'ADD_CONTACTS';



export const addContact = (contacts) => ({
       type:ADD_CONTACTS,
       payload: contacts,
})


export const addSelectedContact = (contact) =>({
       type:ADD_SELECTED_CONTACTS,
       payload: contact,
});

export const removeSelectedContact = (contactId) => ({
       type:REMOVE_SELECTED_CONTACTS,
       payload: contactId,
})
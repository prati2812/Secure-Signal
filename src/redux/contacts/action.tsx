export const ADD_CONTACTS = 'ADD_CONTACTS';
export const ADD_SELECTED_CONTACTS = 'ADD_SELECTED_CONTACTS';
export const REMOVE_SELECTED_CONTACTS = 'REMOVE_SELECTED_CONTACTS';
export const ADD_MATCHING_CONTACTS = 'ADD_MATCHING_CONTACTS';


export const addContact = (contacts: any) => ({
    type:ADD_CONTACTS,
    payload: contacts,
})

export const addSelectedContact = (contact: any) =>({

    type:ADD_SELECTED_CONTACTS,
    payload: contact,
});

export const removeSelectedContact = (contactId: any) => ({
    type:REMOVE_SELECTED_CONTACTS,
    payload: contactId,
})

export const addMatchingContacts = ( matchedContacts: any) => ({
    type: ADD_MATCHING_CONTACTS,
    payload: matchedContacts,
})
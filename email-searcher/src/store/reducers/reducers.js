// This file exports all the reducer files
// to one file to be imported as root reducer.

export { default as appReducer } from './reducers/app';
export { default as searchReducer } from './reducers/search';
export { default as userAuthenticationReducer } from './reducers/userAuthentication';
export { default as userEmailsReducer } from './reducers/userEmails';
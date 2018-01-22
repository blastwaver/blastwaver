import { User } from "./models/user";
import { UPDATE_USER, UPDATE_USER_ERROR, LOG_IN_STATE, UPDATE_FRIENDS } from './actions';

export interface IAppState {
    user: User;
    error: string;
    logInStatus: boolean;
    friends: Array<Object>
}

export const INITIAL_STATE :IAppState = { 
    user: {
        _id:"qqq",
        googleId:"qqq",
        username:"qqq",
        email:"qqq",
        photoUrl:"qqqW"
    },
    error: "",
    logInStatus: false,
    friends: []
}

export function rootReducer(state :IAppState, action): IAppState {

    switch(action.type) {
        case UPDATE_USER: return {...state, user: action.body};
        case UPDATE_USER_ERROR: return {...state, error: action.body};
        case LOG_IN_STATE: return {...state, logInStatus: action.body};
        case UPDATE_FRIENDS: return {...state, friends: action.body};  
    }
    return state;
}

function updateUser (state, action) {
    // console.log(action.body);
    // console.log({...state, user:action.body})
    return {...state, user: action.body}
}
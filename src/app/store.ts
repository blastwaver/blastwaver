import { User } from "./models/user";
import { UPDATE_USER, UPDATE_USER_ERROR, USER_LOG_IN, UPDATE_FRIENDS, USER_LOG_OUT } from './actions';

export interface IAppState {
    user: User;
    error: string;
    loginState: boolean;
    friends: Array<Object>
}

export const INITIAL_STATE :IAppState = { 
    user: {
        _id: null,
        googleId:null,
        username:null,
        email:null,
        photoUrl:null,
        cProfile: false,
    },
    error: "",
    loginState: false,
    friends: []
}

export function rootReducer(state :IAppState, action): IAppState {

    switch(action.type) {
        case UPDATE_USER: return {...state, user: action.body};
        case UPDATE_USER_ERROR: return {...state, error: action.body};
        case USER_LOG_IN: return {...state, loginState: true};
        case USER_LOG_OUT: return {...state, loginState: false};
        case UPDATE_FRIENDS: return {...state, friends: action.body};  
    }
    return state;
}

function updateUser (state, action) {
    // console.log(action.body);
    // console.log({...state, user:action.body})
    return {...state, user: action.body}
}
import { createStore } from 'redux';

const initialState = {
    user: null
}

const reducer = (state = initialState, action) => {
    if(action.type === "UPDATE_USER") {
        return Object.assign({}, state, {
            user: action.payload
        });
    }
    return state
}

const store = createStore(reducer);


export default store;
import { createStore } from 'redux';

const initialState = {
    user: null,
    searchText: "",
    currentTopicName: "",
}

const reducer = (state = initialState, action) => {
    if(action.type === "SET_USER") {
        return Object.assign({}, state, {
            user: action.payload
        });
    }
    if(action.type === "SET_SEARCHTEXT") {
        return Object.assign({}, state, {
            searchText: action.payload
        });
    }
    if(action.type === "SET_CURRENT_TOPIC_NAME") {
        return Object.assign({}, state, {
            currentTopicName: action.payload
        });
    }
    return state
}

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


export default store;
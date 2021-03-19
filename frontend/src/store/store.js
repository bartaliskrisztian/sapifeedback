import { createStore } from 'redux'

const initialState = {
    user: null,
    searchText: "",
    currentTopicName: "",
    isLoggedIn: false,
    showArchivedTopics: false,
    userTopics: []
}

const reducer = (state = initialState, action) => {
    if(action.type === "SET_USER") {
        return Object.assign({}, state, {
            user: action.payload
        })
    }
    if(action.type === "SET_SEARCHTEXT") {
        return Object.assign({}, state, {
            searchText: action.payload
        })
    }
    if(action.type === "SET_CURRENT_TOPIC_NAME") {
        return Object.assign({}, state, {
            currentTopicName: action.payload
        })
    }
    if(action.type === "SET_IS_LOGGED_IN") {
        return Object.assign({}, state, {
            isLoggedIn: action.payload
        })
    }
    if(action.type === "SET_SHOW_ARCHIVED_TOPICS") {
        return Object.assign({}, state, {
            showArchivedTopics: action.payload
        })
    }
    if(action.type === "SET_USER_TOPICS") {
        return Object.assign({}, state, {
            userTopics: action.payload
        })
    }
    return state
}

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)


export default store
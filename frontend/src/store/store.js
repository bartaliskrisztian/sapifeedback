import { createStore } from 'redux'

const initialState = {
    appTheme: 'dark',
    user: null,
    searchText: "",
    currentTopicName: "",
    showArchivedTopics: false,
    userTopics: [],
    currentTopicDetails: {},
    currentTopicFeedbacks: [],
}

const reducer = (state = initialState, action) => {
    if(action.type === "SET_USER") {
        return Object.assign({}, state, {
            user: action.payload
        })
    }
    if(action.type === "SET_THEME") {
        return Object.assign({}, state, {
            appTheme: action.payload
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
    if(action.type === "SET_CURRENT_TOPIC_DETAILS") {
        return Object.assign({}, state, {
            currentTopicDetails: action.payload
        })
    }
    if(action.type === "SET_CURRENT_TOPIC_FEEDBACKS") {
        return Object.assign({}, state, {
            currentTopicFeedbacks: action.payload
        })
    }
    return state
}

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)


export default store
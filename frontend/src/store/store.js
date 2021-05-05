import { createStore } from 'redux'

const initialState = {
    appTheme: 'dark',
    user: null,
    searchText: "",
    currentTopicName: "",
    loginMessage: "",
    isLoggedIn: false,
    showArchivedTopics: false,
    userTopics: [],
    currentTopicId: null,
    currentTopicDetails: {},
    currentTopicReports: [],
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
    if(action.type === "SET_LOGIN_MESSAGE") {
        return Object.assign({}, state, {
            loginMessage: action.payload
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
    if(action.type === "SET_CURRENT_TOPIC_ID") {
        return Object.assign({}, state, {
            currentTopicId: action.payload
        })
    }
    if(action.type === "SET_CURRENT_TOPIC_DETAILS") {
        return Object.assign({}, state, {
            currentTopicDetails: action.payload
        })
    }
    if(action.type === "SET_CURRENT_TOPIC_REPORTS") {
        return Object.assign({}, state, {
            currentTopicReports: action.payload
        })
    }
    if(action.type === "RESET_STATE") {
        return Object.assign({}, state, {
            user: null,
            searchText: "",
            currentTopicName: "",
            isLoggedIn: false,
            showArchivedTopics: false,
            userTopics: [],
            currentTopicId: null,
            currentTopicDetails: {},
            currentTopicReports: []
        })
    }
    return state
}

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)


export default store
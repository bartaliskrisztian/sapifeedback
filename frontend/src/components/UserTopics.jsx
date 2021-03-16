import React, {useState, useEffect} from "react";

// importing components
import TopicElement from "./TopicElement";  
import TopicSort from "./TopicSort";
import Modal from "react-modal";
import { ToastContainer, toast } from 'react-toastify';
import { connect } from "react-redux";

import {db} from "../database/firebase"; // importing database
import stringRes from "../resources/strings"; // importing language resource file

// importing styles
import 'react-toastify/dist/ReactToastify.css';
import "../assets/css/UserTopics.css";
import CancelIcon from "../assets/images/cancel.svg";

function UserTopics({props, dispatch}) {

    // string resources
    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];
    
    const [modalIsOpen, setIsOpen] = useState(false);
    const [topicName, setTopicName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [userTopics, setUserTopics] = useState(null);
    const [filteredUserTopics, setFilteredUserTopics] = useState([]);
    const [topicSortOption, setTopicSortOption] = useState([{ label: strings.userTopics.sort.unsorted, 
                                                             value: "unsorted" }]);

    // fetching the topics based on the user
    useEffect(() => {
        if(props.user != null) {
            getUserTopics();
        }
        // eslint-disable-next-line
    }, []);

     useEffect(() => {
        callBackendAPI();
        if(userTopics) {
            switch(topicSortOption[0].value) {
                case 'unsorted': 
                    setFilteredUserTopics(userTopics);
                    break;
                case 'a-z': 
                    sortByAbcAsc();
                    break;
                case 'z-a':
                    sortByAbcDesc();
                    break;
                case 'date-asc':
                    sortByDateAsc();
                    break;
                case 'date-desc':
                    sortByDateDesc();
                    break;
                default:
                    break;
            }
        }
        // eslint-disable-next-line
    }, [topicSortOption]);

    const callBackendAPI = async () => {
        const response = await fetch('/');
        const body = await response.json();
    }

    const sortByAbcAsc = () => {
        let sortedTopics = userTopics.sort((a,b) => {
            let la = a[1].topicName.toLowerCase();
            let lb = b[1].topicName.toLowerCase();
            return la < lb ? -1 : lb < la ? 1 : 0;
        })
        setFilteredUserTopics(sortedTopics);
    }

    const sortByAbcDesc = () => {
        let sortedTopics = userTopics.sort((a,b) => {
            let la = a[1].topicName.toLowerCase();
            let lb = b[1].topicName.toLowerCase();
            return la > lb ? -1 : lb > la ? 1 : 0;
        })
        setFilteredUserTopics(sortedTopics);
    }

    const sortByDateAsc = () => {
        let sortedTopics = userTopics.sort((a,b) => {
            let la = a[1].date;
            let lb = b[1].date;
            return la < lb ? -1 : lb < la ? 1 : 0;
        })
        setFilteredUserTopics(sortedTopics);
    }

    const sortByDateDesc = () => {
        let sortedTopics = userTopics.sort((a,b) => {
            let la = a[1].date;
            let lb = b[1].date;
            return la > lb ? -1 : lb > la ? 1 : 0;
        })
        setFilteredUserTopics(sortedTopics);
    }

    const printTopics = (topics) => {
        topics.forEach((t) => console.log(t[1].topicName));
        console.log("\n");
    }

    const getUserTopics = () => {
        db.ref(`topics/${props.user.googleId}`).on("value", (snapshot) => {
            if(snapshot.val()) {
                setUserTopics(Object.entries(snapshot.val()));
                setFilteredUserTopics(Object.entries(snapshot.val()));
            }
            setIsLoading(false);
        });
    }

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);
    const notifyInfo = (message) => toast.info(message);

    const showArchivedTopics = () => {
        dispatch({type: "SET_SHOW_ARCHIVED_TOPICS", payload: !props.showArchivedTopics});
    }

    // functions for modal
    function openModal() {
        setIsOpen(true);
    }
     
    function closeModal(){
        setIsOpen(false);
    }

    const onTopicNameChange = (e) => {
        setTopicName(e.target.value);
    }

    const createTopic = () => {
        if(topicName === "") {
            notifyError(strings.userTopics.modal.errorText.emptyTopicName);
            return false;
        }

        let ok = true;
        userTopics.forEach(topic => {
            if(topic[1].topicName === topicName) {
                notifyError(strings.userTopics.modal.errorText.usedTopicName);
                ok = false;
            }
        });

       
        if(ok) {
            const dbRef = db.ref(`topics/${props.user.googleId}`);
            const uid = dbRef.push().key; // getting a new id for the topic
            const date = Date.now()
            const reportUrl = `${window.location.origin}/#/report/${props.user.googleId}/${uid}`;

            dbRef.child(uid).set({
                date : date,
                topicName: topicName,
                reportUrl: reportUrl
            }).then(closeModal).then(notifySuccess(strings.userTopics.modal.onSuccess)).catch((error) => notifyError(error));
        }
    }

    const FilteredAllTopicElements = () => {
        return(
            filteredUserTopics && [...filteredUserTopics].filter((topic) => {
                return props.searchText === "" ? true :
                topic[1].topicName.toLowerCase().includes(props.searchText.toLowerCase());
                // eslint-disable-next-line
              }).map((topic) => {
                let date = new Date(topic[1].date).toLocaleDateString();
                return(
                    <TopicElement
                        key={topic[0]}
                        type="topic"
                        name={topic[1].topicName}
                        date={date}
                        topicid={topic[0]}
                        userid={props.user.googleId}
                        onArchive={notifySuccess}
                        onCopyToClipboard={notifyInfo}
                        isArchived={topic[1].isArchived}
                    />
                );})
        );
    }

    const FilteredActiveTopicElements = () => {
        return(
            filteredUserTopics && [...filteredUserTopics].filter((topic) => {
                return props.searchText === "" ? true :
                topic[1].topicName.toLowerCase().includes(props.searchText.toLowerCase());
                // eslint-disable-next-line
              }).map((topic) => {
                if(!topic[1].isArchived) {
                    let date = new Date(topic[1].date).toLocaleDateString();
                    return(
                        <TopicElement
                            key={topic[0]}
                            type="topic"
                            name={topic[1].topicName}
                            date={date}
                            topicid={topic[0]}
                            userid={props.user.googleId}
                            onArchive={notifySuccess}
                            onCopyToClipboard={notifyInfo}
                            isArchived={topic[1].isArchived}
                        />
                    );
                }
            })
        );
    }
    

    const modalStyle = {
        overlay: {
            backgroundColor: "#3a3b3c",
        }
    }

    Modal.setAppElement("#root");

    return (
        <div className="topics">
            <Modal
                closeTimeoutMS={500}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="create-topic__modal"
                style={modalStyle}
            >
                <img 
                    src={CancelIcon} 
                    alt="cancel"
                    className="modal__cancel-icon"
                    onClick={closeModal}
                />
                <div className="create-topic__title">{strings.userTopics.modal.title}</div>
                <input 
                    className="create-topic__input" 
                    type="text" 
                    placeholder={strings.userTopics.modal.inputPlaceholder}
                    onChange={onTopicNameChange}
                />
                <button 
                    className="create-topic__button" 
                    type="submit"
                    onClick={createTopic}
                >{strings.userTopics.modal.createButtonText}
                </button>
            </Modal>
            <div className="topic-filter__container">
                <div className="topic-checkbox__container">
                    <input type="checkbox" value="check" className="topic-checkbox" onClick={showArchivedTopics} />
                    <label>{strings.userTopics.showArchivedTopics}</label>
                </div>
                <TopicSort sortOption={topicSortOption} onSortOptionChange={setTopicSortOption} />
            </div>
            <div className="topic-list">
                <div>
                    <TopicElement 
                    type="add" 
                    onClick={openModal} 
                    onClose={closeModal}
                    />
                </div>
                {/* filtering the topics by the searchbar input */}
                {isLoading && <div className="user-topics__loader"></div>}
                {!isLoading && props.showArchivedTopics && <FilteredAllTopicElements />}
                {!isLoading && !props.showArchivedTopics && <FilteredActiveTopicElements />}
                <ToastContainer 
                    position="top-center"
                    pauseOnHover={false}
                    hideProgressBar={true}
                    autoClose={3000}
                    closeOnClick={false}
                />
            </div>
        </div>
    );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
    const props = {
        user: state.user,
        searchText: state.searchText,
        showArchivedTopics: state.showArchivedTopics
    }
    return { props }
}

// getting redux dispatch function for changing global state variables
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTopics);
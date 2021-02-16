import React, {useState, useEffect} from "react";
import TopicElement from "./TopicElement";  
import Modal from "react-modal";
import CancelIcon from "../assets/images/cancel.svg";
import {db} from "../database/firebase";
import strings_EN from "../resources/strings_EN";
import "../assets/css/UserTopics.css";

function UserTopics(props) {

    let strings = strings_EN;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalError, setModalError] = useState("");
    const [topicName, setTopicName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userTopics, setUserTopics] = useState(null);

    // fetching the topics based on the user
    useEffect(() => {
        setIsLoading(true);
        if(props.user != null) {
            getUserTopics();
        }
        setIsLoading(false);
        // eslint-disable-next-line
    }, []);

    const getUserTopics = () => {
        db.ref(`topics/${props.user.googleId}`).on("value", (snapshot) => {
            if(snapshot.val()) {
                setUserTopics(Object.entries(snapshot.val()));
            }
        });
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
        if(modalError !== "") {
            setModalError("");
        }
    }

    const createTopic = () => {
        if(topicName === "") {
            setModalError(strings.userTopics.modal.errorText.emptyTopicName);
            return false;
        }

        let ok = true;
        userTopics.forEach(topic => {
            if(topic[1].topicName === topicName) {
                setModalError(strings.userTopics.modal.errorText.usedTopicName);
                ok = false;
            }
        });

        if(ok) {
            const dbRef = db.ref(`topics/${props.user.googleId}`);
            const uid = dbRef.push().key; // getting a new id for the topic
            const date = Date.now()
            const reportUrl = `${window.location.origin}/report?uid=${props.user.googleId}&topic=${uid}`;

            dbRef.child(uid).set({
                date : date,
                topicName: topicName,
                reportUrl: reportUrl
            }).then(closeModal).catch((error) => setModalError(error));
        }
    }

    Modal.setAppElement("#root");

    if(isLoading) {
        return (
            <div className="topic-loader"></div>
        );
    }
    else {
        return (
            <div className="topics">
                <Modal
                    closeTimeoutMS={500}
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    className="create-topic__modal"
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
                        placeholder="Enter your topic name"
                        onChange={onTopicNameChange}
                    />
                    <div className="create-topic__error">{modalError}</div>
                    <button 
                        className="create-topic__button" 
                        type="submit"
                        onClick={createTopic}
                    >{strings.userTopics.modal.createButtonText}
                    </button>
                </Modal>
                <div className="topics-title">{strings.userTopics.title}</div>
                <div className="topic-list">
                    <div>
                        <TopicElement 
                        type="add" 
                        onClick={openModal} 
                        onClose={closeModal}
                        />
                    </div>
                    {/* filtering the topics by the searchbar input */}
                    {userTopics && userTopics.filter((topic) => {
                      return props.searchText === "" ? true :
                      topic[1].topicName.toLowerCase().includes(props.searchText.toLowerCase());
                      // eslint-disable-next-line
                    }).map((topic) => {
                        if(!topic[1].isArchived) {
                            return(
                                <TopicElement
                                    key={topic[0]}
                                    type="topic"
                                    name={topic[1].topicName}
                                    date={topic[1].date}
                                    topicid={topic[0]}
                                    userid={props.user.googleId}
                                />
                            );
                    }})}
                </div>
            </div>
        );
    }
}

export default UserTopics;
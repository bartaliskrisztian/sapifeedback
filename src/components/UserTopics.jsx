import React, {useState, useEffect} from "react";
import TopicElement from "./TopicElement";  
import Modal from "react-modal";
import CancelIcon from "../assets/images/cancel.svg";
import {db} from "../database/firebase";
import stringRes from "../resources/strings";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../assets/css/UserTopics.css";


function UserTopics(props) {

    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];
    
    const [modalIsOpen, setIsOpen] = useState(false);
    const [topicName, setTopicName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [userTopics, setUserTopics] = useState(null);

    // fetching the topics based on the user
    useEffect(() => {
        if(props.user != null) {
            getUserTopics();
        }
        // eslint-disable-next-line
    }, []);


    const getUserTopics = () => {
        db.ref(`topics/${props.user.googleId}`).on("value", (snapshot) => {
            if(snapshot.val()) {
                setUserTopics(Object.entries(snapshot.val()));
            }
            setIsLoading(false);
        });
    }

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

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
            }).then(closeModal).then(notifySuccess("Sikeresen létrehozta a témát")).catch((error) => notifyError(error));
        }
    }

    const FilteredTopicElements = () => {
        return(
            userTopics && [...userTopics].filter((topic) => {
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
              }})
        );
    }

    Modal.setAppElement("#root");

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
                {!isLoading && <FilteredTopicElements />}
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

export default UserTopics;
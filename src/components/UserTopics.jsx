import React, {useState, useEffect} from "react";
import TopicElement from "./TopicElement";  
import Modal from "react-modal";
import CancelIcon from "../assets/images/cancel.svg";
import {db} from "../database/firebase";
import "../assets/css/UserTopics.css";

function UserTopics(props) {

    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalError, setModalError] = useState("");
    const [topicName, setTopicName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userTopics, setUserTopics] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        getUserTopics();
        setIsLoading(false);
        // eslint-disable-next-line
    }, []);

    const getUserTopics = () => {
        db.ref(`topics/${props.user.googleId}`).on("value", (snapshot) => {
            setUserTopics(Object.entries(snapshot.val()));
        });
    }

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

    const createTopic = async () => {
        if(topicName === "") {
            setModalError("enter your topic name");
            return;
        }

        const dbRef = db.ref(`topics/${props.user.googleId}`);

        const uid = dbRef.push().key;
        const date = Date.now()

        await dbRef.child(uid).set({
            date : date,
            topicName: topicName
        }).then(closeModal).catch((error) => setModalError(error));
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
                    <div className="create-topic__title">Create a topic</div>
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
                    >Create
                    </button>
                </Modal>
                <div className="topics-title">Your topics</div>
                <div className="topic-list">
                    <div>
                        <TopicElement 
                        type="add" 
                        onClick={openModal} 
                        onClose={closeModal}
                        />
                    </div>
                    {userTopics.map((topic) => (
                    <TopicElement
                        key={topic[0]}
                        type="topic"
                        name={topic[1].topicName}
                        date={topic[1].date}
                    />))}
                </div>
            </div>
        );
    }
}

export default UserTopics;
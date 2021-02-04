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

    useEffect(() => {
        getUserTopics();
    }, []);

    const getUserTopics = () => {
        //db.ref("topics").
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
        }).catch((error) => setModalError(error));
        //db.ref(`topics/${props.user.googleId}`).once("value").then( (snapshot) => console.log(snapshot.val()))
    }

    Modal.setAppElement("#root");

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
            <div>
                <TopicElement 
                type="add" 
                onClick={openModal} 
                onClose={closeModal}
                />
            </div>
            
        </div>
    );
}

export default UserTopics;
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {db} from "../database/firebase";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import CancelIcon from "../assets/images/cancel.svg";
import DeleteIcon from "../assets/images/trash.svg";
import "../assets/css/Topic.css";

function Topic() {

    let history = useHistory();
    const [topicName, setTopicName] = useState("");
    const [topicDate, setTopicDate] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    const params = useParams();
    const userGoogleId = params.userid;
    const topicId = params.topicid;

    useEffect(() => {
        getTopicDetails();
        // eslint-disable-next-line
    }, []);

    function openModal() {
        setIsOpen(true);
    }
     
    function closeModal(){
        setIsOpen(false);
    }

    const getTopicDetails = () => {
        db.ref(`topics/${userGoogleId}/${topicId}`).on("value", (snapshot) => {
            if(snapshot.val()) {
                setTopicName(snapshot.val().topicName);
                setTopicDate(snapshot.val().topicDate);
            }
        });
    }

    const deleteTopic = () => {
        db.ref(`topics/${userGoogleId}/${topicId}`).remove().then(() => history.push("/"));
    }

    return (
        <div className="topic-detail">
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="delete-topic__modal"
            >
                <img 
                    src={CancelIcon} 
                    alt="cancel"
                    className="modal__cancel-icon"
                    onClick={closeModal}
                />
                <div className="delete-topic__title">Are you sure you want to delete this topic?</div>
                <div className="delete-topic__button-holder">
                    <button className="delete-topic__button" onClick={deleteTopic}>Delete</button>
                    <button  className="delete-topic__button" onClick={closeModal}>Cancel</button>
                </div>
            </Modal>
            <div className="topic-detail__title">{topicName}</div >
            <button 
                type="submit" 
                className="delete-topic__button"
                onClick={openModal}
            >
            <img className="trash-icon" alt="trash-icon" src={DeleteIcon} />
            Delete topic</button>
        </div>
    );
}

export default Topic;
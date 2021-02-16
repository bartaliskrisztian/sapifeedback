import React, {useEffect, useState} from "react";
import {db} from "../database/firebase";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import CancelIcon from "../assets/images/cancel.svg";
//import DeleteIcon from "../assets/images/trash.svg";
import "../assets/css/Topic.css";

function Topic() {

    const history = useHistory();

    // for displaying the modal
    const [modalIsOpen, setIsOpen] = useState(false);

    const [userGoogleId, setUserGoogleId] = useState(null);
    const [topicId, setTopicId] = useState(null);

    const [topicName, setTopicName] = useState("");
    const [topicDate, setTopicDate] = useState("");

    // fetching the details of a topic before rendering
    useEffect(() => {
        // getting the url parameters
        const params = new URLSearchParams(history.location.search);
        const userid = params.get("user");
        const topicid = params.get("topic");
        
        if(userid !== undefined && topicid !== undefined) {
            setUserGoogleId(userid);
            setTopicId(topicid);
            getTopicDetails(userid, topicid);
        }
        else {
            history.push("/");
        }
    
        // eslint-disable-next-line
    }, []);

    function openModal() {
        setIsOpen(true);
    }
     
    function closeModal(){
        setIsOpen(false);
    }

    const getTopicDetails = (userGoogleId, topicId) => {
        db.ref(`topics/${userGoogleId}/${topicId}`).on("value", (snapshot) => {
            if(snapshot.val()) {
                setTopicName(snapshot.val().topicName);
                setTopicDate(snapshot.val().topicDate);
            }
        });
    }

    // deleting one topic from db, then going back to homepage
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
            {/* <button 
                type="submit" 
                className="delete-topic__button"
                onClick={openModal}
            >
            <img className="trash-icon" alt="trash-icon" src={DeleteIcon} />
            Delete topic</button> */}
        </div>
    );
}

export default Topic;
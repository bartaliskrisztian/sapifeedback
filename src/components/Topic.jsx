import React, {useEffect, useState} from "react";
import {db} from "../database/firebase";
import { useHistory, useParams } from "react-router-dom";
import Modal from "react-modal";
import Reports from "./Reports";

import CancelIcon from "../assets/images/cancel.svg";
//import DeleteIcon from "../assets/images/trash.svg";
import "../assets/css/Topic.css";

function Topic() {

    const history = useHistory();
    const params = useParams();

    // for displaying the modal
    const [modalIsOpen, setIsOpen] = useState(false);

    const [topicExists, setTopicExists] = useState(true);

    const [userGoogleId, setUserGoogleId] = useState(null);
    const [topicId, setTopicId] = useState(null);

    const [topicName, setTopicName] = useState("");
    const [topicDate, setTopicDate] = useState("");
    const [topicReports, setTopicReports] = useState([]);

    // fetching the details of a topic before rendering
    useEffect(() => {

        // getting the url parameters        
        const userid = params.userId;
        const topicid = params.topicId;
        
        if(userid !== undefined && topicid !== undefined) {
            setUserGoogleId(userid);
            setTopicId(topicid);
            getTopicDetails(userid, topicid);
        }
        else {
            history.push("/");
        }
        // eslint-disable-next-line
    }, [params]);

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
                getTopicReports(topicId);
            }
            else {
                setTopicExists(false);
            }
        });
    }

    const getTopicReports = (topicId) => {
        db.ref(`reports/${topicId}`).on("value", (snapshot) => {
            if(snapshot.val()) {
                setTopicReports(Object.values(snapshot.val()));
            }
            else
            {
                console.log("rip");
            }
        });
    }

    // deleting one topic from db, then going back to homepage
    const deleteTopic = () => {
        db.ref(`topics/${userGoogleId}/${topicId}`).remove().then(() => history.push("/"));
    }

    if(topicExists) {
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
                <Reports reports={topicReports} />
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
    else {
        return(
            <div className="topic-detail">
                <h1 className="topic-detail__notexists">Nem létezik ez a téma.</h1>
            </div>
        );
    }
    
}

export default Topic;
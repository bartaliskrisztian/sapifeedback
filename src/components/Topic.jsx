import React, {useEffect, useState} from "react";
import { useHistory, useParams } from "react-router-dom";

// importing components
import Modal from "react-modal";
import Reports from "./Reports";
import { connect } from "react-redux";

import {db} from "../database/firebase"; // importing database
import stringRes from "../resources/strings"; // importing language resource file

// importing styles
import "../assets/css/Topic.css";
import CancelIcon from "../assets/images/cancel.svg";
import DeleteIcon from "../assets/images/trash.svg";

function Topic({dispatch}) {

    // string resources
    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];

    const history = useHistory();
    const params = useParams();

    // for displaying the modal
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [topicExists, setTopicExists] = useState(true);
    const [topicPage, setTopicPage] = useState(0);

    const [userGoogleId, setUserGoogleId] = useState(null);
    const [topicId, setTopicId] = useState(null);

    const [topic, setTopic] = useState({});
    const [topicReports, setTopicReports] = useState([]);

    // fetching the details of a topic before rendering
    useEffect(() => {
        const abortController = new AbortController();

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

        return function cleanup() {
            abortController.abort();
        }
        // eslint-disable-next-line
    }, [params]);


    useEffect(() => {
        const page = new URLSearchParams(history.location.search).get("page");
        setTopicPage(page);        
        // eslint-disable-next-line
    }, [history.location.search]);

    function openModal() {
        setIsOpen(true);
    }
     
    function closeModal(){
        setIsOpen(false);
    }

    const getTopicDetails = (userGoogleId, topicId) => {
        db.ref(`topics/${userGoogleId}/${topicId}`).on("value", (snapshot) => {
            if(snapshot.val()) {
                dispatch({type: "SET_CURRENT_TOPIC_NAME", payload: snapshot.val().topicName});

                setTopic(snapshot.val());
                getTopicReports(topicId);

                setIsLoading(false);    
            }
            else {
                setTopicExists(false);
                setIsLoading(false);
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
                setTopicReports([]);
            }
        });
    }

    // deleting one topic from db, then going back to homepage
    const deleteTopic = () => {
        db.ref(`topics/${userGoogleId}/${topicId}`).remove().then(() => history.push("/"));
    }

    const DeleteTopicModal = () => {
        return(
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
                <div className="delete-topic__title">{strings.topic.deleteModal.title}</div>
                <div className="delete-topic__button-holder">
                    <button className="delete-topic__button" onClick={deleteTopic}>{strings.topic.deleteModal.deleteButtonText}</button>
                    <button  className="delete-topic__button" onClick={closeModal}>{strings.topic.deleteModal.cancelButtonText}</button>
                </div>
            </Modal>
        );
    }

    const TopicLink = () => {
        return(
            <div>
                <ul>
                    <li>
                        {strings.topic.reports.reportUrl}: 
                        <a 
                            href={topic.reportUrl} 
                            target="blank"
                            className="topic-detail__reportUrl"
                        >
                            {topic.reportUrl}
                        </a>
                    </li>
                </ul>
            </div>
        );
    }

    const ReportsTable = () => {
        if(topicReports.length > 0) {
            return(
                <Reports reports={topicReports} />
            );
        }
        else {
            return(
                <h1 className="topic__no-reports">{strings.topic.noReports}</h1>
            );
        }
    }

    const DeleteTopicButton = () => {
        <button 
            type="submit" 
            className="delete-topic__button"
            onClick={openModal}
        >
        <img className="trash-icon" alt="trash-icon" src={DeleteIcon} />
            {strings.topic.deleteButtonText}
        </button>
    }

    if(topicExists) {
        return (
            <div className="topic-detail">
                <DeleteTopicModal />
                {topicPage == 0 && <TopicLink />}
                {!isLoading && topicPage == 0  && <ReportsTable />}
                {isLoading && <div className="topic-loader"></div>}
                {topicPage == 1  && <div></div>}
            </div>
        );
    }
    else {
        return(
            <div className="topic-detail">
                <h1 className="topic-detail__notexists">{strings.topic.notExistsText}</h1>
            </div>
        );
    }
    
}

// getting redux dispatch function for changing global state variables
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapDispatchToProps)(Topic);
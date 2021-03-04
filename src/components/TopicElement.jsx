import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {db} from "../database/firebase";
import AddIcon from "../assets/images/plus.svg";
import MoreIcon from "../assets/images/more.svg";
import stringRes from "../resources/strings";

function TopicElement(props) {

    let history = useHistory();
    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];
    const [showMoreDropdown, setShowMoreDropwdown] = useState(false);

    const onTopicClicked = () => {
        history.push(`/topic/${props.userid}/${props.topicid}?page=0`);
    }

    const archiveTopic= () => {
        db.ref(`topics/${props.userid}/${props.topicid}`).update({isArchived: 'true'});
    }

    const copyUrlToClipboard = () => {
        let topicUrl = getTopicUrl();
        var textarea = document.createElement("textarea");
        document.body.appendChild(textarea);
        textarea.value = topicUrl;
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setShowMoreDropwdown(false);
    }

    const getTopicUrl = () => {
        let url = null;
        db.ref(`topics/${props.userid}/${props.topicid}/reportUrl`).on("value", (snapshot) => {
            if(snapshot.val()) {
                url = snapshot.val();
            }
        });
        return url;
    }

    const AddTopicCard = () => {
        return(
            <div className="topic-add" onClick={props.onClick}>
                <img 
                src={AddIcon} 
                alt="add topic"
                className="add-icon"
                />
                <div>{strings.userTopics.createTopicText}</div>
            </div>
        );
    }

    const TopicCard = () => {
        return(
            <div className="topic-element__content">
                <img
                    src={MoreIcon}
                    alt="more" 
                    className="topic__more-icon" 
                    onClick={() => setShowMoreDropwdown(!showMoreDropdown)} 
                />
                <div className={`topic-element__dropdown${showMoreDropdown ? " open" : ""}`}>
                    <div 
                        className="more-dropdown__element"
                        onClick={archiveTopic}
                    >{strings.userTopics.menu.archive}
                    </div>
                    <div className="more-dropdown__element" onClick={copyUrlToClipboard}>
                        {strings.userTopics.menu.copyLink}
                    </div>
                </div>
                <div className="topic-element__content-elements" onClick={onTopicClicked}>
                    <div className="topic-element__name">{props.name}</div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="topic-element" 
        >
            {props.type === "add" && <AddTopicCard />}
            {props.type === "topic" && <TopicCard />}
        </div>
    );
}

export default TopicElement;
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {db} from "../database/firebase";
import AddIcon from "../assets/images/plus.svg";
import MoreIcon from "../assets/images/more.svg";

function TopicElement(props) {

    let history = useHistory();
    const [showMoreDropdown, setShowMoreDropwdown] = useState(false);

    const onTopicClicked = () => {
        history.push(`/topic?user=${props.userid}&topic=${props.topicid}`);
    }

    const archiveTopic= () => {
        db.ref(`topics/${props.userid}/${props.topicid}`).update({isArchived: 'true'});
    }

    return (
        <div
            className="topic-element" 
        >
            {props.type === "add" && 
            <div className="topic-add" onClick={props.onClick}>
                <img 
                src={AddIcon} 
                alt="add topic"
                className="add-icon"
                />
                <div>Create topic</div>
            </div>}
            {props.type === "topic" &&
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
                        >Archive</div>
                    </div>
                    <div className="topic-element__content-elements" onClick={onTopicClicked}>
                        <div className="topic-element__name">{props.name}</div>
                    </div>
                </div>
            }
        </div>
    );
}

export default TopicElement;
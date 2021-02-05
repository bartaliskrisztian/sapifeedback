import React from "react";
import {useHistory} from "react-router-dom";
import AddIcon from "../assets/images/plus.svg";

function TopicElement(props) {

    let history = useHistory();

    const onTopicClicked = () => {
        history.push(`/topic/${props.userid}/${props.topicid}`);
    }

    return (
        <div
            className="topic-element" 
            onClick={props.type === "add" ? props.onClick : onTopicClicked}
        >
            {props.type === "add" && 
            <div className="topic-add">
                <img 
                src={AddIcon} 
                alt="add topic"
                className="add-icon"
                />
                <div>Create topic</div>
            </div>}
            {props.type === "topic" &&
                <div className="topic-element__name">{props.name}</div>
            }
        </div>
    );
}

export default TopicElement;
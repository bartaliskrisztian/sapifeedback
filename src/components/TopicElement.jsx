import React from "react";
import AddIcon from "../assets/images/plus.svg";

function TopicElement(props) {
    return (
        <div className="topic-element" onClick={props.onClick}>
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
                <div>{props.name}</div>
            }
        </div>
    );
}

export default TopicElement;
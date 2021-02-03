import React, {useState} from "react";
import TopicElement from "./TopicElement";  
import Modal from "react-modal";
import CancelIcon from "../assets/images/cancel.svg";
import "../assets/css/UserTopics.css";

function UserTopics(props) {

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }
     
    function closeModal(){
        setIsOpen(false);
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
                />
                <button className="create-topic__button" type="submit">Create</button>
            </Modal>
            <TopicElement 
                type="add" 
                onClick={openModal} 
                onClose={closeModal}
            />
        </div>
    );
}

export default UserTopics;
import React, {useState} from "react";
import { useHistory, Redirect, Link } from "react-router-dom";
import { GoogleLogout } from 'react-google-login';
import UserPlaceholder from "../assets/images/user.svg";
import SearchBar from "./SearchBar";
import stringRes from "../resources/strings";
import "../assets/css/Navbar.css";

function Navbar(props) {

    let history = useHistory();
    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    const logout = () => {
        history.push("/login");
        props.setUser(null);
    }
    

    const Menus = () => {
        return(
            <div className="navbar-menus">
                <Link className="navbar-menus__element" to="/">{strings.navbar.myTopicsMenu}</Link>
            </div>
        );
    }

    const ProfileMenu = () => {
        return(
            <div className="user-menu">
                <img 
                    className="user-image" 
                    src={props.user.imageUrl === undefined ? UserPlaceholder : props.user.imageUrl} 
                    alt="Profile"
                    onClick={() => setShowProfileMenu(!showProfileMenu)} 
                />
                <div className={`profile-dropdown${showProfileMenu ? " open" : ""}`}>
                    <img 
                        className="profile-dropdown__image" 
                        src={props.user.imageUrl === undefined ? UserPlaceholder : props.user.imageUrl}
                        alt="Profile"
                    />
                    <div className="profile-dropdown__name">{props.user.name}</div>
                    <div>{props.user.email}</div>
                    <GoogleLogout
                        clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
                        buttonText={strings.navbar.logoutButtonText}
                        onLogoutSuccess={logout}
                        className="logout-button"
                    >
                    </GoogleLogout>
                </div>
            </div>
        );
    }

    const topicOptions = strings.topic.menus;

    if(props.user) {
        return (
            <div className="navbar">
                {props.page === "home" && <SearchBar onSearch={props.onSearch} />}
                {props.page === "topic" && <div className="topic-name">{props.topicName}:</div>}
                {props.page === "topic" &&
                <div className="topic-menu__container">
                    {topicOptions.map((menu, index) => 
                        console.log(window.location)
                    )}
                </div>
                }
                <Menus />  
                <ProfileMenu />
            </div>
        );
    }
    else {
        return (
            <Redirect to="/login" />
        );
    }
}

export default Navbar;
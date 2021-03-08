import React, {useState, useEffect} from "react";
import { useHistory, Redirect, Link} from "react-router-dom";
import { GoogleLogout } from 'react-google-login';
import UserPlaceholder from "../assets/images/user.svg";
import SearchBar from "./SearchBar";
import stringRes from "../resources/strings";
import "../assets/css/Navbar.css";

function Navbar(props) {

    const history = useHistory();

    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [url, setUrl] = useState(null);
    
    useEffect(() => {
        if(props.page === "topic") {
            let url = window.location.href;
            url = url.substring(0, url.length-1);
            setUrl(url);

            const topicPage = new URLSearchParams(history.location.search).get("page");
            changeMenuColor(topicPage)
        }
        // eslint-disable-next-line
    }, [window.location.href]);

    const logout = () => {
        history.push("/login");
        props.setUser(null);
    }
    
    const changeMenuColor = (topicPage) => {
        let temp = document.getElementById("topic-menu__container");
        if(!temp) {
            return;
        }
        let elements = Array.from(temp.children);
        elements.forEach(element => {
            if(element.id === topicPage) {
                element.style.background = "#3a3b3c";
            }
            else {
                element.style.background = "#242526";
            }
        });
    }

    const Menus = () => {
        return(
            <div className="navbar-menus">
                {window.location.hash !== "#/" && <Link className="navbar-menus__element" to="/">{strings.navbar.myTopicsMenu}</Link>}
                
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
                <div className="topic-menu__container" id="topic-menu__container">
                    {topicOptions.map((menu, index) => 
                        <a
                            className="topic-menu" 
                            id={index}
                            key={index}
                            href={`${url}${index}`}
                        >
                            {menu}
                        </a>
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
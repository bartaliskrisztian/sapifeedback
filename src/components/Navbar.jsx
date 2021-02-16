import React, {useState} from "react";
import { useHistory, Redirect, Link } from "react-router-dom";
import { GoogleLogout } from 'react-google-login';
import UserPlaceholder from "../assets/images/user.svg";
import SearchBar from "./SearchBar";
import "../assets/css/Navbar.css";

function Navbar(props) {

    let history = useHistory();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    const logout = () => {
        history.push("/login");
        props.setUser(null);
    }
    

    if(props.user) {
        return (
            <div className="navbar">
                <div className="navbar-menus">
                    <Link className="navbar-menus__element" to="/">My topics</Link>
                </div>
                <SearchBar onSearch={props.onSearch} />
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
                            buttonText="Logout"
                            onLogoutSuccess={logout}
                            className="logout-button"
                        >
                        </GoogleLogout>
                    </div>
                </div>
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
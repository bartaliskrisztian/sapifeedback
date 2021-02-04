import React from "react";
import Navbar from "./Navbar";
import UserTopics from "./UserTopics";

function Home(props) {
    return (
        <div className="home">
            <Navbar user={props.user} setUser={props.setUser} />
            <UserTopics user={props.user} />
        </div>
    );
}

export default Home;
import React from "react";
import UserTopics from "./UserTopics";

function Home(props) {
    return (
        <div className="home">
            <UserTopics user={props.user} />
        </div>
    );
}

export default Home;
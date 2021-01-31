import React from "react";
import Navbar from "./Navbar";

function Home(props) {

    return (
        <div className="home">
            <Navbar user={props.user} setUser={props.setUser} />
        </div>
    );
}

export default Home;
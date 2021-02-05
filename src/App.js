import {useState} from "react";
import { Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Topic from "./components/Topic";

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <Layout>
          <Route exact path="/login" render={() => <Login setUser={setUser} />} />
          <Route exact path="/" render={() => {
            return (
              <div>
                <Navbar user={user} setUser={setUser} />
                <Home user={user} setUser={setUser} />
              </div>
            );
          }} />
          <Route exact path="/topic/:userid/:topicid" render={()=> {
            return (
              <div>
                <Navbar user={user} setUser={setUser} />
                <Topic />
              </div>
            );
          }} />
      </Layout>
    </div>
  );
}

export default App;

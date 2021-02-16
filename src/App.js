import {useState} from "react";
import { Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Topic from "./components/Topic";
import Report from "./components/Report";

function App() {

  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const onSearch = (e) => {
    setSearchText(e.target.value);
  }

  return (
    <div className="App">
      <Layout>
          <Route exact path="/login" render={() => <Login setUser={setUser} />} />
          <Route exact path="/" render={() => {
            return (
              <div>
                <Navbar user={user} setUser={setUser} onSearch={onSearch} />
                <Home user={user} setUser={setUser} searchText={searchText} />
              </div>
            );
          }} />
          <Route exact path="/topic" render={()=> {
            return (
              <div>
                <Navbar user={user} setUser={setUser} />
                <Topic />
              </div>
            );
          }} />
          <Route exact path="/report" component={Report}/>
      </Layout>
    </div>
  );
}

export default App;

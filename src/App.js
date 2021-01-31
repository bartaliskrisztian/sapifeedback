import {useState} from "react";
import { Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <Layout>
          <Route exact path="/" render={() => <Login setUser={setUser} />} />
          <Route path="/home" render={() => <Home user={user} setUser={setUser} />} />
      </Layout>
    </div>
  );
}

export default App;

import { Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <Layout>
          <Route exact path="/" component={Login}/>
          <Route path="/home" component={Home}/>
      </Layout>
    </div>
  );
}

export default App;

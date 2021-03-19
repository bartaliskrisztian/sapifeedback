import { Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Topic from "./components/Topic";
import ReportPage from "./components/ReportPage";
import Statistics from "./components/Statistics";

function App() {

  const HomePage = () => {
    return(
      <div>
        <Navbar page="home"/>
        <Home />
      </div>
    );
  }

  const TopicDetailsPage = () => {
    return (
      <div>
        <Navbar page="topic" />
        <Topic />
      </div>
    );
  }

  const StatisticsPage = () => {
    return (
      <div>
        <Navbar page="topic" />
        <Statistics />
      </div>
    );
  }

  return (
    <div className="App">
      <Layout>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={HomePage} />
          <Route exact path="/topic/:userId/:topicId/reports" component={TopicDetailsPage} />
          <Route exact path="/topic/:userId/:topicId/statistics" component={StatisticsPage} />
          <Route exact path="/report/:userId/:topicId" component={ReportPage} />
      </Layout>
    </div>
  );
}

export default App;

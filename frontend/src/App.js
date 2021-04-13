import { Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import TopicDetails from "./components/TopicDetails";
import TopicReports from "./components/TopicReports"
import WordCloud from "./components/WordCloud";
import ReportFrequency from "./components/ReportFrequency";
import ReportPage from "./components/ReportPage";
import TopicSideMenus from "./components/TopicSideMenus";

function App() {

  const HomePage = () => {
    return(
      <div>
        <Navbar page="home"/>
        <Home />
      </div>
    )
  }

  const TopicReportsPage = () => {
    return (
      <div className="page-holder">
        <TopicSideMenus />
        <div className="topic-page__content">
          <Navbar page="topic" />
          <TopicReports />
        </div>
      </div>
    )
  }

  const WordCloudPage = () => {
    return (
      <div className="page-holder">
        <TopicSideMenus />
        <div className="topic-page__content">
          <Navbar page="topic" />
          <WordCloud />
        </div>
      </div>
    )
  }

  const ReportFrequencyPage = () => {
    return (
      <div className="page-holder">
        <TopicSideMenus />
        <div className="topic-page__content">
          <Navbar page="topic" />
          <ReportFrequency />
        </div>
      </div>
    )
  }

  const TopicDetailsPage = () => {
    return (
      <div className="page-holder">
        <TopicSideMenus />
        <div className="topic-page__content">
          <Navbar page="topic" />
          <TopicDetails />
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <Layout>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={HomePage} />
          <Route exact path="/topic/:userId/:topicId/details" component={TopicDetailsPage} />
          <Route exact path="/topic/:userId/:topicId/reports" component={TopicReportsPage} />
          <Route exact path="/topic/:userId/:topicId/wordCloud" component={WordCloudPage} />
          <Route exact path="/topic/:userId/:topicId/freq" component={ReportFrequencyPage } />
          <Route exact path="/report/:userId/:topicId" component={ReportPage} />
      </Layout>
    </div>
  );
}

export default App;

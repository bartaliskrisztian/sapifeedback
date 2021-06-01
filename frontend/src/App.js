import { Route, Redirect } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import TopicDetails from "./components/TopicDetails";
import TopicReports from "./components/TopicReports"
import WordCloud from "./components/WordCloud";
import ReportFrequency from "./components/ReportFrequency";
import FeedbackPage from "./components/FeedbackPage";
import TopicSideMenus from "./components/TopicSideMenus";
import NotFound from "./components/NotFound";

import { withNamespaces } from 'react-i18next';
import { connect } from "react-redux";

import "./resources/themes.css";

function App({t, theme}) {

  const HomePage = () => {
    return(
      <div>
        <Navbar page="home"/>
        <Home />
      </div>
    )
  }

  const TopicFeedbacksPage = () => {
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
    <div className={`app-holder ${theme}`}>
      <div className="small-device">
        {t("Open this site on a bigger device.")}
      </div>
      <div className="App">
        <Layout>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={HomePage} />
            <Route exact path="/topic/:topicId/details" component={TopicDetailsPage} />
            <Route exact path="/topic/:topicId/feedbacks" component={TopicFeedbacksPage} />
            <Route exact path="/topic/:topicId/wordCloud" component={WordCloudPage} />
            <Route exact path="/topic/:topicId/freq" component={ReportFrequencyPage } />
            <Route exact path="/giveFeedback/:topicId" component={FeedbackPage} />
            <Route path="/404" component={NotFound} />
            <Redirect to="/404" />
        </Layout>
      </div>
    </div>
  );
}

// getting the global state variables with redux
const mapStateToProps = (state) => {
  const theme = state.appTheme;
  
  return { theme };
};

export default connect(mapStateToProps)(withNamespaces()(App));

import { Route, Redirect } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import TopicDetails from "./components/TopicDetails";
import TopicFeedbacks from "./components/TopicFeedbacks"
import WordCloud from "./components/WordCloud";
import FeedbackFrequency from "./components/FeedbackFrequency";
import FeedbackPage from "./components/FeedbackPage";
import TopicMenus from "./components/TopicMenus";
import NotFound from "./components/NotFound";

import { withNamespaces } from 'react-i18next';
import { connect } from "react-redux";

import "./resources/themes.css";

function App({t, theme}) {

  const HomePage = () => {
    return(
      <div className="homepage-holder">
        <Navbar page="home"/>
        <Home />
      </div>
    )
  }

  const TopicFeedbacksPage = () => {
    return (
      <div className="page-holder">
        <TopicMenus place="pageside" />
        <div className="topic-page__content">
          <Navbar page="topic" />
          <TopicFeedbacks />
        </div>
      </div>
    )
  }

  const WordCloudPage = () => {
    return (
      <div className="page-holder">
        <TopicMenus place="pageside" />
        <div className="topic-page__content">
          <Navbar page="topic" />
          <WordCloud />
        </div>
      </div>
    )
  }

  const FeedbackFrequencyPage = () => {
    return (
      <div className="page-holder">
        <TopicMenus place="pageside" />
        <div className="topic-page__content">
          <Navbar page="topic" />
          <FeedbackFrequency />
        </div>
      </div>
    )
  }

  const TopicDetailsPage = () => {
    return (
      <div className="page-holder">
        <TopicMenus place="pageside" />
        <div className="topic-page__content">
          <Navbar page="topic" />
          <TopicDetails />
        </div>
      </div>
    )
  }

  return (
    <div className={`app-holder ${theme}`}>
      <div className="App">
          <Layout>
          <Route exact path="/login" component={Login} />
          <Route path="/404" component={NotFound} />
          <PrivateRoute exact={true} path="/" component={HomePage} />
          <PrivateRoute exact={true} path="/topic/:topicId/details" component={TopicDetailsPage} />
          <PrivateRoute exact={true} path="/topic/:topicId/feedbacks" component={TopicFeedbacksPage} />
          <PrivateRoute exact={true} path="/topic/:topicId/wordCloud" component={WordCloudPage} />
          <PrivateRoute exact={true} path="/topic/:topicId/freq" component={FeedbackFrequencyPage } />
          <Route exact={true} path="/giveFeedback/:topicId" component={FeedbackPage} />
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

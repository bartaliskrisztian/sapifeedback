import { Route } from "react-router-dom"
import Layout from "./components/Layout"
import Login from "./components/Login"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import Topic from "./components/Topic"
import ReportPage from "./components/ReportPage"
import WordCloud from "./components/WordCloud"
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
          <Topic />
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

  return (
    <div className="App">
      <Layout>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={HomePage} />
          <Route exact path="/topic/:userId/:topicId/reports" component={TopicReportsPage} />
          <Route exact path="/topic/:userId/:topicId/wordCloud" component={WordCloudPage} />
          <Route exact path="/report/:userId/:topicId" component={ReportPage} />
      </Layout>
    </div>
  );
}

export default App;

# University project for final exam

This is a web application for giving anonymous feedbacks and collecting, analizing them. The application's frontend is written in ReactJS, the backend is written in NodeJS, which can execute python srcipts for analizing feedbacks. The application's data is stored  in Firebase realtime database and storage.

Demo: https://sapifeedback.herokuapp.com/

## It is useful for the users who:

* want to get feedback in order to improve, learn
* want to collect feedbacks CONTINUOUSLY
* want to collect feedbacks about more than one topic
* want to collect unstructured feedbacks (free text + image)
* want to anayzie feedbacks in order to extract useful information 

## About the project

### Types of user: 

* Logged in user: can create topics for collecting feedbacks, manage topics (create, archive, delete) and feedbacks (export, delete, analyze).
* Guest user: can give feedback to a given topic (prequisite: having the topic's id or the feedback url)

### Details:

* the application uses websockets for refreshing the UI in real time
* feedback texts are analized with the help of python scripts
* reCAPTCHA v2 is used for preventing bot attacks
* the application is responsive, it is easy to use on mobile device as well

### Technologies used:

* Frontend:
  * _reactJS, CSS, HTML5_
  * _Google OAuth 2.0_
  * _Google reCAPTCHA v2_
  * _Redux_          
  
* Backend:
  * _nodeJS_
  * _express_
  * _python (NLTK)_

* Database: 
  * _Firebase Realtime Database_
  * _Firebase Storage_ 

### Some important node packages:

* Frontend:
  * _socket.io-client_ (websocket for realtime changes)
  * _react-router-dom_ (for creating routes)
  * _react-toastify_ (for notifications)
  * _react-google-login_ (for login)
  * _react-google-recaptcha_ (for preventing bot attacks)
  * _i18next_ (for internationalization)
  * _client-compress_ (for compressing feedback images)

* Backend:
  * _express_ (for handling http requests)
  * _firebase-admin_ (for communicating with cloud database)
  * _http-proxy-middleware_ (for creating proxy)
  * _python-shell_ (for executing python scripts)
  * _socket.io_ (websocket for realtime changes)

## Pages of the website

### Homepage

Here the user can log in with Google Account or can enter a topic's ID to give feedbacks to a given topic at the **Feedbacks page**.

<table align="center" >
  <tr>
    <td>Desktop</td>
     <td>Mobile</td>
  </tr>
  <tr>
    <td><img src="readme_images/login.png" alt="desktop homepage" height="400" width="750"/></td>
    <td><img src="readme_images/login_mobile.png" alt="mobile homepage" height="450" width="220"/></td>
  </tr>
 </table>
 
 ### User's topics page
 
 At this page the user can create topics and see, sort and filter the created topics. At the top of the page there is a navigation bar, where the user can see the profile information and can log out, and there is also a search bar for searching between the topics.
 
 <table align="center" >
  <tr>
    <td>Desktop</td>
     <td>Mobile</td>
  </tr>
  <tr>
    <td><img src="readme_images/user_topics.png" alt="desktop user's topics page" height="400" width="750"/></td>
    <td><img src="readme_images/user_topics_mobile.png" alt="mobile user's topics page" height="400" width="220"/></td>
  </tr>
 </table>

<table align="center" >
  <tr>
     <td>User's topics</td>
  </tr>
  <tr>
    <td><img src="readme_images/user_topics_elements.png" alt="user's topics elements" height="250" width="800"/></td>
  </tr>
 </table>
 
 At the topic card's options, the user can archive/activate the topic, and also can copy the topic's id and feedback page url to clipboard.
 
 <table align="center" >
  <tr>
     <td>Topic cards</td>
     <td>Topic card options</td>
  </tr>
  <tr>
    <td><img src="readme_images/topic_elements.png" alt="topic elements" height="200" width="450"/></td>
   <td><img src="readme_images/topic_elements_options.png" alt="topic elements options" height="200" width="450"/></td>
  </tr>
 </table>

At the navbar there is a settings option, where the user can change the theme (dark/light) and the language of the application (english, hungarian).

<table align="center" >
  <tr>
     <td>Settings</td>
  </tr>
  <tr>
    <td><img src="readme_images/settings.png" alt="settings" height="300" width="270"/></td>
  </tr>
 </table>
 
### Topic's details page

Here the user can see the details of the topic and can delete the topic with its feedbacks.


 <table align="center" >
  <tr>
     <td>Desktop</td>
     <td>Mobile</td>
  </tr>
  <tr>
    <td><img src="readme_images/topic_details.png" alt="desktop topic details" height="400" width="750"/></td>
   <td><img src="readme_images/topic_details_mobile.png" alt="mobile topic details" height="500" width="2200"/></td>
  </tr>
 </table>

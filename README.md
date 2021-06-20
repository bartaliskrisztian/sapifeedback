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

### Technologies used:

* Frontend:
        * reactJS, CSS, HTML5
        * Google OAuth 2.0
        * Google reCAPTCHA v2
        * Redux            
  
* Backend:
        * nodeJS
        * express
        * python

* Database: 
  * Firebase Realtime Database
  * Firebase Storage 

## Some important node packages:

* Frontend:
  * socket.io-client
  * react-router-dom
  * react-toastify
  * react-google-login
  * react-google-recaptcha
  * i18next
  * client-compress 

* Backend:
  * express
  * firebase-admin
  * http-proxy-middleware
  * python-shell
  * socket.io

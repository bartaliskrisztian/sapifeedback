# University project for final exam

This is a web application for giving anonymous feedbacks and collecting, analizing them. The application's frontend is written in ReactJS, the backend is written in NodeJS, which can execute python srcipts for analizing feedbacks. The application's data is stored  in Firebase realtime database and storage.

There are two types of users: 

* Logged in user: can create topics for collecting feedbacks, manage topics (create, archive, delete) and feedbacks (export, delete, analyze).
* Guest user: can give feedback to a given topic (prequisite: having the topic's id or the feedback url)

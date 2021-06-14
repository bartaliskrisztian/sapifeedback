const apiPath = `${process.env.REACT_APP_BACKEND_URL}api`;

const apiGetRequest = (type, params) => {
     let endpoint = '';
     switch(type) {
         case 'topicDetails':
            endpoint = `${apiPath}/topic/${params.topicId}/details`;
            break;
        case 'topicFeedbacks':
            endpoint = `${apiPath}/topic/${params.topicId}/feedbacks`;
            break;
        case 'deleteFeedback':
        endpoint = `${apiPath}/topic/${params.topicId}/deleteFeedback/${params.feedbackId}`;
        break;
        case 'topicUrl':
            endpoint = `${apiPath}/userTopics/getTopicUrl/${params.topicId}`;
            break;
        case 'archiveTopic':
            endpoint = `${apiPath}/userTopics/archiveTopic/${params.userGoogleId}/${params.topicId}`;
            break;
        case 'activateTopic':
            endpoint = `${apiPath}/userTopics/activateTopic/${params.userGoogleId}/${params.topicId}`;
            break;
        case 'userTopics':
            endpoint = `${apiPath}/userTopics/${params.userGoogleId}`;
            break;
        case 'deleteTopic':
            endpoint = `${apiPath}/deleteTopic/${params.userGoogleId}/${params.topicId}`;
            break;
        default: break;
     }

     return fetch(endpoint).then(
        (response) => {
            if(response.ok) {
                return response.json();
            }
            else {
                return response.text().then((text) => {throw text});
            }
        },
        (fail) => {throw fail}
    );
 }

const apiPostRequest = (type, body) => {
    let endpoint = '';
    switch(type) {
        case 'login':
            endpoint = `${apiPath}/login`;
            break;
        case 'createTopic':
           endpoint = `${apiPath}/createTopic`;
           break;
        case 'uploadFeedback':
           endpoint = `${apiPath}/uploadFeedback`;
           break;
        case 'topicWordCloud':
           endpoint = `${apiPath}/topic/wordCloud`;
           break;
        case 'feedbackFrequency':
            endpoint = `${apiPath}/topic/feedback-frequency`;
            break;
       default: break;
    }

    return fetch(endpoint,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: body
        }
    ).then(
       (response) => {
           if(response.ok) {
               return response.json();
           }
           else {
               return response.text().then((text) => {throw text});
           }
       },
       (fail) => {throw fail}
   );
}


export { apiGetRequest, apiPostRequest };

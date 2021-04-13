const apiPath = `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}`;
 
 const apiGetRequest = (userGoogleId, topicId, type) => {
     let endpoint = '';
     switch(type) {
         case 'topicDetails':
            endpoint = `${apiPath}/topic/${userGoogleId}/${topicId}/details`;
            break;
        case 'topicReports':
            endpoint = `${apiPath}/topic/${userGoogleId}/${topicId}/reports`;
            break;
        case 'topicUrl':
            endpoint = `${apiPath}/userTopics/getTopicUrl/${userGoogleId}/${topicId}`;
            break;
        case 'archiveTopic':
            endpoint = `${apiPath}/userTopics/archiveTopic/${userGoogleId}/${topicId}`;
            break;
        case 'activateTopic':
            endpoint = `${apiPath}/userTopics/activateTopic/${userGoogleId}/${topicId}`;
            break;
        case 'userTopics':
            endpoint = `${apiPath}/userTopics/${userGoogleId}`;
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

 const apiPostRequest = (userGoogleId, topicId, body, type) => {
    let endpoint = '';
    switch(type) {
        case 'createTopic':
           endpoint = `${apiPath}/createTopic`;
           break;
        case 'uploadReport':
           endpoint = `${apiPath}/uploadReport`;
           break;
        case 'topicWordCloud':
           endpoint = `${apiPath}/topic/wordCloud`;
           break;
        case 'reportFrequency':
            endpoint = `${apiPath}/topic/report-frequency`;
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

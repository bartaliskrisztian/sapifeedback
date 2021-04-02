 const apiGetRequest = (userGoogleId, topicId, type) => {
     let endpoint = '';
     switch(type) {
         case 'topicDetails':
            endpoint = `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/topic/${userGoogleId}/${topicId}/details`;
            break;
        case 'topicReports':
            endpoint = `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/topic/${userGoogleId}/${topicId}/reports`;
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
        case 'topicWordCloud':
           endpoint = `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/topic/${userGoogleId}/${topicId}/wordCloud`;
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

import React, { useState, useEffect } from "react";

// importing components
import ReCAPTCHA from "react-google-recaptcha";
import ImageDropzone from "./ImageDropzone";
import { useHistory, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { storage } from "../firebase/Firebase";
import stringRes from "../resources/strings"; // importing language resource file

// importing styles
import "../assets/css/ReportPage.css";
import "react-toastify/dist/ReactToastify.css";

function ReportPage() {
  const history = useHistory(); // hook for getting the url
  const params = useParams(); // hook for getting the url's parameters
  const recaptchaRef = React.useRef(); // reference of the recaptcha

  // string resources
  let language = process.env.REACT_APP_LANGUAGE;
  let strings = stringRes[language];

  const [files, setFiles] = useState([]); // for storing image(s) uploaded by user
  const [reportText, setReportText] = useState(""); // text reported by user
  const [isUploading, setIsUploading] = useState(false);

  const [userId, setUserId] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [topic, setTopic] = useState({});

  useEffect(() => {
    // getting the url's parameters
    const userid = params.userId;
    const topicid = params.topicId;

    // if there are parameters we set the state variables and get the topic's details
    if (userid !== null && topicid !== null) {
      setUserId(userid);
      setTopicId(topicid);
      getTopicDetails(userid, topicid);
    }
    // if there are no parameters, means that the url is wrong, then redirect
    else {
      history.push("/");
    }

    // eslint-disable-next-line
  }, []);

  // getting the details about a topic
  const getTopicDetails = (userGoogleId, topicId) => {
    fetch(
      `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/topic/${userGoogleId}/${topicId}/details`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.result) {
          setTopic(res.result); // save the response in state
        }
      });
  };

  // toast notify functions
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleTextChange = (e) => {
    setReportText(e.target.value);
  };

  const onCaptchaChange = (token) => {};

  // resets state values and reCaptcha
  const resetPage = () => {
    setReportText("");
    setFiles([]);
    recaptchaRef.current.props.grecaptcha.reset();
  };

  // uploading the report image on client side
  const uploadImage = async ({ image, imageName }) => {
    try {
      const blob = await fetch(image).then((r) => r.blob());

      const snapshot = await storage
        .ref("report_images")
        .child(imageName)
        .put(blob);

      const downloadUrl = await snapshot.ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      throw error;
    }
  };

  const uploadReport = async () => {
    const date = `${Date.now()}`;

    if (files.length) {
      const image = files.length ? URL.createObjectURL(files[0]) : null;
      const imageName = files.length ? files[0].name : "";

      uploadImage({ image, imageName }).then((url) => {
        const data = {
          date: date,
          text: reportText,
          topicOwnerId: userId,
          topicId: topicId,
          imageUrl: url,
        };
        sendRequest(data);
      });
    } else {
      const data = {
        date: date,
        text: reportText,
        topicOwnerId: userId,
        topicId: topicId,
        imageUrl: null,
      };
      sendRequest(data);
    }
  };

  // POST request for uploading a report
  const sendRequest = (data) => {
    fetch(
      `${window.location.origin}/${process.env.REACT_APP_RESTAPI_PATH}/uploadReport`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error === "OK") {
          notifySuccess(strings.report.errorText.successfulReport);
        } else {
          notifyError(res.error);
        }
      });
  };

  // when the user presses the submit button
  const onSubmitWithReCAPTCHA = async () => {
    if (topic.isArchived) {
      notifyError("Ehhez a témához jelenleg nem lehet visszajelezni.");
      return;
    }

    const token = await recaptchaRef.current.props.grecaptcha.getResponse();
    // if the reCaptcha's token is empty string or null, means that the user did not solve the captcha

    if (token === "" || token === null) {
      notifyError(strings.report.errorText.notRobot);
      return;
    }

    // if the given text for report is too short
    if (reportText.length < 20) {
      notifyError(strings.report.errorText.shortReport);
      return;
    }
    setIsUploading(true); // setting up loader
    uploadReport(); // try to upload the image and report
    setIsUploading(false);

    // providing success message for 2 secs
    notifySuccess(strings.report.errorText.successfulReport);

    resetPage();
  };

  return (
    <div className="report-container">
      <div className="report-container__content">
        <div className="report-text">
          <div className="info">
            <div className="info-text">
              {strings.report.title}
              <span className="info-text__topic-name"> {topic.topicName}</span>
            </div>
          </div>
          <textarea
            className="text-input"
            value={reportText}
            placeholder={strings.report.inputPlaceHolder}
            onChange={handleTextChange}
          />
          <div className="source-code">
            {`${strings.report.sourceCodeText}: `}
            <a
              target="blank"
              href={`${strings.report.sourceCode}`}
              className="source-code__link"
            >
              {strings.report.sourceCodeShort}
            </a>
          </div>
        </div>
        <div className="report-image">
          <div className="info">
            <div className="info-text">{strings.report.attachImageText}</div>
          </div>
          <ImageDropzone setUploadedImages={setFiles} files={files} />
        </div>
      </div>
      <div className="bottom-submit__container">
        <div className="submit-container">
          <ReCAPTCHA
            className="recaptcha"
            ref={recaptchaRef}
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={onCaptchaChange}
          />
          <button
            className="submit-button"
            type="submit"
            onClick={onSubmitWithReCAPTCHA}
          >
            {strings.report.submitButtonText}
          </button>
          {/*  */}
          {isUploading && <div className="loader"></div>}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={3000}
        closeOnClick={false}
      />
    </div>
  );
}

export default ReportPage;

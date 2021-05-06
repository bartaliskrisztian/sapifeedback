import React, { useState, useEffect } from "react";

// importing components
import ReCAPTCHA from "react-google-recaptcha";
import ImageDropzone from "./ImageDropzone";
import { useHistory, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Settings from "./Settings";

import { apiGetRequest, apiPostRequest } from "../api/utils";
import { storage } from "../firebase/Firebase";
import { withNamespaces } from "react-i18next";

// importing styles
import "../assets/css/ReportPage.css";
import "react-toastify/dist/ReactToastify.css";

function ReportPage({ t }) {
  const history = useHistory(); // hook for getting the url
  const params = useParams(); // hook for getting the url's parameters
  const recaptchaRef = React.useRef(); // reference of the recaptcha

  const [files, setFiles] = useState([]); // for storing image(s) uploaded by user
  const [reportText, setReportText] = useState(""); // text reported by user
  const [isUploading, setIsUploading] = useState(false);

  const [topicId, setTopicId] = useState(null);
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    // getting the url's parameters
    const topicid = params.topicId;

    // if there are parameters we set the state variables and get the topic's details
    if (topicid !== null) {
      setTopicId(topicid);
      getTopic(topicid);
    }
    // if there are no parameters, means that the url is wrong, then redirect
    else {
      history.push("/");
    }

    // eslint-disable-next-line
  }, []);

  // getting the details about a topic
  const getTopic = (topicid) => {
    apiGetRequest("topicDetails", {
      topicId: topicid,
    }).then(
      (response) => {
        if (response.result) {
          setTopic(response.result); // save the response in state
        } else {
          notifyError(t("There is no topic with this id"));
        }
      },
      (reject) => {
        notifyError(reject);
      }
    );
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
          topicId: topicId,
          imageUrl: url,
        };
        sendRequest(data);
      });
    } else {
      const data = {
        date: date,
        text: reportText,
        topicId: topicId,
        imageUrl: null,
      };
      sendRequest(data);
    }
  };

  // POST request for uploading a report
  const sendRequest = (data) => {
    apiPostRequest("uploadReport", JSON.stringify(data)).then(
      (response) => {
        if (response.error === "OK") {
          notifySuccess(t("Successful report"));
        } else {
          notifyError(response.error);
        }
      },
      (reject) => {
        notifyError(reject);
      }
    );
  };

  // when the user presses the submit button
  const onSubmitWithReCAPTCHA = async () => {
    if (topic.isArchived) {
      notifyError(t("You can't report to his topic at the moment."));
      return;
    }

    const token = await recaptchaRef.current.props.grecaptcha.getResponse();
    // if the reCaptcha's token is empty string or null, means that the user did not solve the captcha

    if (token === "" || token === null) {
      notifyError(t("Prove that you are human."));
      return;
    }

    // if the given text for report is too short
    if (reportText.length < 20) {
      notifyError(
        t(
          "The given report text is too short (should be at least 20 character)."
        )
      );
      return;
    }
    setIsUploading(true); // setting up loader
    uploadReport(); // try to upload the image and report
    setIsUploading(false);

    // providing success message for 2 secs
    notifySuccess(t("Successful report"));

    resetPage();
  };

  return (
    <div className="report-container">
      <Settings page="report" />
      <div className="report-container__content">
        <div className="report-text">
          <div className="info">
            <div className="info-text">
              {t(
                "YOU CAN REPORT ANONYMOUSLY YOUR PROBLEM/COMMENT ABOUT THE TOPIC"
              )}
              {topic && (
                <span className="info-text__topic-name">{topic.topicName}</span>
              )}
            </div>
          </div>
          <textarea
            className="text-input"
            value={reportText}
            placeholder={t("Your comments about the topic")}
            onChange={handleTextChange}
          />
          <div className="source-code">
            {`${t("SOURCE CODE")}: `}
            <a
              target="blank"
              href={`${t(
                "https://github.com/bartaliskrisztian/report-feedback"
              )}`}
              className="source-code__link"
            >
              {t("github.com/bartaliskrisztian/report-feedback")}
            </a>
          </div>
        </div>
        <div className="report-image">
          <div className="info">
            <div className="info-text">
              {t("YOU CAN ATTACH AN IMAGE OPTIONALLY")}
            </div>
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
            disabled={topic !== null ? false : true}
          >
            {t("SEND")}
          </button>
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

export default withNamespaces()(ReportPage);

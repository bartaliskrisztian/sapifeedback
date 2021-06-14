import React, { useState, useEffect, useRef } from "react";

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
import "../assets/css/FeedbackPage.css";
import "react-toastify/dist/ReactToastify.css";

function FeedbackPage({ t }) {
  const history = useHistory(); // hook for getting the url
  const params = useParams(); // hook for getting the url's parameters
  const recaptchaRef = React.useRef(); // reference of the recaptcha

  const [files, setFiles] = useState([]); // for storing image(s) uploaded by user
  const [feedbackText, setFeedbackText] = useState(""); // text given by user
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
          if (response.result.isArchived) {
            history.push("/404");
          }
        } else {
          history.push("/404");
        }
      },
      (reject) => {
        notifyError(reject);
      }
    );
  };

  // toast notify functions
  const toastId = useRef(null);
  const notifySuccess = (message) => {
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.success(message);
    }
  };
  const notifyError = (message) => toast.error(message);

  const handleTextChange = (e) => {
    setFeedbackText(e.target.value);
  };

  const onCaptchaChange = (token) => {};

  // resets state values and reCaptcha
  const resetPage = () => {
    setFeedbackText("");
    setFiles([]);
    recaptchaRef.current.props.grecaptcha.reset();
  };

  // uploading the feedback image on client side
  const uploadImage = async ({ image, imageName }) => {
    try {
      const blob = await fetch(image).then((r) => r.blob());

      const snapshot = await storage
        .ref("feedback_images")
        .child(imageName)
        .put(blob);

      const downloadUrl = await snapshot.ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      throw error;
    }
  };

  const uploadFeedback = async () => {
    if (files.length) {
      const image = files.length ? URL.createObjectURL(files[0]) : null;
      const imageName = files.length ? files[0].name : "";

      uploadImage({ image, imageName }).then((url) => {
        const data = {
          text: feedbackText,
          topicId: topicId,
          imageUrl: url,
        };
        sendRequest(data);
      });
    } else {
      const data = {
        text: feedbackText,
        topicId: topicId,
        imageUrl: null,
      };
      sendRequest(data);
    }
  };

  // POST request for uploading a Feedback
  const sendRequest = (data) => {
    apiPostRequest("uploadFeedback", JSON.stringify(data)).then(
      (response) => {
        if (response.result === "OK") {
          console.log("ok");
          notifySuccess(t("Successful feedback"));
        } else {
          notifyError(response.result);
        }
      },
      (reject) => {
        notifyError(reject);
      }
    );
  };

  // when the user presses the submit button
  const onSubmitWithReCAPTCHA = async () => {
    const token = await recaptchaRef.current.props.grecaptcha.getResponse();
    // if the reCaptcha's token is empty string or null, means that the user did not solve the captcha

    if (token === "" || token === null) {
      notifyError(t("Prove that you are human."));
      return;
    }

    // if the given text for feedback is too short
    if (feedbackText.length < 20) {
      notifyError(
        t(
          "The given feedback text is too short (should be at least 20 character)."
        )
      );
      return;
    }
    setIsUploading(true); // setting up loader
    uploadFeedback(); // try to upload the image and feedback
    setIsUploading(false);

    // providing success message for 2 secs
    notifySuccess(t("Successful feedback"));

    resetPage();
  };

  return (
    <div className="feedback-container">
      <Settings page="feedback" />
      <div className="feedback-container__content">
        <div className="feedback-text">
          <div className="info">
            <div className="info-text">
              {t(
                "YOU CAN SEND FEEDBACK ANONYMOUSLY YOUR PROBLEM/COMMENT ABOUT THE TOPIC"
              )}
              {topic && (
                <span className="info-text__topic-name">{topic.topicName}</span>
              )}
            </div>
          </div>
          <textarea
            className="text-input"
            value={feedbackText}
            placeholder={t("Your comments about the topic")}
            onChange={handleTextChange}
          />
          <div className="source-code">
            {`${t("SOURCE CODE")}: `}
            <a
              target="blank"
              href={`${t("github-long")}`}
              className="source-code__link"
            >
              {t("github-short")}
            </a>
          </div>
        </div>
        <div className="feedback-image">
          <div className="info">
            <div className="info-text">
              {t("YOU CAN ATTACH AN IMAGE OPTIONALLY")}
            </div>
          </div>
          <ImageDropzone
            setUploadedImages={setFiles}
            files={files}
            notifyError={notifyError}
          />
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
            disabled={topic && !topic.isArchived ? false : true}
          >
            {t("SEND")}
          </button>
          {isUploading && <div className="loader"></div>}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={3000}
        closeOnClick={false}
        limit={1}
      />
    </div>
  );
}

export default withNamespaces()(FeedbackPage);

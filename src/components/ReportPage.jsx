import React, {useState, useEffect} from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import ImageDropzone from "./ImageDropzone";
import {db, storage} from "../database/firebase";
import firebase from "firebase/app";
import { useHistory, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import stringRes from "../resources/strings";
import "../assets/css/ReportPage.css";
import 'react-toastify/dist/ReactToastify.css';

function ReportPage() {

    const history = useHistory();
    const params = useParams();
    const recaptchaRef = React.useRef();
    
    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];

    const [files, setFiles] = useState([]); // for storing image(s) uploaded by user

    const [reportText, setReportText] = useState(""); // text reported by user

    const [isUploading, setIsUploading] = useState(false);
    const sourceCode = strings.report.sourceCode;

    const [userId, setUserId] = useState(null);
    const [topicId, setTopicId] = useState(null);
    const [topic, setTopic] = useState({});

    useEffect(() => {
        
        const userid = params.userId;
        const topicid = params.topicId;
       
        if(userid !== null && topicid !== null) {
           setUserId(userid);
           setTopicId(topicid);
           getTopicDetails(userid, topicid);
        }
        else {
            history.push("/");
        }
        // eslint-disable-next-line
    }, []);


    const getTopicDetails = (userGoogleId, topicId) => {
        db.ref(`topics/${userGoogleId}/${topicId}`).on("value", (snapshot) => {
            if(snapshot.val()) {
                setTopic(snapshot.val());
            }
        });
    }

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const handleTextChange = (e) => {
        setReportText(e.target.value);
    }

    const onCaptchaChange = (token) => {
      
    }

    // resets state values and reCaptcha
    const resetPage = () => {
        setReportText("");
        setFiles([]);
        recaptchaRef.current.props.grecaptcha.reset();
    }

    // uploads image to firebase storage
    // on success return the image's download URL
    // on error throws error
    const uploadFromBlobAsync = async ({blobUrl, name}) => {
        if (!blobUrl || !name) return null;
        try {
            const blob = await fetch(blobUrl).then((r) => r.blob());
            const snapshot = await storage.ref("report_images").child(name).put(blob);
            return await snapshot.ref.getDownloadURL();
        } catch (error) {
            notifyError(error);
        }
    }

    // uploads the reported text to firestore
    // if it's provided, uploads the given image's download URL, otherwise null
    const uploadReport = async (url) => {
        const dbRef = db.ref(`reports/${topicId}`);
        const uid = dbRef.push().key; // getting a new id for the topic
        const date = `${Date.now()}`;

        dbRef.child(uid).set({
            date : date,
            text: reportText,
            imageUrl: url,
            topicOwnerId: userId
        }).catch((error) => notifyError(error));

    }

    // if the user provided an image, upload it to firebase storage, then upload the report
    const uploadToFirebase = () => {
        if(files.length) {
            try {
                const url = uploadFromBlobAsync({
                    blobUrl: URL.createObjectURL(files[0]),
                    name: files[0].name
                })
                url.then((downloadURL) => {
                    uploadReport(downloadURL);
                });
                return
            }
            catch (e) {
                setIsUploading(false)
                notifyError(e.message)
                return
            }
        }
        else {
            uploadReport(null);
        }
    }


    // when the user presses the submit button
    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.props.grecaptcha.getResponse();
        // if the reCaptcha's token is empty string or null, means that the user did not solve the captcha
        
        if(token === "" || token === null) {
            notifyError(strings.report.errorText.notRobot);
            return;
        }

        // if the given text for report is too short
        if(reportText.length < 20) {
            notifyError(strings.report.errorText.shortReport);
            return;
        }
        setIsUploading(true); // setting up loader
        uploadToFirebase(); // try to upload the image and report
        setIsUploading(false);

        // providing success message for 2 secs
        notifySuccess(strings.report.errorText.successfulReport);
        
        resetPage();
    }

    return (
        <div className="report-container">
            <div className="report-container__content">
                <div className="report-text">
                    <div className="info">
                        <div className="info-text">
                            {strings.report.title}
                            <span className="info-text__topic-name">  {topic.topicName}</span>
                        </div>
                    
                    </div>
                    <textarea 
                        className="text-input" 
                        value = {reportText}
                        placeholder={strings.report.inputPlaceHolder} 
                        onChange={handleTextChange}
                    />
                    <div className="source-code">
                            {`${strings.report.sourceCodeText}: `}
                            <a 
                                target="blank" 
                                href={`${sourceCode}`} 
                                className="source-code__link"
                            >
                                {strings.report.sourceCodeShort}
                            </a>
                    </div>
                </div>
                <div className="report-image">
                    <div className="info">
                        <div className="info-text">
                            {strings.report.attachImageText}
                        </div>
                    </div>
                    <ImageDropzone setUploadedImages={setFiles} files={files} />
                </div>
            </div>
            <div className="bottom-submit__container">
                <div className="submit-container">
                    <ReCAPTCHA 
                        className="recaptcha"
                        ref = {recaptchaRef}
                        sitekey = {process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                        onChange = {onCaptchaChange}
                    />
                    <button className="submit-button" type="submit" onClick={onSubmitWithReCAPTCHA} >{strings.report.submitButtonText}</button>
                    {/*  */}
                    {isUploading && (<div className="loader"></div>)}
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
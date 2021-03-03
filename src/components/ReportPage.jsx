import React, {useState, useEffect} from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import ImageDropzone from "./ImageDropzone";
import {db, storage} from "../database/firebase";
import firebase from "firebase/app";
import { useHistory, useParams } from "react-router-dom";
import stringRes from "../resources/strings";
import "../assets/css/Report.css";

function ReportPage() {

    const history = useHistory();
    const params = useParams();
    const recaptchaRef = React.useRef();
    
    let language = process.env.REACT_APP_LANGUAGE;
    let strings = stringRes[language];

    const [files, setFiles] = useState([]); // for storing image(s) uploaded by user
    const [reportText, setReportText] = useState(""); // text reported by user
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const sourceCode = strings.report.sourceCode;
    const [userId, setUserId] = useState(null);
    const [topicId, setTopicId] = useState(null);

    useEffect(() => {
        
        const userid = params.userId;
        const topicid = params.topicId;
       
        if(userid !== null && topicid !== null) {
           setUserId(userid);
           setTopicId(topicid);
        }
        else {
            history.push("/");
        }
        // eslint-disable-next-line
    }, []);

    const handleTextChange = (e) => {
        setReportText(e.target.value);
    }

    const onCaptchaChange = (token) => {
        if(token !== "" && token !== null) {
            setError("");
        }
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
            throw error;
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
        }).catch((error) => setError(error));

    }

    // if the user provided an image, upload it to firebase storage, then upload the report
    const uploadToFirebase = () => {
        if(files.length) {
            try {
                const url = uploadFromBlobAsync({
                    blobUrl: URL.createObjectURL(files[0]),
                    name: `${files[0].name}_${Date.now()}`
                })
                url.then((downloadURL) => {
                    uploadReport(downloadURL);
                });
                return
            }
            catch (e) {
                setIsUploading(false)
                setError(e.message)
                return
            }
        }
    }


    // when the user presses the submit button
    const onSubmitWithReCAPTCHA = async () => {
        setError("");
        const token = await recaptchaRef.current.props.grecaptcha.getResponse();
        // if the reCaptcha's token is empty string or null, means that the user did not solve the captcha
        
        if(token === "" || token === null) {
            setError(strings.report.errorText.notRobot)
            return;
        }

        // if the given text for report is too short
        if(reportText.length < 20) {
            setError(strings.report.errorText.shortReport)
            return;
        }
        setIsUploading(true); // setting up loader
        uploadToFirebase(); // try to upload the image and report
        setIsUploading(false);

        // providing success message for 2 secs
        setError(strings.report.errorText.successfulReport);
        
        resetPage();
    }

    const ReportText = () => {
        return(
            <div className="report-text">
                <div className="info">
                    <div className="info-text">
                        {strings.report.title}
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
        );
    }

    const ReportImage = () => {
        return(
            <div className="report-image">
                <div className="info">
                    <div className="info-text">
                        {strings.report.attachImageText}
                    </div>
                </div>
                <ImageDropzone setUploadedImages={setFiles} files={files} />
            </div>
        );
    }

    const SubmitContainer = () => {
        <div className="submit-container">
            <ReCAPTCHA 
                className="recaptcha"
                ref = {recaptchaRef}
                sitekey = {process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange = {onCaptchaChange}
            />
            <button className="submit-button" type="submit" onClick={onSubmitWithReCAPTCHA}>{strings.report.submitButtonText}</button>
            {isUploading && (<div className="loader"></div>)}
        </div>
    }

    return (
        <div className="report-container">
            <div className="report-container__content">
                <ReportText />
                <ReportImage />
            </div>
            <div className="bottom-submit__container">
                {error && <div className="error-message">{error}</div>}
                <SubmitContainer />
            </div>
        </div>
    );
}

export default ReportPage;
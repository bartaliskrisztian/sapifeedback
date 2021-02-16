import React, {useState} from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import ImageDropzone from "./ImageDropzone";
import {db} from "../database/firebase";
import firebase from "firebase/app";
import "../assets/css/Report.css";

function Report() {

    const recaptchaRef = React.useRef();

    const [files, setFiles] = useState([]); // for storing image(s) uploaded by user
    const [reportText, setReportText] = useState(""); // text reported by user
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const sourceCode = 'https://github.com/bartaliskrisztian/problema-sapi';

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
            const snapshot = await firebase.storage().ref("report_images").child(name).put(blob);
            return await snapshot.ref.getDownloadURL();
        } catch (error) {
            throw error;
        }
    }

    // uploads the reported text to firestore
    // if it's provided, uploads the given image's download URL, otherwise null
    const uploadReport = async (url) => {
        const id = `${Date.now()}`;
        db.collection("reports").doc(`${id}`).get().then((docRef) => {
            if(docRef.data() === undefined) {
                db.collection("reports").doc(`${id}`).set({
                    text: reportText,
                    imageDownloadURL: url
                });
            }
        });
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
        uploadReport(null);
    }


    // when the user presses the submit button
    const onSubmitWithReCAPTCHA = async () => {
        setError("");
        const token = await recaptchaRef.current.props.grecaptcha.getResponse();
        // if the reCaptcha's token is empty string or null, means that the user did not solve the captcha
        
        if(token === "" || token === null) {
            setError("Igazolja, hogy Ön nem robot.")
            return;
        }

        // if the given text for report is too short
        if(reportText.length < 20) {
            setError("Túl rövid a megfogalmazott szöveg (min. 20 karakter).")
            return;
        }
        setIsUploading(true); // setting up loader
        uploadToFirebase(); // try to upload the image and report
        setIsUploading(false);

        // providing success message for 2 secs
        setError("Sikeres feltöltés");
        
        resetPage();
    }

    return (
        <div className="report-container">
            <div className="report-container__content">
                <div className="report-text">
                    <div className="info">
                        <div className="info-text">
                            NÉVTELENÜL BEJELENTHETI BÁRMILYEN PROBLÉMÁJÁT A SAPIENTIA EGYETEMMEL KAPCSOLATOSAN.
                        </div>
                       
                    </div>
                    <textarea 
                        className="text-input" 
                        value = {reportText}
                        placeholder="Írja le problémáját, észrevételét" 
                        onChange={handleTextChange}
                    />
                     <div className="source-code">
                            {`FORRÁSKÓD: `}
                            <a 
                                target="blank" 
                                href={`${sourceCode}`} 
                                className="source-code__link"
                            >
                                github.com/bartalis.krisztian/problema-sapi
                            </a>
                    </div>
                </div>
                <div className="report-image">
                    <div className="info">
                        <div className="info-text">
                            OPCIONÁLISAN A BEJELENTÉSHEZ EGY KÉPET IS CSATOLHAT.
                        </div>
                    </div>
                    <ImageDropzone setUploadedImages={setFiles} files={files} />
                </div>
            </div>
            <div className="bottom-submit__container">
                {error && <div className="error-message">{error}</div>}
                <div className="submit-container">
                    <ReCAPTCHA 
                        className="recaptcha"
                        ref = {recaptchaRef}
                        sitekey = {process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                        onChange = {onCaptchaChange}
                    />
                    <button className="submit-button" type="submit" onClick={onSubmitWithReCAPTCHA}>Küldés</button>
                    {isUploading && (<div className="loader"></div>)}
                </div>
            </div>
        </div>
    );
}

export default Report;
const strings = {
    EN: {
        login: {
            loginButtonText: 'Sign up or log in with Google Account'
        },
        navbar: {
            myTopicsMenu: 'My topics',
            searchBarText: 'Search between your topics',
            logoutButtonText: 'Logout'
        },
        userTopics: {
            title: 'Your topics',
            createTopicText: 'Create topic',
            modal: {
                title: 'Create topic',
                inputPlaceHolder: 'Enter your topic name',
                createButtonText: 'Create',
                errorText: {
                    usedTopicName: 'you already have a topic with this name',
                    emptyTopicName: 'enter your topic name'
                }
            },
            menu: {
                archive: 'Archive',
                copyLink: 'Copy link'
            }
        },
        report: {
            title: 'YOU CAN REPORT ANONYMOUSLY YOUR PROBLEM/COMMENT ABOUT THE TOPIC:',
            attachImageText: 'YOU CAN ATTACH AN IMAGE OPTIONALLY',
            inputPlaceHolder: 'Your comments about the topic',
            imageDropText: 'DRAG AND DROP HERE THE IMAGE',
            imageSelectButtonText: 'Choose an image',
            imageRemoveButtonText: 'Remove the image',
            sourceCodeText: 'SOURCE CODE',
            sourceCode: 'https://github.com/bartaliskrisztian/report-feedback',
            sourceCodeShort: 'github.com/bartaliskrisztian/report-feedback',
            submitButtonText: 'SEND',
            errorText: {
                notRobot: 'Prove that you are human.',
                shortReport: 'The given report text is too short (should be at least 20 character).',
                successfulReport: 'Successful report',
                tooManyFiles: 'Too many files',
                tooLargeFile: 'File is too large',
                wrongFileFormat: 'File format is invalid'
            }
        }
    },
    HU: {
        login: {
            loginButtonText: 'Regisztráljon vagy jelentkezen be Google Account segítségével'
        },
        navbar: {
            myTopicsMenu: 'Témák',
            searchBarText: 'Keress a témáid között',
            logoutButtonText: 'Kijelentkezés'
        },
        userTopics: {
            title: 'Témáid',
            createTopicText: 'Téma létrehozása',
            modal: {
                title: 'Téma létrehozása',
                inputPlaceHolder: 'Írd be a téma nevét',
                createButtonText: 'Létrehoz',
                errorText: {
                    usedTopicName: 'már van ilyen nevű témád',
                    emptyTopicName: 'írd be a téma nevét'
                }
            },
            menu: {
                archive: 'Archiválás',
                copyLink: 'Bejelentő link másolása'
            }
        },
        report: {
            title: 'NÉVTELENÜL BEJELENTHETI BÁRMILYEN PROBLÉMÁJÁT A TÉMÁVAL KAPCSOLATOSAN:',
            attachImageText: 'OPCIONÁLISAN A BEJELENTÉSHEZ EGY KÉPET IS CSATOLHAT.',
            inputPlaceHolder: 'Írja le problémáját, észrevételét',
            imageDropText: 'Húzza ide az állományt',
            imageSelectButtonText: 'Kép kiválasztása',
            imageRemoveButtonText: 'Kép eltávolítása',
            sourceCodeText: 'FORRÁSKÓD',
            submitButtonText: 'KÜLDÉS',
            errorText: {
                notRobot: 'Igazolja, hogy Ön nem robot.',
                shortReport: 'Túl rövid a megfogalmazott szöveg (min. 20 karakter).',
                successfulReport: 'Sikeres feltöltés',
                tooManyFiles: 'Csak egy képet csatolhat',
                tooLargeFile: 'A fájl túl nagy méretű',
                wrongFileFormat: 'Érvénytelen fájlformátum'
            }
        }
    }
};

export default strings;
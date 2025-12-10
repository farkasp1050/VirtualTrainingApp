import { IonContent, IonHeader, IonList, IonItem, IonInput, IonSelect, IonSelectOption, IonPage, IonButtons, IonBackButton, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import { useIonRouter } from '@ionic/react';

import { moon, sunnyOutline } from 'ionicons/icons';
import { moonOutline } from 'ionicons/icons';

import ReactSwitch from "react-switch";
import { US } from "country-flag-icons/react/3x2";
import { HU } from "country-flag-icons/react/3x2";

import "./Settings.css";

import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
    const router = useIonRouter();
    const { t, i18n } = useTranslation("Settings");
    const [ isItDark, setIsItDark ]= useState(false);
    const [ appTheme, setAppTheme ] = useState("light");
    const [ isItEnglish, setIsItEnglish ] = useState(true);

    useEffect(() => {
        console.log(localStorage.getItem("theme"));
        setAppTheme(localStorage.getItem("theme") || "light");
        setIsItDark(localStorage.getItem("theme") === "light" ? false : true);
        setIsItEnglish(localStorage.getItem("lang") === "en" ? true : false);
    }, []);

    useEffect(() => {
        handleThemeChange();

    }, [appTheme]);

    const handleThemeChange = async () => {
        if(isItDark === false){
            document.documentElement.classList.add("darkMode");
            document.documentElement.classList.remove("light");
            localStorage.setItem("theme", "darkMode");
            setIsItDark(true);
            
        } else{
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("darkMode");
            localStorage.setItem("theme", "light");
            setIsItDark(false);
        }
    }

    const handleLanguageChange = () => { 
        if(localStorage.getItem("lang") === "en"){
            i18n.changeLanguage("hu");
            localStorage.setItem("lang", "hu");
            setIsItEnglish(false);
        } else{
            i18n.changeLanguage("en");
            localStorage.setItem("lang", "en");
            setIsItEnglish(true);
        }
    }

    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                        <IonBackButton className='backButton' defaultHref='/dashboard'/>
                        <IonTitle className='ion-text-end'>{t("title")}</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding page-content">
                <div className='content'>
                    <IonList className='list'>
                        <ReactSwitch
                        checked={isItDark}
                        onChange={handleThemeChange}
                        offColor='#ffffff'
                        onColor='#000000'
                        checkedIcon={<IonIcon icon={sunnyOutline}/>}
                        uncheckedIcon={<IonIcon icon={moonOutline}/>}
                        />
                        
                        <ReactSwitch
                        checked={isItEnglish}
                        onChange={() => handleLanguageChange()}
                        offColor={isItDark ? "#ffffff ": "#000000"}
                        onColor={isItDark ? "#ffffff ": "#000000"}
                        checkedIcon={<US title="English"/>}
                        uncheckedIcon={<HU title="Magyar"/>}
                        />
                        <IonItem className='version'>
                            <IonInput label="Version" value="1.1.3." disabled={true}></IonInput>
                        </IonItem>
                    </IonList>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Settings;
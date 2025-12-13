import { IonContent, IonHeader, IonGrid, IonToast, IonRow, IonCol, IonIcon, IonAvatar, IonButton, IonList, IonInputPasswordToggle, IonPage, IonTitle, IonToolbar, IonInput, IonText, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { mail, lockClosed, person, exit, logoGoogle } from 'ionicons/icons';
import loginPicture from '../../assets/loginPicture.png';
import React, { useState, useEffect } from 'react';
import Splash from '../../components/Splash';
import { Preferences } from '@capacitor/preferences';

import { supabase } from '../../services/supabaseClient';

import { useTranslation } from 'react-i18next';

import styles from "./Login.module.css";

const PREF_KEY = 'splashActive';

const Login: React.FC = () => {
	const { t } = useTranslation("Login");
	const router = useIonRouter();
	const [ splashActive, setSplashActive ] = useState(true);
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ message, setMessage ] = useState('');
	const [ isOpen, setIsOpen ] = useState(false);
	const [ showToast, setShowToast ] = useState(false);

	useEffect(() => {
		const checkPref = async () => {
			const isActive = await Preferences.get({ key: PREF_KEY });
			setSplashActive(isActive.value === "false");
		}
	}, []);

	const handleLogin = async (event: any) => {
		event.preventDefault();
		setMessage("");
		
		const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});
			if(error){
				console.log(error.message);
				setMessage(`Something went wrong. ${error.message}`);
				setEmail("");
				setPassword("");
				router.push("/login");
			}
			setMessage("Logged in successfully!");
			router.push("/basicDataSplash");
			setEmail("");
			setPassword("");
	};

	const finishedSplash = async () => {
		setSplashActive(false);
		Preferences.set({ key: PREF_KEY, value: 'false' });
	};

	const introAgain = () => {
		setSplashActive(true);
		Preferences.set({ key: PREF_KEY, value: 'true' });
	}

	return (
	<>
	{splashActive ? (
		<Splash onFinish={finishedSplash}/>
	) : (
		<IonPage className={styles.page}>
			<IonContent className={styles.content}>
				<div className={styles.grid}>
					<IonGrid>
						<IonRow className={styles.mainRow}>
							<IonCol className={styles.mainCol} size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
								<div className={styles.imageContainer}>
									<img src={loginPicture} alt="LoginPicture" className={styles.image}/>
								</div>
							</IonCol>
						</IonRow>

						<IonRow className={styles.subRow}>
							<IonCol className={styles.subCol} size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
								<IonText color="primary" className={styles.titleContainer}>
									<h2 className={styles.title}>{t("title")}</h2>
								</IonText>
								<form onSubmit={handleLogin} className={styles.form}>
									<IonItem className={styles.item}>
										<IonIcon aria-hidden='true' icon={mail} slot='start' className={styles.icon}></IonIcon>
										<IonInput className={styles.input} label={t("mail")} value={email} onIonChange={e => setEmail(String(e.detail.value))} type='email' labelPlacement='floating' fill='outline'  required placeholder={t("emailPlaceholder")}></IonInput>
									</IonItem>
									<IonItem className={styles.item}>
										<IonIcon aria-hidden='true' icon={lockClosed} slot='start' className={styles.icon}></IonIcon>
										<IonInput className={styles.input} value={password} onIonChange={e => setPassword(String(e.detail.value))} label={t("password")} type='password' required labelPlacement='floating' fill='outline' placeholder='***********'>
											<IonInputPasswordToggle slot='end'></IonInputPasswordToggle>
										</IonInput>
									</IonItem>
									<IonButton className={styles.button} type='submit' size='default' shape='round' expand='block'>
											{t("login")}
											<IonIcon icon={exit} className={styles.icon}></IonIcon>
									</IonButton>
									<IonButton className={styles.button} routerLink='/register' size='default' shape='round' expand='block'>
										{t("register")}
										<IonIcon icon={person} className={styles.icon}></IonIcon>
									</IonButton>
									<IonButton className={styles.button} onClick={introAgain} routerLink='/' routerDirection='root' type='button' shape='round'>{t("introAgain")}</IonButton>
								</form>
								<IonToast
									isOpen={showToast}
									message={message}
									duration={3000}
									onDidDismiss={() => setShowToast(false)}
								/>
							</IonCol>
						</IonRow>
					</IonGrid>
				</div>
			</IonContent>
		</IonPage>
		)}
	</>
	);
};

export default Login;
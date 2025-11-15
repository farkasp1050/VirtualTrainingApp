import { IonContent, IonHeader, IonGrid, IonToast, IonRow, IonCol, IonIcon, IonAvatar, IonButton, IonList, IonInputPasswordToggle, IonPage, IonTitle, IonToolbar, IonInput, IonText, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { mail, lockClosed, person, exit } from 'ionicons/icons';
import loginPicture from '../assets/loginPicture.png';
import React, { useState, useEffect } from 'react';
import Splash from '../components/Splash';
import { Preferences } from '@capacitor/preferences';

import { supabase } from '../services/supabaseClient';

import "./Login.css";

const PREF_KEY = 'splashActive';

const Login: React.FC = () => { 
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
		router.push("/Splash");
	}

	return (
	<>
	{splashActive ? (
		<Splash onFinish={finishedSplash}/>
	) : (
		<IonPage className='page'>
			<IonContent className="ion-padding page-content" style={{ marginTop: "100px" }}>
				<IonGrid fixed>
					<IonRow class='ion-justify-content-center'>
						<IonCol size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
							<div className="ion-text-center ion-padding">
								<img src={loginPicture} alt="LoginPicture" />
							</div>
						</IonCol>
					</IonRow>

					<IonRow class='ion-justify-content-center'>
						<IonCol size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
							<IonText color="secondary">
								<h2>Login</h2>
							</IonText>
							<form onSubmit={handleLogin} className='form'>
								<IonItem>
									<IonIcon aria-hidden='true' icon={mail} slot='start'></IonIcon>
									<IonInput label='Email' value={email} onIonChange={e => setEmail(String(e.detail.value))} type='email' labelPlacement='floating' fill='outline'  required placeholder='somebody@something.com'></IonInput>
								</IonItem>
								<IonItem>
									<IonIcon aria-hidden='true' icon={lockClosed} slot='start'></IonIcon>
									<IonInput className='ion-margin-top' value={password} onIonChange={e => setPassword(String(e.detail.value))} label='Password' type='password' required labelPlacement='floating' fill='outline' placeholder='***********'>
										<IonInputPasswordToggle slot='end'></IonInputPasswordToggle>
									</IonInput>
								</IonItem>
									<IonRow>
										<IonCol size='6'>
											<IonButton type='submit' size='default' color={'primary'} shape='round' className='ion-margin-top' expand='block'>
												Login
												<IonIcon icon={exit} style={{ marginLeft: "5px" }}></IonIcon>
											</IonButton>
										</IonCol>
										<IonCol size='6'>
											<IonButton routerLink='/register' size='default' color={'secondary'} shape='round' className='ion-margin-top' expand='block'>
												Register
												<IonIcon icon={person} style={{ marginLeft: "5px" }}></IonIcon>
												</IonButton>
										</IonCol>
									</IonRow>
								<IonButton color={'secondary'} className='introAgainButton' onClick={introAgain} type='button' shape='round'>Watch Intro Again</IonButton>
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
			</IonContent>
		</IonPage>
		)}
	</>
	);
};

export default Login;
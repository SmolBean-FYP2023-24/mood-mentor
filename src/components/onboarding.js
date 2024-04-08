import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./styles/onboarding.css";
import Nav from "react-bootstrap/Nav";
import OnboardingLE from "./onboardingLE";

function Onboarding({ user }) {
  const [userState, setUserState] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    const getUserData = async () => {
      const user = await fetchAuthSession();
      setUserState(user.tokens.idToken.payload);
    };
    getUserData();
  }, []);

  const handleFinish = () => {
    navigate("/dashboard");
  };

  const pages = [
    {
		description: "This is your one step destination to improving expressing and understanding emotions! Mood-Mentor is a personalized emotion learning exercise system, capable of adapting to the individual emotional needs of each user, empowering them with better emotional insight, and encompassing a broader spectrum of emotions to ensure inclusivity.",
    },
    {
		title: "About Mood-Mentor :",
		description: "Mood-Mentor has 3 set of exercises for you to practice your emotions:<br><br>\
			\n\
			1. <u>Listening Exercises:</u> Here you can listen to a set of audios from different speakers and practice your emotion understanding skills.<br>\
			2. <u>Speaking Exercises:</u> Here you can practice your delivery of certain emotions.<br>\
			3. <u>Conversational Exercises:</u> You can hop on this exercise with your friends, family, or caretaker and start practicing your daily conversation. A feedback report will be sent to you on your registered email once you're done for you to have a look at your performance.<br><br>\
			You can access all these exercises on your dashboard along with the stats of your current performance!! Each exercise is specially catered for you to work more on your weak points. Let's do a small walk through to undersand where you stand currently. All the best !",
    },
	{
		title: "Let's Start Your Journey with Mood-Mentor",
		description: "Following are gonna be a set a of questions for you to answer.",
	},
    {
		title: "Happy - Listening Q1",
		description: "Basic description of the app",
	},
    {
		title: "Thank you for your time",
		description: "Let's begin your journey with MoodMentor",
	}
  ];
  
  const navigate = useNavigate();

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
		<Nav.Link href={"/dashboard"}>Listening Exercise</Nav.Link>
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="container-fluid-onboarding d-flex flex-column justify-content-center align-items-center">
        {currentPage === 0 && (
          <div className="flip-card-onboarding">
            <div className="flip-card-inner-onboarding">
              <div className="flip-card-front-onboarding">
                <div>
                  Welcome to <br />
                  <img
                    src="https://imgur.com/4yxwDdR.png"
                    alt="logo"
                    className="logo-image"
                  />
                </div>
              </div>
              <div className="flip-card-back-onboarding">
                <h2>{pages[currentPage].title}</h2>
                <p>{pages[currentPage].description}</p>
              </div>
            </div>
          </div>
        )}

		{currentPage === 1 && (
				<div className="card-onboarding">
						<div className="page-container-onboarding">
					<h2 className="card-title-onboarding">{pages[currentPage].title}</h2>
					<p
						className="card-body-text-onboarding"
						dangerouslySetInnerHTML={{ __html: pages[currentPage].description }}
					></p>
					</div>
				</div>
		)}
		{currentPage == 2 && (
            <div style={{ textAlign: 'center' }}>
                <div className="onboardingSE-heading">
                    Let's do some practice Exercises!
                </div>
                <img className="bing-bong" src="https://imgur.com/zfCpp54.png" width="auto" height="300"/>
            </div>
        )}
		{currentPage == 3 && (
			<OnboardingLE />
		)}
		{currentPage > 4 && (
		<div className="page-container-onboarding">
			<h2 className="text-center font-weight-bold pt-4">{pages[currentPage].title}</h2>
			<p
				className="body-text-onboarding"
				dangerouslySetInnerHTML={{ __html: pages[currentPage].description }}
			></p>
		</div>
		)}

		<div className="row align-items-center justify-content-center">
			<div className="col text-center">
			{(currentPage == 1 || currentPage == 2) && (
				<button className="btn-onboarding" onClick={goToPreviousPage}>
				Previous
				</button>
			)}
			</div>
			<div className="col text-center">
			{(currentPage == 0 || currentPage == 1 || currentPage == 2) && (
				<button className="btn-onboarding" onClick={goToNextPage}>
				Next
				</button>
			)}
			</div>
		</div>

		<div className="row align-items-center justify-content-center">
			<div className="col text-center">
			{currentPage === pages.length - 1 && (
				<button className="btn btn-primary" onClick={handleFinish}>
				Let's Start!
				</button>
			)}
			</div>
		</div>

		{currentPage === 0 && (
			<div className="row align-items-center justify-content-center">
			<div className="col">
				<img
				src="https://imgur.com/EA0uGXs.png"
				alt="intro"
				className="bottom-image-onboarding"
				/>
			</div>
			</div>
		)}

      </div>
	</>
  );
};

export default withAuthenticator(Onboarding);
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./styles/onboarding.css";
import "./styles/onboardingWelcome.css";
import "./styles/onboardingTransition.css";
import Nav from "react-bootstrap/Nav";
import OnboardingLE from "./onboardingLE";
import { Engine } from './onboardingWelcome.js';

function Onboarding({ user }) {
  const [userState, setUserState] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [transitionCompleted, setTransitionCompleted] = useState(true);
  const [showImage, setShowImage] = useState(true);
  const [filledCircles, setFilledCircles] = useState(0);
  const [hoveredCircle, setHoveredCircle] = useState(null);

  // user authentication
  useEffect(() => {
    const getUserData = async () => {
      const user = await fetchAuthSession();
      setUserState(user.tokens.idToken.payload);
      user.handleUser(user);
    };
    getUserData();
  }, [user]);

  useEffect(() => {
    if (currentPage === 1) {
      const timer = setTimeout(() => {
        setShowImage(false);
      }, 6800); // Delay in milliseconds (5 seconds)

      return () => clearTimeout(timer);
    }
  }, [currentPage]);
  
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
		title: "Welcome Page"
    },
	{
		title: "Info Page",
		description: "Welcome to Mood-Mentor, your go-to platform for enhancing your emotional expression and understanding! Our personalized emotion learning exercise system is tailored to meet your unique emotional needs. With Mood-Mentor, you'll gain valuable insights into your emotions and explore a wide range of emotional experiences, all while promoting inclusivity every step of the way. Get ready to embark on a transformative journey of self-discovery and emotional growth with Mood-Mentor!<br><br>\
		\n\
		By now, you've met our expert emotions:<b> Joy, Sadness, Anger, Disgust, and Fear</b>. However, there's one more member you have yet to meet:<b> Neutral</b>. We categorize emotions into 2 main groups:<br><br>\
		1.  <span style=\"color: red;\"><b>Negative:</b></span> When you engage more with members like Sadness, Anger, Fear, or Disgust.<br>\
		2.  <span style=\"color: green;\"><b>Positive</b></span> When you interact with Joy and Neutral.<br><br>\
		Let's dive deeper into our platform and get you better acquainted with all its features.",
    },
    {
		title: "About Mood-Mentor :",
		description: "Mood-Mentor has 3 set of exercises for you to practice your emotions:<br><br>\
			\n\
			1. <b>Listening Exercises:</b> Here you can listen to a set of audios from different speakers and practice your emotion understanding skills.<br>\
			2. <b>Speaking Exercises:</b> Here you can practice your delivery of certain emotions.<br>\
			3. <b>Conversational Exercises:</b> You can hop on this exercise with your friends, family, or caretaker and start practicing your daily conversation. A feedback report will be sent to you on your registered email once you're done for you to have a look at your performance.<br><br>\
			You can access all these exercises on your dashboard along with the stats of your current performance!! Each exercise is specially catered for you to work more on your weak points. Let's do a small walk through to undersand where you stand currently. All the best !",
    },
    {
		title: "Begin Practice Questions"
	},
    {
		title: "Begin Journey Page"
	}
  ];
  
  const navigate = useNavigate();

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
		setFilledCircles(currentPage + 1);
		setShowOverlay(true);
		setTransitionCompleted(false);
		setTimeout(() => {
			setCurrentPage(currentPage + 1);
			setTimeout(() => {
			  setShowOverlay(false); // Hide the overlay after transitioning
			  setTransitionCompleted(true);
			}, 1000); // Delay hiding the overlay to allow the transition to complete
		  }, 0); // Delay updating the state to allow the overlay to appear
    } else {
		<Nav.Link href={"/dashboard"}>Listening Exercise</Nav.Link>
    }
  };

  const goToPreviousPage = () => {
	setFilledCircles(currentPage - 1);
	setShowOverlay(true);
	setTransitionCompleted(false);
    setTimeout(() => {
		setCurrentPage(currentPage - 1);
		setTimeout(() => {
		  setShowOverlay(false); // Hide the overlay after transitioning
		  setTransitionCompleted(true);
		}, 1000); // Delay hiding the overlay to allow the transition to complete
	  }, 0);
  };

  const handleCircleClick = (index) => {
	if (index < currentPage) {
	  goToPreviousPage();
	} else if (index > currentPage) {
	  goToNextPage();
	}
  };

  return (
    <>
	{transitionCompleted && (
      <div className="content-container-onboarding">
		  <div className="progress-bar-container">
		  {pages.map((page, index) => (
			<div
				key={index}
				className={`progress-bar-circle ${index < filledCircles ? 'filled' : ''} ${index === hoveredCircle ? 'hovered' : ''}`}
				onMouseEnter={() => setHoveredCircle(index)}
				onMouseLeave={() => setHoveredCircle(null)}
				// onClick={() => handleCircleClick(index)}
			>
				{index < filledCircles && (
				<div className="circle-title">
					{page.title}
				</div>
				)}
			</div>
			))}
			</div>
	  <div className="container-fluid-onboarding d-flex flex-column justify-content-center align-items-center">
        {currentPage === 0 && (
			<div className="align-items-center justify-content-center">
				<div class="squareOnb"></div>
				<div class="cardOnb">
					<div class="cardOnb-title-wrap">
						<h1 class="title-welcome-onb">
							<span class="copy-wrap">
								Mood-Mentor
							</span>
						</h1>
					</div>
				</div>
				<div className="col text-center push-down">
					<button className="btn-onboarding" onClick={goToNextPage}>
						Next
					</button>
				</div>
			</div>
        )}
		{currentPage === 1 && (
			<div>
				{showImage ? (
				<img
					src="https://media.giphy.com/media/8ExdHaMMOeJUc/giphy.gif"
					className="intro-clip"
				/>
				) : (
					<div className="row align-items-center justify-content-center">
						
							<div className="flip-card-page1-onboarding">
							<p
							className="card-body-text-onboarding"
							dangerouslySetInnerHTML={{ __html: pages[currentPage].description }}
				></p>
							</div>
						
						<div className="row align-items-center justify-content-center">
							<div className="col text-center">
								<button className="btn-onboarding" onClick={goToPreviousPage}>
									Previous
								</button>
							</div>
							<div className="col text-center">
								<button className="btn-onboarding" onClick={goToNextPage}>
									Next
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		)}
		{currentPage === 2 && (
			<div className="row align-items-center justify-content-center">
				<div className="card-onboarding">
					<div className="page-container-onboarding">
						<h2 className="card-title-onboarding">{pages[currentPage].title}</h2>
						<p
							className="card-body-text-onboarding"
							dangerouslySetInnerHTML={{ __html: pages[currentPage].description }}
						></p>
					</div>
				</div>
				<div className="row align-items-center justify-content-center">
					<div className="col text-center">
						<button className="btn-onboarding" onClick={goToPreviousPage}>
							Previous
						</button>
					</div>
					<div className="col text-center">
						<button className="btn-onboarding" onClick={goToNextPage}>
							Next
						</button>
					</div>
				</div>
			</div>
		)}

		{currentPage == 3 && (
			<div className="row align-items-center justify-content-center text-center">
				<div className="card-onboarding">
					<div className="journey-text-onboarding">
						Let's do some practice Exercises!
					</div>
				</div>
				<div>
					<img className="bing-bong" src="https://imgur.com/zfCpp54.png" width="auto" height="300"/>
				</div>
			
				<div className="row align-items-center justify-content-center">
					<div className="col text-left">
						<button className="btn-onboarding" onClick={goToPreviousPage}>
							Previous
						</button>
					</div>
					<div className="col text-right">
						<button className="btn-onboarding" onClick={goToNextPage}>
							Next
						</button>
					</div>
				</div>
			</div>
        )}

		{currentPage == 4 && (
			<OnboardingLE />
		)}

		{currentPage === 0 && (
			<div className="row align-items-center justify-content-center">
				<img src="https://imgur.com/EA0uGXs.png" alt="intro" className="bottom-image-onboarding" />
			</div>
		)}

      </div>
	  </div>
	  )}

	  {showOverlay && (
      <div className="overlay show">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
		<div className="bar"></div>
      </div>
    )}
	</>
  );
};

export default withAuthenticator(Onboarding);
//ListeningExercise.js

import {React, useEffect, useState} from "react";
import './ListeningExercise.css';

function ListeningExercise() {
	const questions = [
		{
			questionText: 'What is the capital of France?',
			answerOptions: [
				{ answerText: 'New York', isCorrect: false },
				{ answerText: 'London', isCorrect: false },
				{ answerText: 'Paris', isCorrect: true },
				{ answerText: 'Dublin', isCorrect: false },
			],
		},
		{
			questionText: 'Who is CEO of Tesla?',
			answerOptions: [
				{ answerText: 'Jeff Bezos', isCorrect: false },
				{ answerText: 'Elon Musk', isCorrect: true },
				{ answerText: 'Bill Gates', isCorrect: false },
				{ answerText: 'Tony Stark', isCorrect: false },
			],
		},
		{
			questionText: 'The iPhone was created by which company?',
			answerOptions: [
				{ answerText: 'Apple', isCorrect: true },
				{ answerText: 'Intel', isCorrect: false },
				{ answerText: 'Amazon', isCorrect: false },
				{ answerText: 'Microsoft', isCorrect: false },
			],
		},
		{
			questionText: 'How many Harry Potter books are there?',
			answerOptions: [
				{ answerText: '1', isCorrect: false },
				{ answerText: '4', isCorrect: false },
				{ answerText: '6', isCorrect: false },
				{ answerText: '7', isCorrect: true },
			],
		},
	];

  const emotions={
    1:'neutral', 
    2:'happy', 
    3:'sad', 
    4:'angry',
    5:'fear',
    6:'disgust'
  };

  const emotion_random=[];

  

  function generateUniqueEmotions()
  {
    const emotion_temp=[];
    emotion_temp.push('neutral'); // append the actual hardcoded answer here (need to be fetched from DB later)
    const min=1;
    const max=6;
    const count=4; // besides the correct answer we display three random values that are not the answer in terms of the emotions
    

    const keyForNeutral = Object.entries(emotions)
    .find(([key, value]) => value === 'neutral')[0]; // hardcoded the neutral value here

    
    while(emotion_temp.length<count)
    {
       const random_num=Math.floor(Math.random()*(max-min+1))+min; // generating a random number between 1 to 6 
    
       if (random_num===keyForNeutral)
       {
        continue;
       }

       if (!emotion_temp.includes(emotions[random_num])) {
        emotion_temp.push(emotions[random_num]);
      }
      

    }// end of while

    

    // this while loop is for shiffling the responses
    let shuffle_count=4;
    const random_nums=[];
    while(shuffle_count>0)
    {
       const random_num=Math.floor(Math.random()*(3-0+1))+0; // generating a random number between 0 to 3 max=3,min=0
      
      if (!random_nums.includes(random_num)) {
        random_nums.push(random_num); // this array will always have a unique combination of 1 to 4 
        shuffle_count--;
      }
      

    }// end of while

    console.log("momom")
    console.log(random_nums)
    // repopulate the array so that we have the shuffled responses
    for(let i=0;i<random_nums.length;i++)
    {
      console.log(i)
       emotion_random[i]=emotion_temp[random_nums[i]]; 

    }

    console.log("jojo")
    console.log(emotion_random)


   
   
  

    return emotion_random
  }

  generateUniqueEmotions(); // calling the function to populate the array with wrong answer

  

  const [CurrentQuestion,setCurrentQuestion]=useState(0);
  const [showScore, setShowScore]= useState(false);
  const [score,setScore]=useState(0);
  const answer_arr=[];
 

  const handleAnswerButtonClick = (isCorrect) => {

    if (isCorrect)
    {
      // alert("the answer is correct");
      setScore(score+1); // updated when the user gets the correct answer
    }
    const nextQuestion = CurrentQuestion + 1;
    if(nextQuestion<questions.length){
    setCurrentQuestion(nextQuestion);
    }

    else {
      // alert('you reached the end of the quiz');
      setShowScore(true);
    }
    
  };

    // Inside your component or functional scope
    const remainingProgress = 100 - ((CurrentQuestion + 1) / questions.length) * 100;
    const progressBarRemainingStyle = { width: `${remainingProgress}%` };

	return (
		<div className='light-blue-bg' style={{ overflow: 'auto' }}>
       
			{/* HINT: replace "false" with logic to display the 
      score when the user has answered all the questions */}
			{showScore ? (
				<div className='score-section'>You scored {score} out of {questions.length}</div>
			) : (
				<>
					<div className='question-section'>
          <div className='question-count'>
          <span>Question {CurrentQuestion + 1}/{questions.length}</span>
          <div className='progress-bar'>
            <div className='progress-bar-fill' style={{ width: `${((CurrentQuestion + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
						<div className='question-text'> {questions[CurrentQuestion].questionText}</div>
					</div>
      
					<div className='answer-section'>
            {emotion_random.map((answerOption,index) =>
              <button className='buttonListeningExercise' onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}>
              <div className='option-label'>{String.fromCharCode(97 + index)}</div>
              <div className='option-text'>{emotion_random[index]}</div>
            </button>
              
            )}
						{/* <button>Answer 1</button>
						<button>Answer 2</button>
						<button>Answer 3</button>
						<button>Answer 4</button> */}
					</div>
				</>
			)}
		</div>
	);
}

export default ListeningExercise;
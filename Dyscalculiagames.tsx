
import React, { useState } from 'react';
import { ChevronLeft, Calculator, ArrowRight } from 'lucide-react';
import { GameResult } from '@/pages/Games';

type GameProps = {
  onSaveResult: (result: GameResult) => void;
  onBack: () => void;
};

type Game = {
  id: string;
  title: string;
  description: string;
  component: React.FC<{onComplete: (score: number, maxScore: number) => void}>;
};

const NumberSequenceGame: React.FC<{onComplete: (score: number, maxScore: number) => void}> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const questions = [
    {
      sequence: [2, 4, 6, 8],
      options: [10, 12, 9, 6],
      answer: 10
    },
    {
      sequence: [1, 3, 6, 10],
      options: [15, 14, 12, 18],
      answer: 15
    },
    {
      sequence: [3, 6, 12, 24],
      options: [36, 48, 30, 42],
      answer: 48
    },
    {
      sequence: [5, 10, 20, 40],
      options: [60, 70, 80, 100],
      answer: 80
    },
    {
      sequence: [9, 8, 7, 6],
      options: [5, 4, 3, 2],
      answer: 5
    }
  ];
  
  const handleAnswer = (answer: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === questions[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        onComplete(score + (answer === questions[currentQuestion].answer ? 1 : 0), questions.length);
      }
    }, 1000);
  };
  
  return (
    <div className="neuro-card">
      <h3 className="text-xl font-medium mb-6">Question {currentQuestion + 1} of {questions.length}</h3>
      
      <div className="mb-8">
        <p className="text-neuro-text mb-4">What number comes next in this sequence?</p>
        
        <div className="flex justify-center space-x-6 mb-8">
          {questions[currentQuestion].sequence.map((num, index) => (
            <div key={index} className="w-12 h-12 flex items-center justify-center bg-neuro-blue bg-opacity-10 rounded-lg text-lg font-medium">
              {num}
            </div>
          ))}
          <div className="w-12 h-12 flex items-center justify-center bg-neuro-blue bg-opacity-5 rounded-lg text-lg font-medium border-2 border-dashed border-neuro-blue">
            ?
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleAnswer(option)}
              className={`p-4 rounded-lg border-2 cursor-pointer flex items-center justify-center ${
                isAnswered 
                  ? option === questions[currentQuestion].answer 
                    ? 'border-green-500 bg-green-50' 
                    : option === selectedAnswer 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200'
                  : 'border-gray-200 hover:border-neuro-blue'
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <div className="text-sm text-neuro-text">
          Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)}
        </div>
        {isAnswered && currentQuestion < questions.length - 1 && (
          <button 
            className="text-neuro-blue flex items-center text-sm"
            onClick={() => {
              setCurrentQuestion(prev => prev + 1);
              setSelectedAnswer(null);
              setIsAnswered(false);
            }}
          >
            Next Question <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

const MathPuzzleGame: React.FC<{onComplete: (score: number, maxScore: number) => void}> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const questions = [
    {
      question: "If 3 apples cost $5, how much do 7 apples cost?",
      answer: 11.67
    },
    {
      question: "A rectangle has a length of 12cm and a width of 8cm. What is its area?",
      answer: 96
    },
    {
      question: "If a train travels at 60 miles per hour, how far will it travel in 2.5 hours?",
      answer: 150
    },
    {
      question: "What is 25% of 80?",
      answer: 20
    },
    {
      question: "If 8 people share $120 equally, how much does each person receive?",
      answer: 15
    }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered) return;
    
    const numAnswer = parseFloat(userAnswer);
    const correctAnswer = questions[currentQuestion].answer;
    
    // Check if the answer is correct (within 0.01 tolerance for floating point)
    const isAnswerCorrect = Math.abs(numAnswer - correctAnswer) < 0.01;
    
    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);
    
    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setUserAnswer('');
        setIsAnswered(false);
      } else {
        onComplete(score + (isAnswerCorrect ? 1 : 0), questions.length);
      }
    }, 1500);
  };
  
  return (
    <div className="neuro-card">
      <h3 className="text-xl font-medium mb-6">Question {currentQuestion + 1} of {questions.length}</h3>
      
      <div className="mb-8">
        <p className="text-neuro-text mb-6 text-center text-lg">{questions[currentQuestion].question}</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="number"
            step="0.01"
            className={`w-full max-w-xs p-3 border-2 rounded-lg mb-4 text-center text-lg ${
              isAnswered 
                ? isCorrect 
                  ? 'border-green-500'
                  : 'border-red-500' 
                : 'border-neuro-lightBlue focus:border-neuro-blue'
            }`}
            placeholder="Enter your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={isAnswered}
            required
          />
          
          {isAnswered && (
            <div className={`text-center mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Correct!' : `Incorrect. The answer is ${questions[currentQuestion].answer}.`}
            </div>
          )}
          
          <button
            type="submit"
            className="neuro-button-primary w-full max-w-xs"
            disabled={isAnswered || !userAnswer}
          >
            Submit Answer
          </button>
        </form>
      </div>
      
      <div className="flex justify-between">
        <div className="text-sm text-neuro-text">
          Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)}
        </div>
        {isAnswered && currentQuestion < questions.length - 1 && (
          <button 
            className="text-neuro-blue flex items-center text-sm"
            onClick={() => {
              setCurrentQuestion(prev => prev + 1);
              setUserAnswer('');
              setIsAnswered(false);
            }}
          >
            Next Question <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

const DyscalculiaGames: React.FC<GameProps> = ({ onSaveResult, onBack }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  const games: Game[] = [
    {
      id: 'dyscalculia-number-sequence',
      title: 'Number Sequence Challenge',
      description: 'Identify the next number in each sequence to improve pattern recognition skills.',
      component: NumberSequenceGame
    },
    {
      id: 'dyscalculia-math-puzzles',
      title: 'Math Puzzle Solver',
      description: 'Solve practical math problems to build numerical reasoning skills.',
      component: MathPuzzleGame
    }
  ];
  
  const handleGameComplete = (score: number, maxScore: number) => {
    if (selectedGame) {
      const result: GameResult = {
        gameId: selectedGame.id,
        score,
        maxScore,
        completedAt: new Date().toISOString()
      };
      
      onSaveResult(result);
      setSelectedGame(null);
    }
  };
  
  if (selectedGame) {
    const GameComponent = selectedGame.component;
    
    return (
      <div className="animate-fade-in">
        <button 
          className="flex items-center text-neuro-blue hover:underline mb-6"
          onClick={() => setSelectedGame(null)}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Games
        </button>
        
        <h2 className="text-2xl font-bold text-neuro-blue mb-4">{selectedGame.title}</h2>
        <p className="text-neuro-text opacity-75 mb-6">{selectedGame.description}</p>
        
        <GameComponent onComplete={handleGameComplete} />
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          className="flex items-center text-neuro-blue hover:underline mr-4"
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        
        <h2 className="text-2xl font-bold text-neuro-blue">Dyscalculia Games</h2>
      </div>
      
      <div className="mb-6">
        <p className="text-neuro-text opacity-75">
          These games are designed to strengthen numerical processing and mathematical reasoning skills.
          Choose a game to start playing:
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div 
            key={game.id}
            className="neuro-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedGame(game)}
          >
            <div className="mb-4 flex items-center justify-center bg-neuro-blue bg-opacity-10 rounded-full w-12 h-12">
              <Calculator className="h-6 w-6 text-neuro-blue" />
            </div>
            <h3 className="text-xl font-medium mb-2">{game.title}</h3>
            <p className="text-neuro-text opacity-75">
              {game.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DyscalculiaGames;

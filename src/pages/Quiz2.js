import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Space, Progress, Typography, Modal, Radio } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { StopOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Quiz2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const questions = location.state?.questions || [];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [canNavigate, setCanNavigate] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleNext = useCallback(() => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      const nextQuestionAnswer = userAnswers.find(a => a.questionIndex === nextQuestion);
      if (nextQuestionAnswer) {
        setShowAnswer(true);
        setSelectedAnswer(nextQuestionAnswer.userAnswer);
      } else {
        setShowAnswer(false);
        setSelectedAnswer(null);
        setCanNavigate(false);
      }
    } else {
      navigate('/result2', { 
        state: { 
          score, 
          total: questions.length,
          questions,
          userAnswers
        } 
      });
    }
  }, [currentQuestion, questions, score, userAnswers, navigate]);

  useEffect(() => {
    if (!location.state?.questions) {
      navigate('/');
      return;
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let timer;
    const isReviewingAnswer = userAnswers.some(a => a.questionIndex === currentQuestion);
    
    if (showAnswer && !isReviewingAnswer) {
      setTimer(30);
      timer = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleNext();
            return null;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [showAnswer, handleNext, currentQuestion, userAnswers]);

  const handleAnswerChange = (e) => {
    if (showAnswer) return;
    
    const answerKey = e.target.value;
    const isCorrect = answerKey === questions[currentQuestion].answer;
    setSelectedAnswer(answerKey);
    setShowAnswer(true);
    setCanNavigate(true);
    
    const currentQuestionIndex = currentQuestion;
    const existingAnswerIndex = userAnswers.findIndex(a => a.questionIndex === currentQuestionIndex);
    
    if (existingAnswerIndex !== -1) {
      const newUserAnswers = [...userAnswers];
      newUserAnswers[existingAnswerIndex] = {
        questionIndex: currentQuestionIndex,
        userAnswer: answerKey,
        isCorrect
      };
      setUserAnswers(newUserAnswers);
    } else {
      if (isCorrect) {
        setScore(score + 1);
      }
      setUserAnswers([...userAnswers, {
        questionIndex: currentQuestionIndex,
        userAnswer: answerKey,
        isCorrect
      }]);
    }
  };

  const handlePrevious = () => {
    const prevQuestion = currentQuestion - 1;
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion);
      const prevQuestionAnswer = userAnswers.find(a => a.questionIndex === prevQuestion);
      if (prevQuestionAnswer) {
        setShowAnswer(true);
        setSelectedAnswer(prevQuestionAnswer.userAnswer);
      }
    }
  };

  const handleEndQuiz = () => {
    navigate('/result2', { 
      state: { 
        score,
        total: questions.length,
        questions,
        userAnswers,
        earlyEnd: true,
        questionsAttempted: currentQuestion + 1
      } 
    });
  };

  const getCompletedQuestions = () => {
    return userAnswers.length;
  };

  if (!questions?.length) return <div>Loading...</div>;

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Progress 
              percent={(currentQuestion / questions.length) * 100} 
              showInfo={false}
              className="w-full sm:flex-1 sm:mr-4"
            />
            <Button 
              type="default" 
              danger
              icon={<StopOutlined />}
              onClick={() => setShowEndModal(true)}
              className="whitespace-nowrap"
            >
              Kết thúc bài thi
            </Button>
          </div>

          <div className="text-right">
            <Text strong className="text-sm sm:text-base">
              Câu {currentQuestion + 1} / {questions.length}
            </Text>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Title level={4} className="text-base sm:text-lg break-words whitespace-pre-wrap">
              {currentQuestionData.question}
            </Title>
          </div>

          <Radio.Group
            onChange={handleAnswerChange}
            value={selectedAnswer}
            className="space-y-3 w-full"
          >
            {Object.entries(currentQuestionData.options).map(([key, value]) => (
              <Button 
                key={key}
                block
                size="large"
                className={`text-left whitespace-pre-wrap break-words min-h-[60px] h-auto py-3 px-4 
                  ${showAnswer && key === currentQuestionData.answer ? 'border-green-500 bg-green-50' : ''}
                  ${showAnswer && key === selectedAnswer && key !== currentQuestionData.answer ? 'border-red-500 bg-red-50' : ''}
                  ${showAnswer ? 'cursor-default' : 'hover:border-gray-400'}`}
                onClick={() => !showAnswer && handleAnswerChange({ target: { value: key } })}
                style={{ opacity: 1 }}
              >
                <Radio value={key} style={{ display: 'none' }} />
                <div className="flex">
                  <div className="flex-grow text-sm sm:text-base">{`${key}. ${value}`}</div>
                  {showAnswer && key === currentQuestionData.answer && (
                    <CheckCircleOutlined className="text-green-500 ml-2 flex-shrink-0" />
                  )}
                  {showAnswer && key === selectedAnswer && key !== currentQuestionData.answer && (
                    <CloseCircleOutlined className="text-red-500 ml-2 flex-shrink-0" />
                  )}
                </div>
              </Button>
            ))}
          </Radio.Group>

          {showAnswer && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <Text strong>
                  {selectedAnswer === currentQuestionData.answer 
                    ? "✅ Đúng!" 
                    : "❌ Sai!"}
                </Text>
                {timer && <Text>Chuyển câu sau: {timer}s</Text>}
              </div>
              {currentQuestionData.explanation && (
                <Text className="block mt-2 whitespace-pre-wrap break-words">
                  Giải thích: {currentQuestionData.explanation}
                </Text>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-between">
            <Button 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Câu trước
            </Button>
            <Button 
              type="primary"
              onClick={handleNext}
              disabled={!canNavigate && !userAnswers.find(a => a.questionIndex === currentQuestion)}
            >
              {currentQuestion === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp'}
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        title="Kết thúc bài thi sớm"
        open={showEndModal}
        onOk={handleEndQuiz}
        onCancel={() => setShowEndModal(false)}
        okText="Có, kết thúc"
        cancelText="Không, tiếp tục"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc muốn kết thúc bài thi sớm? Bạn đã hoàn thành {getCompletedQuestions()} trong số {questions.length} câu hỏi.</p>
        <p>Điểm hiện tại của bạn là: {score}/{getCompletedQuestions()}</p>
      </Modal>
    </div>
  );
};

export default Quiz2;

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Space, Progress, Typography, Modal } from 'antd';
import { StopOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [canNavigate, setCanNavigate] = useState(false);
  const [timer, setTimer] = useState(null);
  const [sequentialNumbers, setSequentialNumbers] = useState({});
  const [isViewingPrevious, setIsViewingPrevious] = useState(false);
  const selectedPackages = location.state?.packages || [];

  // Thêm hàm tính số thứ tự câu hỏi
  const getQuestionNumber = (index, packageId) => {
    return ((packageId - 1) * 50) + index + 1;
  };

  // Add this function to get the real question number
  const getRealQuestionNumber = (question) => {
    return ((question.packageId - 1) * 50) + question.orderNumber;
  };

  const handleNext = useCallback(() => {
    setIsViewingPrevious(false); // Reset viewing previous when moving to next question
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      const nextQuestionIndex = questions[nextQuestion].index;
      const nextQuestionAnswer = userAnswers.find(a => a.questionIndex === nextQuestionIndex);
      if (nextQuestionAnswer) {
        setShowAnswer(true);
        setSelectedAnswer(nextQuestionAnswer.userAnswer);
      } else {
        setShowAnswer(false);
        setSelectedAnswer(null);
        setCanNavigate(false);
      }
    } else {
      navigate('/result', { 
        state: { 
          score, 
          total: questions.length,
          packages: selectedPackages,
          questions,
          userAnswers
        } 
      });
    }
  }, [currentQuestion, questions, userAnswers, score, selectedPackages, navigate]);

  useEffect(() => {
    if (!location.state?.questions) {
      navigate('/'); // Redirect if no questions data
      return;
    }
    setQuestions(location.state.questions);
  }, [location.state, navigate]);

  useEffect(() => {
    let timer;
    // Kiểm tra xem câu hỏi hiện tại đã được trả lời chưa
    const currentQuestionIndex = questions[currentQuestion]?.index;
    const isAnswered = userAnswers.some(a => a.questionIndex === currentQuestionIndex);

    if (showAnswer && !isViewingPrevious && !isAnswered) { // Chỉ đếm thời gian cho câu hỏi chưa được trả lời
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
    } else {
      setTimer(null); // Reset timer nếu câu hỏi đã được trả lời
    }
    return () => {
      clearInterval(timer);
    };
  }, [showAnswer, handleNext, isViewingPrevious, currentQuestion, questions, userAnswers]);

  const handleAnswerClick = (answerIndex) => {
    if (showAnswer) return; // Prevent selecting another answer while showing feedback
    setIsViewingPrevious(false); // Reset viewing previous when answering new question
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    setCanNavigate(true);
    
    // Sửa: Sử dụng index từ data thay vì currentQuestion
    const currentQuestionIndex = questions[currentQuestion].index;
    const existingAnswerIndex = userAnswers.findIndex(a => a.questionIndex === currentQuestionIndex);
    
    if (existingAnswerIndex !== -1) {
      const newUserAnswers = [...userAnswers];
      newUserAnswers[existingAnswerIndex] = {
        questionIndex: currentQuestionIndex, // Sử dụng index từ data
        userAnswer: answerIndex,
        isCorrect
      };
      setUserAnswers(newUserAnswers);
    } else {
      if (isCorrect) {
        setScore(score + 1);
      }
      setUserAnswers([...userAnswers, {
        questionIndex: currentQuestionIndex, // Sử dụng index từ data
        userAnswer: answerIndex,
        isCorrect
      }]);
    }
  };

  const handlePrevious = () => {
    const prevQuestion = currentQuestion - 1;
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion);
      setIsViewingPrevious(true); // Set viewing previous to true
      // Sửa: Sử dụng index từ data để tìm câu trả lời
      const prevQuestionIndex = questions[prevQuestion].index;
      const prevQuestionAnswer = userAnswers.find(a => a.questionIndex === prevQuestionIndex);
      if (prevQuestionAnswer) {
        setShowAnswer(true);
        setSelectedAnswer(prevQuestionAnswer.userAnswer);
        setTimer(null); // Reset timer when viewing previous
        setCanNavigate(true); // Thêm dòng này để enable nút Next
      }
    }
  };

  const handleEndQuiz = () => {
    navigate('/result', { 
      state: { 
        score,
        total: questions.length,
        packages: selectedPackages,
        questions: questions, // Gửi tất cả câu hỏi, không cắt slice
        userAnswers,
        earlyEnd: true,
        questionsAttempted: currentQuestion + 1
      } 
    });
  };

  // Thêm hàm tính số câu đã làm
  const getCompletedQuestions = () => {
    return userAnswers.length;
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto">
        <div className="space-y-4 sm:space-y-6">
          {/* Progress and End Quiz button */}
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

          {/* Update Question counter */}
          <div className="text-right">
            <Text strong className="text-sm sm:text-base">
              Câu {getRealQuestionNumber(questions[currentQuestion])} / {questions.length}
            </Text>
          </div>

          {/* Update Question text */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Title level={4} className="text-base sm:text-lg break-words whitespace-pre-wrap">
              <span className="font-bold">
                Câu {getRealQuestionNumber(questions[currentQuestion])}:
              </span> {questions[currentQuestion].question}
            </Title>
          </div>

          {/* Answer buttons */}
          <div className="space-y-3">
            {questions[currentQuestion].answers.map((answer, index) => (
              <Button 
                key={index}
                block
                size="large"
                onClick={() => !showAnswer && handleAnswerClick(index)}
                className={`text-left whitespace-pre-wrap break-words min-h-[60px] h-auto py-3 px-4 
                  ${showAnswer && index === questions[currentQuestion].correct ? 'border-green-500 bg-green-50' : ''}
                  ${showAnswer && index === selectedAnswer && index !== questions[currentQuestion].correct ? 'border-red-500 bg-red-50' : ''}
                  ${showAnswer ? 'cursor-default' : 'hover:border-gray-400'}`}
                style={{ opacity: 1 }}
              >
                <div className="flex">
                  <div className="flex-grow text-sm sm:text-base">{answer}</div>
                  {showAnswer && index === questions[currentQuestion].correct && (
                    <CheckCircleOutlined className="text-green-500 ml-2 flex-shrink-0" />
                  )}
                  {showAnswer && index === selectedAnswer && index !== questions[currentQuestion].correct && (
                    <CloseCircleOutlined className="text-red-500 ml-2 flex-shrink-0" />
                  )}
                </div>
              </Button>
            ))}
          </div>

          {/* Explanation */}
          {showAnswer && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <Text strong>
                  {selectedAnswer === questions[currentQuestion].correct 
                    ? "✅ Đúng!" 
                    : "❌ Sai!"}
                </Text>
                {timer && <Text>Chuyển câu sau: {timer}s</Text>}
              </div>
              {questions[currentQuestion].explanation && (
                <Text className="block mt-2 whitespace-pre-wrap break-words">
                  Giải thích: {questions[currentQuestion].explanation}
                </Text>
              )}
            </div>
          )}

          {/* Navigation buttons */}
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
              disabled={!showAnswer} // Chỉ disable khi chưa hiện đáp án
            >
              {currentQuestion === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Update Modal text */}
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
}

export default Quiz;

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Space, Progress, Typography, Modal, Spin, message } from 'antd';
import { StopOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function QuizPMP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [canNavigate, setCanNavigate] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isViewingPrevious, setIsViewingPrevious] = useState(false);
  const { selectedChapters } = location.state || {};

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app/rita.json');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        const selectedQuestions = selectedChapters.flatMap(chapterId => {
          const chapter = data[chapterId];
          return chapter.questions.map((q, index) => ({
            ...q,
            question: q.question,
            // Chuyển đổi options object thành mảng với key và value
            answers: Object.entries(q.options).map(([key, value]) => `${key}. ${value}`),
            // Map answer (D) sang index trong mảng answers (3)
            correct: Object.keys(q.options).indexOf(q.answer),
            explanation: q.explanation,
            index: index,
            chapterId: chapterId,
            // Giữ lại thông tin gốc cho phần review
            originalAnswer: q.answer,
            originalOptions: q.options
          }));
        });
        setQuestions(selectedQuestions);
        setLoading(false);
      } catch (error) {
        message.error('Không thể tải các câu hỏi');
        setLoading(false);
      }
    };

    if (selectedChapters) {
      fetchQuestions();
    }
  }, [selectedChapters]);

  const handleEndQuiz = useCallback(() => {
    navigate('/result-pmp', { 
      state: { 
        score,
        total: questions.length,
        questions,
        userAnswers,
        isPMP: true
      } 
    });
  }, [navigate, score, questions, userAnswers]);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsViewingPrevious(false);  // Reset flag when moving forward
      // Kiểm tra xem câu tiếp theo đã được trả lời chưa
      const nextAnswer = userAnswers.find(a => a.questionIndex === currentQuestion + 1);
      if (nextAnswer) {
        setShowAnswer(true);
        setSelectedAnswer(nextAnswer.userAnswer);
      } else {
        setShowAnswer(false);
        setSelectedAnswer(null);
      }
      setCanNavigate(false);
      setCountdown(null);
    } else {
      handleEndQuiz();
    }
  }, [currentQuestion, questions.length, handleEndQuiz, userAnswers]);

  useEffect(() => {
    let timer;
    if (showAnswer && !isViewingPrevious) {  // Only countdown if not viewing previous
      setCountdown(30); // Changed from 5 to 10
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            handleNext();
            return null;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [showAnswer, handleNext, isViewingPrevious]);

  const handleAnswerClick = (answerIndex) => {
    if (showAnswer) return;
    
    // Kiểm tra xem câu này đã được trả lời chưa
    const existingAnswer = userAnswers.find(a => a.questionIndex === currentQuestion);
    if (existingAnswer) return;

    const isCorrect = answerIndex === questions[currentQuestion].correct;
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    setCanNavigate(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    setUserAnswers([...userAnswers, {
      questionIndex: currentQuestion,
      userAnswer: answerIndex,
      isCorrect
    }]);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setIsViewingPrevious(true);  // Set flag when viewing previous
      // Lấy câu trả lời trước đó
      const prevAnswer = userAnswers.find(a => a.questionIndex === currentQuestion - 1);
      if (prevAnswer) {
        setShowAnswer(true);
        setSelectedAnswer(prevAnswer.userAnswer);
        setCanNavigate(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 min-h-screen bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <div className="space-y-2 sm:space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
            <Progress 
              percent={Math.round((currentQuestion / questions.length) * 100)} 
              className="w-full sm:flex-1"
            />
            <Button 
              type="default" 
              danger
              icon={<StopOutlined />}
              onClick={() => setShowEndModal(true)}
              className="w-full sm:w-auto"
            >
              Kết thúc bài thi
            </Button>
          </div>

          <Card className="bg-blue-50">
            <Text strong className="text-sm sm:text-base">
              {questions[currentQuestion].question}
            </Text>
          </Card>

          <Space direction="vertical" className="w-full" size="small">
            {questions[currentQuestion].answers.map((answer, index) => (
              <Card
                key={index}
                hoverable
                className={`cursor-pointer transition-all duration-300 text-sm sm:text-base ${
                  showAnswer && index === questions[currentQuestion].correct
                    ? 'border-2 border-green-500 bg-green-50'
                    : showAnswer && index === selectedAnswer
                    ? 'border-2 border-red-500 bg-red-50'
                    : 'hover:border-blue-500'
                }`}
                onClick={() => !showAnswer && handleAnswerClick(index)}
              >
                <div className="flex justify-between items-center">
                  <span className="pr-2">{answer}</span>
                  {showAnswer && index === questions[currentQuestion].correct && (
                    <CheckCircleOutlined className="text-green-500 text-lg sm:text-xl flex-shrink-0" />
                  )}
                  {showAnswer && index === selectedAnswer && index !== questions[currentQuestion].correct && (
                    <CloseCircleOutlined className="text-red-500 text-lg sm:text-xl flex-shrink-0" />
                  )}
                </div>
              </Card>
            ))}
          </Space>

          {showAnswer && (
            <Card className="bg-gray-50 border-blue-200">
              <Text strong className="block mb-1 sm:mb-2 text-base sm:text-lg">
                {selectedAnswer === questions[currentQuestion].correct 
                  ? "✅ Chính xác!" 
                  : "❌ Chưa chính xác!"}
              </Text>
              <Text className="block text-gray-700 text-sm sm:text-base">
                <strong>Giải thích:</strong> {questions[currentQuestion].explanation}
              </Text>
            </Card>
          )}

          <Card className="bg-transparent border-none">
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
              <Button 
                onClick={handlePrevious} 
                disabled={currentQuestion === 0}
                className="w-full sm:w-auto"
              >
                Câu trước
              </Button>
              <Text className="text-center">{countdown && `Chuyển câu sau ${countdown}s`}</Text>
              <Button 
                type="primary" 
                onClick={handleNext}
                disabled={!showAnswer}
                className="w-full sm:w-auto"
              >
                {currentQuestion === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp'}
              </Button>
            </div>
          </Card>
        </div>
      </Card>

      <Modal
        title="Kết thúc bài thi sớm"
        open={showEndModal}
        onOk={handleEndQuiz}
        onCancel={() => setShowEndModal(false)}
        okText="Có, kết thúc"
        cancelText="Không, tiếp tục"
      >
        <p>Bạn có chắc muốn kết thúc bài thi? Điểm hiện tại của bạn là: {score}/{currentQuestion + 1}</p>
      </Modal>
    </div>
  );
}

export default QuizPMP;

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Radio, Space, Progress, Modal, Typography, Spin, message } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function MockExamPMP() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [examCompleted, setExamCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!location.state?.questions || !location.state?.questions.length) {
      message.error('Không thể tải câu hỏi');
      navigate('/pmp');
      return;
    }
    setQuestions(location.state.questions);
  }, [location, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }));
  };

  const moveToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const finishExam = () => {
    setExamCompleted(true);
    calculateResults();
  };

  const confirmFinishEarly = () => {
    Modal.confirm({
      title: 'Kết thúc bài thi sớm?',
      content: 'Bạn có chắc chắn muốn kết thúc bài thi ngay bây giờ?',
      onOk: finishExam,
      okText: 'Đồng ý',
      cancelText: 'Hủy'
    });
  };

  const calculateResults = () => {
    let correct = 0;
    const detailedResults = questions.map((question, index) => ({
      question: question.question,
      options: question.options,
      correctAnswer: question.answer,
      userAnswer: answers[index],
      isCorrect: answers[index] === question.answer,
      explanation: question.explanation
    }));

    correct = detailedResults.filter(r => r.isCorrect).length;
    const score = (correct / 30 ) * 10;
    const timeSpent = 1800 - timeRemaining; // 30 minutes (1800s) - remaining time

    navigate('/mock-exam-results', {
      state: {
        correct,
        score,
        timeSpent,
        detailedResults,
        totalQuestions: 30
      }
    });
  };

  if (!questions.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex] || {};
  const { question = '', options = {} } = currentQuestion;

  return (
    <div className="min-h-screen">
      <div className="flex gap-6 max-w-[1800px] mx-auto">
        {/* Left column - Main content */}
        <div className="flex-[3]">
          <Card className="mb-4 shadow-md">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <Title level={4} className="!mb-0">Câu hỏi {currentQuestionIndex + 1}/30</Title>
              <div className="text-xl font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                {formatTime(timeRemaining)}
              </div>
            </div>

            <div className="mb-8">
              <Text className="text-base">{question}</Text>
            </div>

            {Object.keys(options).length > 0 && (
              <Radio.Group 
                onChange={(e) => handleAnswer(e.target.value)}
                value={answers[currentQuestionIndex]}
                className="w-full"
              >
                <Space direction="vertical" className="w-full">
                  {Object.entries(options).map(([key, value]) => (
                    <Radio key={key} value={key} className="w-full border p-3 rounded-lg hover:bg-gray-50">
                      <span className="text-sm">{key}. {value}</span>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            )}
          </Card>

          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
            <Button 
              disabled={currentQuestionIndex === 0}
              onClick={() => moveToQuestion(currentQuestionIndex - 1)}
              icon={<ArrowLeftOutlined />}
              size="large"
            >
              Câu trước
            </Button>

            <Button
              type="primary"
              danger
              onClick={confirmFinishEarly}
              size="large"
            >
              Kết thúc bài thi
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button 
                type="primary"
                onClick={finishExam}
                className="bg-green-600"
                size="large"
              >
                Nộp bài
              </Button>
            ) : (
              <Button 
                type="primary"
                onClick={() => moveToQuestion(currentQuestionIndex + 1)}
                icon={<ArrowRightOutlined />}
                size="large"
              >
                Câu tiếp
              </Button>
            )}
          </div>
        </div>

        {/* Right column - Question grid */}
        <div className="flex-1">
          <div className="sticky top-6 bg-white rounded-lg shadow-md">
            <div className="border-b p-4">
              <Title level={5} className="!mb-0">Danh sách câu hỏi</Title>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => (
                  <Button
                    key={index}
                    type={answers[index] !== undefined ? "primary" : "default"}
                    onClick={() => moveToQuestion(index)}
                    className={`
                      ${currentQuestionIndex === index ? "border-2 border-blue-500" : ""} 
                      h-10 font-medium
                      ${answers[index] !== undefined ? "shadow-sm" : ""}
                    `}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2 items-center mb-2">
                  <Button type="primary" size="small" className="w-8" />
                  <span className="text-xs">Đã trả lời</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Button size="small" className="w-8" />
                  <span className="text-xs">Chưa trả lời</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockExamPMP;

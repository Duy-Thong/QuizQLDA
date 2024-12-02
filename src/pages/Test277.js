import { useState, useEffect } from 'react';
import { Card, Radio, Button, Progress, Typography, Space, Modal } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Test277 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const questions = location.state?.questions || [];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          clearInterval(timer);
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
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleSubmit = () => {
    Modal.confirm({
      title: 'Xác nhận nộp bài?',
      content: 'Bạn có chắc chắn muốn nộp bài không?',
      onOk: () => {
        navigate('/resulttest277', {
          state: {
            answers,
            questions,
            timeSpent: 1800 - timeLeft
          }
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5">
      <Card className="shadow-md">
        <div className="sticky top-0 bg-white p-4 border-b mb-4">
          <Space direction="vertical" className="w-full">
            <div className="flex justify-between items-center">
              <Title level={4}>Bài thi thử PMP (30 câu)</Title>
              <Text strong className="text-xl text-red-500">
                {formatTime(timeLeft)}
              </Text>
            </div>
            <Progress 
              percent={Math.round((currentQuestion + 1) * 100 / questions.length)} 
              format={() => `${currentQuestion + 1}/${questions.length}`}
            />
          </Space>
        </div>

        {questions[currentQuestion] && (
          <div className="p-4">
            <Text strong className="text-lg mb-4 block">
              Câu {currentQuestion + 1}: {questions[currentQuestion].question}
            </Text>
            <Radio.Group
              className="flex flex-col gap-4"
              value={answers[currentQuestion]}
              onChange={(e) => handleAnswer(e.target.value)}
            >
              {Object.entries(questions[currentQuestion].options).map(([key, value]) => (
                <Radio key={key} value={key} className="text-base">
                  {value}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        )}

        <div className="flex justify-between mt-6 p-4 border-t">
          <Button 
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Câu trước
          </Button>
          <Button type="primary" danger onClick={handleSubmit}>
            Nộp bài
          </Button>
          <Button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentQuestion === questions.length - 1}
          >
            Câu sau
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Test277;

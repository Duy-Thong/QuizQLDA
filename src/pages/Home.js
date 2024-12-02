import { useNavigate } from 'react-router-dom';
import { Button, Typography, Spin, message, Card } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { fetchQuestions } from '../services/questionService';

const { Title } = Typography;

function Home() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        message.error('Không thể tải câu hỏi');
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleStartQuiz = (path) => {
    navigate(path, { 
      state: { 
        questions: questions,
        allQuestions: questions
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-8">
          <Title className="!text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center text-4xl md:text-5xl !mb-0">
            Ôn Tập Quản Lý Dự Án
          </Title>
          
          <Card className="w-full max-w-4xl shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-8">
                Chọn loại bài thi
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Bài thi 277 câu', path: '/277' },
                  { title: 'Bài thi 1200 câu', path: '/1200' },
                  { title: 'PMP Exam Prep', path: '/pmp' }
                ].map((quiz, index) => (
                  <Button
                    key={index}
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleStartQuiz(quiz.path)}
                    className="h-16 text-lg font-medium hover:scale-105 transition-transform duration-200"
                    style={{
                      background: 'linear-gradient(to right, #1890ff, #096dd9)',
                      border: 'none',
                    }}
                  >
                    {quiz.title}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
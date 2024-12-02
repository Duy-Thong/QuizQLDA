import { useState, useEffect } from 'react';
import { Typography, Spin, message, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function PMP() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      const response = await fetch('https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app/rita.json');
      if (!response.ok) {
        throw new Error('Failed to fetch chapters');
      }
      const data = await response.json();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    };

    const loadChapters = async () => {
      try {
        const data = await fetchChapters();
        setChapters(data);
        setLoading(false);
      } catch (error) {
        message.error('Không thể tải các chương');
        setLoading(false);
      }
    };
    loadChapters();
  }, []);

  const startQuiz = (chapterId) => {
    navigate('/quiz-pmp', { state: { selectedChapters: [chapterId] } });
  };

  const startMockExam = () => {
    const allQuestions = chapters.reduce((acc, chapter) => {
      return acc.concat(
        (chapter.questions || []).map(q => ({
          ...q,
          chapterId: chapter.id
        }))
      );
    }, []);

    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 30);

    navigate('/mock-exam-pmp', { 
      state: { 
        questions: selectedQuestions,
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="w-full mx-auto">
        <Title level={2} className="text-center mb-8 !text-gray-800">
          PMP EXAM PREP
        </Title>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <Card 
              key={chapter.id}
              hoverable
              className="transition-all duration-300 hover:shadow-lg border border-gray-200"
              bodyStyle={{ 
                height: '240px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-medium text-gray-800 text-center mb-4">
                  {chapter.name}
                </h3>
                <div className="flex items-center justify-center flex-1 mb-6">
                  <span className="text-lg text-gray-600">
                    {chapter.questions?.length || 0} câu hỏi
                  </span>
                </div>
                <Button 
                  type="primary"
                  onClick={() => startQuiz(chapter.id)}
                  size="large"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Bắt đầu
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center space-x-4">
          <Button 
            type="primary"
            size="large"
            onClick={startMockExam}
            className="min-w-[200px] h-12 text-lg bg-purple-600 hover:bg-purple-700 
                     transition-colors shadow-md hover:shadow-lg"
          >
            Thi thử (30 câu - 30 phút)
          </Button>
          <Button 
            type="primary"
            size="large"
            onClick={() => navigate('/view-all-pmp')}
            className="min-w-[200px] h-12 text-lg bg-green-600 hover:bg-green-700 
                       transition-colors shadow-md hover:shadow-lg"
          >
            Xem tất cả câu hỏi và đáp án
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PMP;

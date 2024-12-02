import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined, HomeOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function MockExamResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { correct, timeSpent, detailedResults, totalQuestions } = location.state || {};

  // Calculate score with 2 decimal places on a 10-point scale
  const score = ((correct / totalQuestions) * 10).toFixed(2);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-4 sm:mb-6">
          <Title level={2} className="text-center text-xl sm:text-2xl mb-4 sm:mb-6">Kết quả bài thi</Title>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Card className="p-2 sm:p-4">
              <Text strong className="text-sm sm:text-base">Số câu đúng:</Text>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {correct}/{totalQuestions}
              </div>
            </Card>
            
            <Card className="p-2 sm:p-4">
              <Text strong className="text-sm sm:text-base">Điểm số:</Text>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {score}
              </div>
            </Card>
            
            <Card className="p-2 sm:p-4">
              <Text strong className="text-sm sm:text-base">Thời gian làm bài:</Text>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {formatTime(timeSpent)}
              </div>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {detailedResults.map((result, index) => (
              <Card key={index} className="shadow-sm">
                <div className="flex flex-col sm:flex-row items-start gap-2">
                  <div className="font-bold text-sm sm:text-base w-full sm:w-auto">
                    Câu {index + 1}:
                  </div>
                  <div className="flex-1 w-full">
                    <div className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">{result.question}</div>
                    
                    <div className="space-y-2 mb-3 sm:mb-4">
                      {Object.entries(result.options).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-2 rounded text-sm sm:text-base ${
                            result.userAnswer === key && !result.isCorrect
                              ? 'bg-red-100'
                              : key === result.correctAnswer
                              ? 'bg-green-100'
                              : 'bg-gray-50'
                          }`}
                        >
                          {key}. {value}
                          {key === result.correctAnswer ? (
                            <span className="ml-2">
                              <CheckCircleOutlined className="text-green-500" />
                            </span>
                          ) : (result.userAnswer === key && !result.isCorrect) && (
                            <span className="ml-2">
                              <CloseCircleOutlined className="text-red-500" />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {result.explanation && (
                      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded text-sm sm:text-base">
                        <Text strong>Giải thích: </Text>
                        <div>{result.explanation}</div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-4 sm:mt-6">
            <Button 
              icon={<ArrowLeftOutlined />}
              size="large"
              onClick={() => navigate(-1)}
              className="min-w-[150px] sm:min-w-[200px]"
            >
              Trở về
            </Button>
            
            <Button 
              type="primary"
              icon={<HomeOutlined />}
              size="large"
              onClick={() => navigate('/pmp')}
              className="min-w-[150px] sm:min-w-[200px]"
            >
              Trang chủ
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MockExamResults;

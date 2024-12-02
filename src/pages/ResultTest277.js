import { useState, useEffect } from 'react';
import { Card, Typography, List, Tag, Button, Statistic, Row, Col } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ResultTest277 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, questions, timeSpent } = location.state || {};
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (answers && questions) {
      const correct = Object.entries(answers).reduce((acc, [index, answer]) => {
        return acc + (answer === questions[index].answer ? 1 : 0);
      }, 0);
      setScore(correct);
    }
  }, [answers, questions]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} phút ${remainingSeconds} giây`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Card className="max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden">
        <div className="text-center pb-6 border-b border-gray-200">
          <Title level={2} className="!text-2xl md:!text-3xl font-bold text-gray-800">
            Kết Quả Thi Thử PMP
          </Title>
        </div>

        <Row gutter={24} className="py-8">
          <Col xs={24} md={8} className="text-center mb-4 md:mb-0">
            <Card className="h-full bg-blue-50 border-0 rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-gray-600 font-medium">Điểm Số</span>}
                value={`${score}/${questions?.length}`}
                suffix={`(${Math.round(score * 100 / questions?.length)}%)`}
                valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8} className="text-center mb-4 md:mb-0">
            <Card className="h-full bg-purple-50 border-0 rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-gray-600 font-medium">Thời Gian</span>}
                value={formatTime(timeSpent)}
                valueStyle={{ color: '#722ed1', fontSize: '24px' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8} className="text-center">
            <Card className="h-full bg-green-50 border-0 rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-gray-600 font-medium">Kết Quả</span>}
                value={score >= 18 ? "Đạt" : "Chưa đạt"}
                valueStyle={{ 
                  color: score >= 18 ? '#52c41a' : '#f5222d',
                  fontSize: '24px'
                }}
              />
            </Card>
          </Col>
        </Row>

        <List
          className="mt-8"
          itemLayout="vertical"
          dataSource={questions}
          renderItem={(question, index) => (
            <List.Item className="border rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Tag color="blue" className="!text-base !px-3 !py-1">
                    Câu {index + 1}
                  </Tag>
                  <Text className="text-lg font-medium">{question.question}</Text>
                </div>
                <div className="ml-4 space-y-2">
                  {Object.entries(question.options).map(([key, value]) => (
                    <div 
                      key={key}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        answers[index] === key 
                          ? key === question.answer
                            ? 'bg-green-100 border border-green-300'
                            : 'bg-red-100 border border-red-300'
                          : key === question.answer
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex-1">
                          <Text strong className="mr-2">{key}.</Text>
                          {value}
                        </span>
                        {answers[index] === key && (
                          key === question.answer
                            ? <CheckCircleOutlined className="text-green-500 text-xl" />
                            : <CloseCircleOutlined className="text-red-500 text-xl" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </List.Item>
          )}
        />

        <div className="flex justify-center mt-8">
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate('/')}
            className="px-8 h-12 rounded-lg text-lg hover:scale-105 transition-transform"
          >
            Quay lại trang chủ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResultTest277;

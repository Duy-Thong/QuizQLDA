import { useState, useEffect } from 'react';
import { Radio, Button, Card, Typography, Checkbox, Row, Col, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import Quiz2 from './Quiz2';

const { Text, Title } = Typography;

const Question277 = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [topicSets, setTopicSets] = useState([]); // New state for topic-based sets
  const [selectedSets, setSelectedSets] = useState([]); // Changed from selectedSet to selectedSets
  const [startQuiz, setStartQuiz] = useState(false);
  const [viewMode, setViewMode] = useState('numeric'); // New state for view mode
  const [mockExamQuestions, setMockExamQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionSet = async () => {
      try {
        const response = await fetch('https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app/277/-OCcPxP7mgos5yKb_9Tg/questions.json');
        const questions = await response.json();
        
        // Original numeric sets
        const numericSets = [];
        for (let i = 0; i < questions.length; i += 50) {
          numericSets.push({
            name: `Gói ${Math.floor(i/50) + 1} (Câu hỏi ${i + 1}-${Math.min(i + 50, questions.length)})`,
            questions: questions.slice(i, i + 50)
          });
        }
        
        // Topic-based sets
        const topicRanges = [
          { name: "Giới thiệu", range: [0, 19] },
          { name: "Môi trường dự án", range: [20, 31] },
          { name: "The Role of the Project Manager", range: [32, 46] },
          { name: "Project Integration Management", range: [47, 59] },
          { name: "Project Scope Management", range: [60, 76] },
          { name: "Project Schedule Management", range: [76, 99] },
          { name: "Project Cost Management", range: [100, 125] },
          { name: "Project Quality Management", range: [126, 143] },
          { name: "Project Resource Management", range: [144, 162] },
          { name: "Project Communications Management", range: [163, 174] },
          { name: "Project Risk Management", range: [175, 194] },
          { name: "Project Procurement Management", range: [195, 210] },
          { name: "Project Stakeholder Management", range: [212, 225] },
          { name: "Appendix X3", range: [226, 230] },
          { name: "Appendix X4", range: [231, 240] },
          { name: "Appendix X5", range: [241, 246] },
          { name: "Glossary", range: [247, 276] }
        ];

        const topicBasedSets = topicRanges.map(topic => ({
          name: `${topic.name} (Câu ${topic.range[0] + 1}-${topic.range[1] + 1})`,
          questions: questions.slice(topic.range[0], topic.range[1] + 1)
        }));

        setQuestionSets(numericSets);
        setTopicSets(topicBasedSets);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestionSet();
  }, []);

  const handleSetChange = (values) => {
    setSelectedSets(values);
  };

  const handleStartQuiz = () => {
    if (selectedSets.length > 0) {
      // Get the correct set of questions based on viewMode
      const currentSets = viewMode === 'numeric' ? questionSets : topicSets;
      
      // Combine all selected question sets
      const combinedQuestions = selectedSets.reduce((acc, setIndex) => {
        return [...acc, ...currentSets[setIndex].questions];
      }, []);
      
      navigate('/quiz2', { 
        state: { questions: combinedQuestions }
      });
    }
  };

  const handleViewAllQuestions = () => {
    // Get all questions from the current view mode
    const currentSets = viewMode === 'numeric' ? questionSets : topicSets;
    
    if (currentSets.length > 0) {
      const allQuestions = currentSets.reduce((acc, set) => {
        return [...acc, ...set.questions];
      }, []);
      
      navigate('/review-all-277', { 
        state: { questions: allQuestions }
      });
    }
  };

  const handleMockExam = () => {
    const currentSets = viewMode === 'numeric' ? questionSets : topicSets;
    if (currentSets.length > 0) {
      // Get all questions
      const allQuestions = currentSets.reduce((acc, set) => {
        return [...acc, ...set.questions];
      }, []);
      
      // Randomly select 30 questions instead of 180
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 30);
      
      navigate('/test277', { 
        state: { 
          questions: selected
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 w-full">
      <Card className="shadow-md">
        <Title 
          level={2} 
          className="text-center text-blue-500 md:text-3xl text-2xl mb-6"
        >
          277 câu hỏi Quản lý dự án
        </Title>

        <div className="mb-4">
          <Radio.Group 
            value={viewMode} 
            onChange={(e) => {
              setViewMode(e.target.value);
              setSelectedSets([]);
            }}
            className="mb-4"
          >
            <Radio.Button value="numeric">Theo số lượng</Radio.Button>
            <Radio.Button value="topic">Theo chủ đề</Radio.Button>
          </Radio.Group>
        </div>

        <div className="bg-gray-100 p-4 md:p-5 rounded-lg mb-5">
          <Checkbox.Group 
            onChange={handleSetChange} 
            value={selectedSets}
            className="flex flex-col space-y-3"
          >
            {(viewMode === 'numeric' ? questionSets : topicSets).map((set, index) => (
              <Checkbox key={index} value={index}>
                <span className="md:text-base text-sm">
                  {set.name}
                </span>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>

        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={12} lg={8}>
            <Button
              type="primary"
              size="large"
              onClick={handleStartQuiz}
              disabled={selectedSets.length === 0}
              block
              className="h-12 font-bold text-base"
            >
              Bắt đầu làm bài
            </Button>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Button
              type="default"
              size="large"
              onClick={handleViewAllQuestions}
              disabled={questionSets.length === 0}
              block
              className="h-12 font-bold text-base"
            >
              Xem tất cả câu hỏi
            </Button>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Button
              type="primary"
              size="large"
              onClick={handleMockExam}
              disabled={questionSets.length === 0}
              block
              className="h-12 font-bold text-base bg-green-500 hover:bg-green-600"
            >
              Thi thử (30 câu - 30 phút)
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Question277;

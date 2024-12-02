import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { Analytics } from "@vercel/analytics/react";
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Quiz2 from './pages/Quiz2';
import ResultPage from './pages/Result';
import ReviewAnswers from './pages/ReviewAnswers';
import Questions from './pages/Questions';
import Question1200 from './pages/Question1200';
import Question277 from './pages/Question277';
import Result2 from './pages/Result2';
import ReviewAnswer2 from './pages/ReviewAnswer2';
import ViewAllQuestions from './pages/ViewAllQuestions';
import PMP from './pages/PMP';
import QuizPMP from './pages/QuizPMP';
import ResultPMP from './pages/ResultPMP';
import ReviewPMP from './pages/ReviewPMP';
import ViewAllPMP from './pages/ViewAllPMP';
import MockExamPMP from './pages/MockExamPMP';
import MockExamResults from './pages/MockExamResults';
import Test277 from './pages/Test277';
import ResultTest277 from './pages/ResultTest277';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout className="min-h-screen flex flex-col">
        <Header className="bg-white px-4">
          <Navigation />
        </Header>
        <Content className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz2" element={<Quiz2 />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path='/review' element={<ReviewAnswers />} />
            <Route path='/review-all-1200' element={<Questions />} />
            <Route path='/1200' element={<Question1200 />} />
            <Route path='/277' element={<Question277 />} />
            <Route path='/result2' element={<Result2 />} />
            <Route path='/review-answers2' element={<ReviewAnswer2 />} />
            <Route path="/review-all-277" element={<ViewAllQuestions />} />
            <Route path="/pmp" element={<PMP />} />
            <Route path="/quiz-pmp" element={<QuizPMP />} />
            <Route path="/result-pmp" element={<ResultPMP />} />
            <Route path="/review-pmp" element={<ReviewPMP />} />
            <Route path="/view-all-pmp" element={<ViewAllPMP />} />
            <Route path="/mock-exam-pmp" element={<MockExamPMP />} />
            <Route path="/mock-exam-results" element={<MockExamResults />} />
            <Route path="/test277" element={<Test277 />} />
            <Route path="/resulttest277" element={<ResultTest277 />} />
          </Routes>
        </Content>
        <Footer className="text-center bg-white mt-auto">
          <p className="text-gray-600">
            © {new Date().getFullYear()} | Web : <a href="https://github.com/Duy-Thong" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Đào Duy Thông</a> | Data: <a href="https://github.com/HaNguyen1099" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Nguyễn Ngọc Hà</a>
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Project Management - PTIT
          </p>
        </Footer>
      </Layout>
      <Analytics />
    </Router>
  );
}

export default App;

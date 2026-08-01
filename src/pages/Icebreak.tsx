import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Users, 
  Clock, 
  ChevronRight,
  Lightbulb,
  Vote,
  Eye,
  EyeOff,
  Smile,
  Zap
} from 'lucide-react';

const questions = [
  {
    id: 1,
    type: 'open',
    question: '如果这门课只能取消一个环节，你希望取消汇报还是写报告？',
    context: '产品设计课程 · 第3题',
    timeLeft: '02:30',
  },
  {
    id: 2,
    type: 'vote',
    question: '在团队合作中，你更倾向于哪种风格？',
    options: ['快速迭代，先做再改', '深思熟虑，一次做对', '分工明确，各司其职', '头脑风暴，集思广益'],
    context: '项目协作 · 观点站队',
    timeLeft: '01:45',
  },
  {
    id: 3,
    type: 'choice',
    question: '周末工作时，你最喜欢的背景音是什么？',
    options: ['咖啡馆环境音', '轻音乐', '播客节目', '完全安静'],
    context: '快速选择 · 了解彼此',
    timeLeft: '01:00',
  },
];

const mockAnswers = [
  { id: 1, user: '张同学', avatar: '👩', content: '取消汇报！我更享受写代码的过程', time: '5分钟前', isAnonymous: false },
  { id: 2, user: '匿名用户', avatar: '👤', content: '报告可以展示成果，但汇报真的太紧张了', time: '3分钟前', isAnonymous: true },
  { id: 3, user: '李同学', avatar: '🧑', content: '都不想取消，我觉得两个都很重要', time: '1分钟前', isAnonymous: false },
];

export default function Icebreak() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedVote, setSelectedVote] = useState<number | null>(null);
  const [showAIPrompt, setShowAIPrompt] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    if (currentQuestion.type === 'open' && answer.trim()) {
      setAnswer('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-pink-50 pb-20 md:pb-0">
      {/* AI Prompt Bar */}
      {showAIPrompt && (
        <div className="fixed top-16 left-0 right-0 z-40 px-4 animate-slide-in-down">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-brand-500 to-purple-500 rounded-2xl shadow-lg p-4 flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">AI 小贴士</p>
                <p className="text-sm text-white/80">主动分享你的真实想法，让破冰更有深度 ✨</p>
              </div>
              <button 
                onClick={() => setShowAIPrompt(false)}
                className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>

          {/* Activity Info */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg">产品设计课程组队</h1>
                <p className="text-sm text-gray-500">6 位成员 · 进行中</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{currentQuestion.timeLeft}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                问题 {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span className="text-sm text-brand-600 font-medium">
                {Math.round((currentQuestionIndex + 1) / questions.length * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentQuestionIndex + 1) / questions.length * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8 animate-fade-in-up">
            <div className="bg-gradient-to-br from-brand-500 to-purple-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
                  <Lightbulb className="w-4 h-4" />
                  {currentQuestion.context}
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>
            </div>

            {/* Answer Section */}
            <div className="p-6">
              {currentQuestion.type === 'open' && (
                <>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="写下你的想法..."
                    className="w-full h-32 p-4 rounded-xl border-2 border-gray-100 focus:border-brand-300 focus:outline-none resize-none transition-colors"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className="flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors"
                    >
                      {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{isAnonymous ? '匿名模式' : '显示昵称'}</span>
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!answer.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      提交回答
                      <Send className="ml-2 w-4 h-4 inline-block" />
                    </button>
                  </div>
                </>
              )}

              {(currentQuestion.type === 'vote' || currentQuestion.type === 'choice') && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVote(index)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        selectedVote === index
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-100 hover:border-brand-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedVote === index ? 'border-brand-500 bg-brand-500' : 'border-gray-300'
                        }`}>
                          {selectedVote === index && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className={selectedVote === index ? 'text-brand-700 font-medium' : 'text-gray-700'}>
                          {option}
                        </span>
                        <Vote className={`w-4 h-4 ml-auto ${selectedVote === index ? 'text-brand-500' : 'text-gray-300'}`} />
                      </div>
                    </button>
                  ))}
                  {selectedVote !== null && (
                    <button
                      onClick={() => {
                        setSelectedVote(null);
                        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
                      }}
                      className="btn-primary w-full mt-4"
                    >
                      提交并下一题
                      <ChevronRight className="ml-2 w-4 h-4 inline-block" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Other Answers */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">其他人的回答</h3>
              <div className="flex items-center gap-2 text-sm">
                <button className="px-3 py-1 rounded-full bg-brand-100 text-brand-600 font-medium">全部</button>
                <button className="px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100">只看昵称</button>
                <button className="px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100">只看匿名</button>
              </div>
            </div>
            <div className="space-y-3">
              {mockAnswers.map((ans, index) => (
                <div 
                  key={ans.id}
                  className="bg-white rounded-2xl p-4 shadow-sm animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                      ans.isAnonymous ? 'bg-gray-100' : 'bg-gradient-to-br from-brand-100 to-pink-100'
                    }`}>
                      {ans.isAnonymous ? '👤' : ans.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${ans.isAnonymous ? 'text-gray-400' : 'text-gray-900'}`}>
                          {ans.isAnonymous ? '匿名用户' : ans.user}
                        </span>
                        <span className="text-xs text-gray-400">{ans.time}</span>
                      </div>
                      <p className="text-gray-700">{ans.content}</p>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Smile className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Question Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => (prev + 1) % questions.length)}
              className="btn-secondary flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              跳过此题
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

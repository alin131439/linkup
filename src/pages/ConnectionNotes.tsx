import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {
  ArrowLeft,
  Sparkles,
  Save,
  Tag,
  User,
  Lightbulb,
} from 'lucide-react';

const memberExtras: Record<string, { tags: string[]; topics: string[] }> = {
  m1: { tags: ['AI工具', '设计思维', '远程办公'], topics: ['分享最近发现的AI工具', '聊聊远程办公的技巧'] },
  m2: { tags: ['摄影', '咖啡文化'], topics: ['推荐一家好咖啡馆', '分享摄影作品'] },
  m3: { tags: ['独立开发', '创业', '阅读'], topics: ['讨论独立开发经验', '推荐好书'] },
  m4: { tags: ['设计思维', 'AI工具'], topics: ['聊聊设计方法论', '分享AI使用技巧'] },
  m5: { tags: ['产品管理', '用户研究', 'AI工具'], topics: ['聊聊产品方法论', '分享用户研究心得'] },
  m6: { tags: ['用户研究', '设计思维', '摄影'], topics: ['分享调研方法', '聊聊设计思维'] },
  m7: { tags: ['创业', '独立开发', '阅读'], topics: ['讨论创业方向', '推荐创业好书'] },
  m8: { tags: ['AI工具', '产品管理', '远程办公'], topics: ['分享AI在产品中的应用', '聊聊远程协作经验'] },
  m9: { tags: ['独立开发', '设计思维', 'AI工具'], topics: ['分享独立开发作品', '讨论设计与AI结合'] },
  m10: { tags: ['摄影', 'AI工具', '阅读'], topics: ['分享AI辅助摄影技巧', '推荐摄影书籍'] },
  m11: { tags: ['创业', '产品管理', '远程办公'], topics: ['聊聊创业项目', '分享远程管理经验'] },
  m12: { tags: ['用户研究', '摄影', '咖啡文化'], topics: ['分享调研案例', '推荐有格调的咖啡馆'] },
};

const TAG_POOL = [
  'AI探索者',
  '深度思考型',
  '创意贡献者',
  '行动派',
  '创业伙伴',
  '产品思维',
  '设计感强',
  '执行力强',
  '沟通舒服',
  '有趣的人',
  '值得长期交流',
  '同频共振',
];

interface KeywordRule {
  keywords: string[];
  tags: string[];
}

const AI_TAG_RULES: KeywordRule[] = [
  { keywords: ['创业', '创投', 'startup', 'ceo', '创始人'], tags: ['创业伙伴', '行动派', '值得长期交流'] },
  { keywords: ['AI', '人工智能', 'ai工具', '大模型', 'llm', 'gpt'], tags: ['AI探索者', '产品思维', '创意贡献者'] },
  { keywords: ['产品', 'product', '需求', '用户'], tags: ['产品思维', '深度思考型'] },
  { keywords: ['设计', 'design', 'ui', 'ux', '界面'], tags: ['设计感强', '创意贡献者'] },
  { keywords: ['执行', '落地', '推进', '高效', '靠谱'], tags: ['执行力强', '行动派'] },
  { keywords: ['沟通', '交流', '聊天', '表达', '舒服'], tags: ['沟通舒服', '有趣的人', '同频共振'] },
  { keywords: ['思考', '想法', '深度', '洞察', '见解'], tags: ['深度思考型', '同频共振'] },
  { keywords: ['创意', '有趣', '有意思', '好玩', '有意思'], tags: ['创意贡献者', '有趣的人'] },
  { keywords: ['同频', '共振', '契合', '聊得来', '投机'], tags: ['同频共振', '值得长期交流'] },
  { keywords: ['长期', '持续', '稳定', '深入'], tags: ['值得长期交流', '执行力强'] },
  { keywords: ['独立', '自主', '独立开发', '全栈'], tags: ['行动派', '创意贡献者'] },
  { keywords: ['学习', '成长', '进步', '钻研', '研究'], tags: ['深度思考型', 'AI探索者'] },
  { keywords: ['摄影', '艺术', '审美', '美学'], tags: ['设计感强', '有趣的人'] },
  { keywords: ['咖啡', '生活', '品质', '享受'], tags: ['有趣的人', '沟通舒服'] },
];

const GENERAL_TAGS = ['同频共振', '值得长期交流', '有趣的人', '沟通舒服', '创意贡献者'];

function generateAITags(note: string, memberTags: string[]): string[] {
  const lowerNote = note.toLowerCase();
  const matchedTags = new Set<string>();

  for (const rule of AI_TAG_RULES) {
    for (const keyword of rule.keywords) {
      if (lowerNote.includes(keyword.toLowerCase())) {
        rule.tags.forEach((t) => matchedTags.add(t));
        break;
      }
    }
  }

  const extraTags = new Set<string>();
  for (const mt of memberTags) {
    const mtLower = mt.toLowerCase();
    if (mtLower.includes('ai') || mtLower.includes('人工智能')) {
      extraTags.add('AI探索者');
      extraTags.add('产品思维');
    }
    if (mtLower.includes('设计')) {
      extraTags.add('设计感强');
    }
    if (mtLower.includes('创业')) {
      extraTags.add('创业伙伴');
      extraTags.add('行动派');
    }
    if (mtLower.includes('摄影') || mtLower.includes('艺术')) {
      extraTags.add('设计感强');
      extraTags.add('有趣的人');
    }
    if (mtLower.includes('独立开发')) {
      extraTags.add('行动派');
      extraTags.add('创意贡献者');
    }
  }

  const allTags = new Set([...matchedTags, ...extraTags]);

  if (allTags.size === 0) {
    GENERAL_TAGS.forEach((t) => allTags.add(t));
  }

  const shuffled = Array.from(allTags).sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(6, Math.max(4, shuffled.length)));
}

export default function ConnectionNotes() {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();

  const members = useStore((s) => s.members);
  const getNote = useStore((s) => s.getNote);
  const saveNote = useStore((s) => s.saveNote);

  const [noteText, setNoteText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const member = members.find((m) => m.id === memberId);
  const extras = memberId ? memberExtras[memberId] : undefined;
  const memberTags = extras?.tags || [];
  const existingNote = memberId ? getNote(memberId) : undefined;
  const isEmpty = !existingNote && !noteText;

  useEffect(() => {
    if (existingNote) {
      setNoteText(existingNote.note);
      setSelectedTags(existingNote.tags);
      setSavedAt(existingNote.createdAt);
    }
  }, [existingNote]);

  const handleGenerateTags = useCallback(() => {
    setAiLoading(true);
    setShowSuggestions(true);
    setTimeout(() => {
      const tags = generateAITags(noteText, memberTags);
      setSuggestedTags(tags);
      setAiLoading(false);
    }, 600);
  }, [noteText, memberTags]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleSave = useCallback(() => {
    if (!memberId) return;
    setIsSaving(true);
    setTimeout(() => {
      saveNote(memberId, noteText, selectedTags);
      setSavedAt(Date.now());
      setIsSaving(false);
    }, 400);
  }, [memberId, noteText, selectedTags, saveNote]);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const h = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}`;
  };

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-white">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">未找到该成员</p>
          <button
            onClick={() => navigate('/connections')}
            className="px-6 py-2.5 bg-gradient-to-r from-brand-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(`/chat/${memberId}`)}
            className="p-2 -ml-2 text-gray-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-gray-900 flex-1">连接笔记</h1>
          {savedAt && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              已保存
            </span>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
              {member.avatar}
            </div>
            <div>
              <h2 className="text-lg font-bold">{member.name}</h2>
              {memberTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {memberTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
            <Lightbulb className="w-12 h-12 text-brand-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-1">还没有笔记</p>
            <p className="text-gray-400 text-sm">写下你对这位连接的第一印象吧</p>
          </div>
        ) : (
          savedAt && (
            <div className="flex items-center gap-2 text-xs text-gray-400 px-1">
              <Save className="w-3 h-3" />
              <span>上次保存于 {formatDate(savedAt)}</span>
            </div>
          )
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Lightbulb className="w-4 h-4 text-brand-500" />
            写下你的印象
          </label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="例如：沟通舒服、想法有趣、执行力强..."
            className="w-full min-h-[140px] px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-gray-400 leading-relaxed"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4 text-brand-500" />
              AI 智能标签
            </label>
            <button
              onClick={handleGenerateTags}
              disabled={aiLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {aiLoading ? '生成中...' : '✨ AI生成标签'}
            </button>
          </div>

          {showSuggestions && (
            <div className="animate-fade-in">
              <p className="text-xs text-gray-400 mb-3">
                基于你的笔记内容和对方标签，为你推荐：
              </p>
              {aiLoading ? (
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-20 bg-gray-100 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-brand-500 to-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!showSuggestions && selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-brand-500 to-purple-600 text-white shadow-md transition-all hover:opacity-90"
                >
                  {tag} ×
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedTags.length > 0 && (
          <div className="bg-brand-50 rounded-xl p-3">
            <p className="text-xs text-brand-700 font-medium mb-2">已选标签</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-white rounded-full text-xs text-brand-700 font-medium border border-brand-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving || (!noteText.trim() && selectedTags.length === 0)}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-brand-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Save className="w-5 h-5" />
          {isSaving ? '保存中...' : '保存笔记'}
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">
          📝 这些笔记仅对你自己可见，不会分享给任何人
        </p>
      </div>
    </div>
  );
}
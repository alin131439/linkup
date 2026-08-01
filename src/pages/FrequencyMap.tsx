import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Users, 
  User,
  ChevronRight,
  Sparkles,
  Filter,
  Tag,
  BarChart3,
  Coffee,
  Camera,
  Code,
  Palette,
  Rocket,
  Brain
} from 'lucide-react';

const frequencyTags = [
  { name: 'AI工具', count: 4, category: 'tech', color: 'bg-brand-500' },
  { name: '摄影', count: 2, category: 'hobby', color: 'bg-pink-500' },
  { name: '远程办公', count: 3, category: 'work', color: 'bg-blue-500' },
  { name: '创业', count: 2, category: 'career', color: 'bg-green-500' },
  { name: '设计思维', count: 3, category: 'skill', color: 'bg-orange-500' },
  { name: '独立开发', count: 2, category: 'tech', color: 'bg-purple-500' },
  { name: '咖啡文化', count: 4, category: 'lifestyle', color: 'bg-amber-500' },
  { name: '阅读', count: 3, category: 'lifestyle', color: 'bg-teal-500' },
];

const connections = [
  { 
    id: 1, 
    name: '张同学', 
    avatar: '👩', 
    tags: ['AI工具', '设计思维', '远程办公'],
    matchScore: 85,
    isMatch: true
  },
  { 
    id: 2, 
    name: '李同学', 
    avatar: '🧑', 
    tags: ['摄影', '咖啡文化'],
    matchScore: 72,
    isMatch: true
  },
  { 
    id: 3, 
    name: '王同学', 
    avatar: '👨', 
    tags: ['独立开发', '创业', '阅读'],
    matchScore: 68,
    isMatch: false
  },
  { 
    id: 4, 
    name: '赵同学', 
    avatar: '👩‍🦰', 
    tags: ['设计思维', 'AI工具'],
    matchScore: 65,
    isMatch: true
  },
];

const iconMap: Record<string, React.ElementType> = {
  'AI工具': Brain,
  '摄影': Camera,
  '远程办公': Users,
  '创业': Rocket,
  '设计思维': Palette,
  '独立开发': Code,
  '咖啡文化': Coffee,
  '阅读': Tag,
  '产品管理': BarChart3,
  '用户研究': Sparkles,
};

export default function FrequencyMap() {
  const [viewMode, setViewMode] = useState<'all' | 'personal'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredTags = selectedTag 
    ? frequencyTags.filter(t => t.name === selectedTag)
    : frequencyTags;

  const filteredConnections = selectedTag
    ? connections.filter(c => c.tags.includes(selectedTag))
    : viewMode === 'personal'
    ? connections.filter(c => c.isMatch)
    : connections;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20 md:pb-0">
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/icebreak" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              返回破冰
            </Link>
            <button className="btn-secondary flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              分享地图
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              AI 生成的团队认知地图
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              你的团队有<span className="gradient-text">5个共同点</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              从破冰互动中，我们发现了团队成员之间的深度连接。点击标签查看详情
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
              <button
                onClick={() => setViewMode('all')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${
                  viewMode === 'all' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-500'
                }`}
              >
                <Users className="w-4 h-4" />
                全部
              </button>
              <button
                onClick={() => setViewMode('personal')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${
                  viewMode === 'personal' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-500'
                }`}
              >
                <User className="w-4 h-4" />
                与我相关
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tag Cloud */}
            <div className="bg-white rounded-3xl shadow-lg p-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand-500" />
                  共性标签云
                </h2>
                <button 
                  onClick={() => setSelectedTag(null)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  {selectedTag ? '清除筛选' : '筛选'}
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {filteredTags.map((tag, index) => {
                  const size = Math.min(24 + tag.count * 4, 40);
                  return (
                    <button
                      key={tag.name}
                      onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
                      className={`px-4 py-2 rounded-full font-medium text-white transition-all duration-300 animate-fade-in-up ${tag.color} ${
                        selectedTag === tag.name ? 'ring-4 ring-offset-2 ring-brand-300 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ 
                        animationDelay: `${index * 80}ms`,
                        fontSize: `${Math.min(14 + tag.count, 20)}px`
                      }}
                    >
                      {tag.name}
                      <span className="ml-2 text-sm opacity-80">{tag.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interest Distribution */}
            <div className="bg-white rounded-3xl shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-500" />
                  兴趣分布
                </h2>
                <span className="text-sm text-gray-500">共 12 个标签</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: '科技', percentage: 35, color: 'from-brand-500 to-purple-500' },
                  { label: '生活方式', percentage: 25, color: 'from-pink-500 to-orange-400' },
                  { label: '技能', percentage: 20, color: 'from-green-400 to-teal-500' },
                  { label: '兴趣爱好', percentage: 12, color: 'from-blue-400 to-cyan-500' },
                  { label: '职业', percentage: 8, color: 'from-amber-400 to-yellow-500' },
                ].map((item, index) => (
                  <div key={item.label} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="text-sm text-gray-500">{item.percentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connection Cards */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">
                {viewMode === 'personal' ? '与你相关的连接' : '团队连接线索'}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredConnections.length} 位成员有共同点
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredConnections.map((connection, index) => {
                const AvatarIcon = connection.tags[0] ? (iconMap[connection.tags[0]] ?? User) : User;
                return (
                  <div
                    key={connection.id}
                    className={`card card-hover p-5 animate-fade-in-up ${
                      selectedTag && !connection.tags.includes(selectedTag) ? 'opacity-40' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-pink-100 flex items-center justify-center text-2xl">
                          {connection.avatar}
                        </div>
                        {connection.isMatch && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                          <span className="text-xs bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full font-medium">
                            {connection.matchScore}% 匹配
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {connection.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-xs px-2 py-1 rounded-full ${
                                selectedTag === tag
                                  ? 'bg-brand-500 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="flex-1 btn-primary text-sm py-2">
                            查看详情
                            <ChevronRight className="ml-1 w-4 h-4 inline-block" />
                          </button>
                          <button className="p-2 rounded-full bg-gray-100 hover:bg-brand-100 transition-colors">
                            <AvatarIcon className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-12 text-center">
            <Link to="/connections" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
              前往留灯
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

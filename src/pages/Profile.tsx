import { Link } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Award, 
  TrendingUp,
  Calendar,
  Tag,
  ChevronRight,
  Sparkles,
  Crown,
  BarChart3,
  Heart,
  Clock,
  Users,
  ArrowRight,
  Lock,
  Bell,
  Download
} from 'lucide-react';

const connectionHistory = [
  {
    id: 1,
    name: '张同学',
    avatar: '👩',
    activity: '产品设计课程组队',
    date: '2天前',
    tags: ['AI工具', '设计思维'],
    mutualLight: true,
  },
  {
    id: 2,
    name: '李同学',
    avatar: '🧑',
    activity: '产品设计课程组队',
    date: '2天前',
    tags: ['摄影', '咖啡文化'],
    mutualLight: false,
  },
  {
    id: 3,
    name: '刘总',
    avatar: '👨‍💼',
    activity: 'AI创新项目协作',
    date: '15天前',
    tags: ['创业', 'AI工具'],
    mutualLight: true,
  },
];

const stats = {
  totalActivities: 12,
  totalConnections: 38,
  mutualLights: 8,
  matchRate: 67,
};

const topTags = [
  { name: 'AI工具', count: 8, color: 'bg-brand-500' },
  { name: '设计思维', count: 6, color: 'bg-pink-500' },
  { name: '创业', count: 5, color: 'bg-green-500' },
  { name: '远程办公', count: 4, color: 'bg-blue-500' },
  { name: '摄影', count: 3, color: 'bg-orange-500' },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-50 pb-20 md:pb-0">
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-3xl p-6 md:p-8 text-white mb-8 animate-fade-in-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                  🧑
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-display font-bold">小明同学</h1>
                    <span className="px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Pro
                    </span>
                  </div>
                  <p className="text-white/80">连接了 38 位朋友 · 参与 12 个活动</p>
                </div>
                <button className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: '参与活动', value: stats.totalActivities, icon: Calendar, color: 'from-brand-400 to-brand-600' },
              { label: '连接总数', value: stats.totalConnections, icon: Users, color: 'from-pink-400 to-pink-600' },
              { label: '互留成功', value: stats.mutualLights, icon: Heart, color: 'from-green-400 to-green-600' },
              { label: '匹配率', value: `${stats.matchRate}%`, icon: TrendingUp, color: 'from-amber-400 to-orange-500' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl shadow-sm p-5 animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-display font-bold text-gray-900">{stat.value}</div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Social Portrait */}
            <div className="lg:col-span-2 space-y-6">
              {/* Social Portrait Card */}
              <div className="bg-white rounded-3xl shadow-sm p-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    社交画像
                  </h2>
                  <button className="text-sm text-brand-600 flex items-center gap-1 hover:gap-2 transition-all">
                    查看详情
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '擅长话题', value: 'AI科技', icon: Sparkles },
                    { label: '最佳场景', value: '课程组队', icon: Users },
                    { label: '高频标签', value: '设计', icon: Tag },
                    { label: '社交效率', value: '高效', icon: BarChart3 },
                  ].map((item, i) => (
                    <div 
                      key={item.label}
                      className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 text-center"
                    >
                      <item.icon className="w-6 h-6 mx-auto mb-2 text-brand-500" />
                      <div className="font-semibold text-gray-900">{item.value}</div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connection History */}
              <div className="bg-white rounded-3xl shadow-sm p-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-500" />
                    连接记录
                  </h2>
                  <div className="flex items-center gap-2">
                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
                      <option>全部场景</option>
                      <option>课程组队</option>
                      <option>项目合作</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  {connectionHistory.map((connection, index) => (
                    <div
                      key={connection.id}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-pink-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {connection.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{connection.name}</h3>
                          {connection.mutualLight && (
                            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Heart className="w-3 h-3 fill-current" />
                              互留
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{connection.activity}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {connection.tags.map(tag => (
                            <span key={tag} className="text-xs text-gray-400">#{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-gray-500">{connection.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors flex items-center justify-center gap-2">
                  查看全部连接
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pro Card */}
              <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500 rounded-3xl p-6 text-white animate-fade-in-up relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-6 h-6" />
                    <span className="font-bold">Pro 会员</span>
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">解锁更多洞察</h3>
                  <p className="text-white/90 text-sm mb-4">
                    获取详细社交复盘报告，发现你的社交模式
                  </p>
                  <button className="w-full py-3 bg-white text-orange-500 rounded-xl font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                    升级 Pro
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Top Tags */}
              <div className="bg-white rounded-3xl shadow-sm p-6 animate-fade-in-up">
                <h2 className="font-display font-bold text-lg flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-brand-500" />
                  高频标签
                </h2>
                <div className="space-y-3">
                  {topTags.map((tag, i) => (
                    <div key={tag.name} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 w-16">{tag.name}</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${tag.color} rounded-full flex items-center justify-end pr-2`}
                          style={{ width: `${tag.count * 12}%` }}
                        >
                          <span className="text-xs text-white font-medium">{tag.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white rounded-3xl shadow-sm p-6 animate-fade-in-up">
                <h2 className="font-display font-bold text-lg mb-4">设置与隐私</h2>
                <div className="space-y-2">
                  {[
                    { icon: Lock, label: '隐私设置', desc: '控制哪些信息可见' },
                    { icon: Bell, label: '通知偏好', desc: '管理提醒通知' },
                    { icon: Download, label: '数据导出', desc: '导出关系资产' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

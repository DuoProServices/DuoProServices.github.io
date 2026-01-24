import { useState, useEffect } from 'react';
import { 
  Plus,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Image as ImageIcon,
  FileText,
  Clock,
  X,
  Save,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  date: string;
  time: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter';
  content: string;
  imageUrl?: string;
  status: 'scheduled' | 'published' | 'draft';
  createdAt: string;
}

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bgColor: 'bg-blue-50' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-500', bgColor: 'bg-sky-50' }
];

const STATUS_COLORS = {
  'scheduled': 'bg-blue-100 text-blue-800',
  'published': 'bg-green-100 text-green-800',
  'draft': 'bg-gray-100 text-gray-800'
};

export default function SocialCalendarModule() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    platform: 'instagram' as Post['platform'],
    content: '',
    imageUrl: '',
    status: 'scheduled' as Post['status']
  });

  useEffect(() => {
    // Load posts from localStorage on mount
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // 📦 Use localStorage instead of server
      console.log('📦 [SocialCalendar] Loading posts from localStorage...');
      
      const stored = localStorage.getItem('admin-hub-social-posts');
      if (stored) {
        const data = JSON.parse(stored);
        setPosts(data.posts || []);
        console.log(`✅ [SocialCalendar] Loaded ${data.posts?.length || 0} posts from localStorage`);
      } else {
        console.log('📭 [SocialCalendar] No posts found in localStorage');
        setPosts([]);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      // Don't show error toast for empty state
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (post?: Post, date?: string) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        date: post.date,
        time: post.time,
        platform: post.platform,
        content: post.content,
        imageUrl: post.imageUrl || '',
        status: post.status
      });
    } else {
      setEditingPost(null);
      setFormData({
        date: date || '',
        time: '09:00',
        platform: 'instagram',
        content: '',
        imageUrl: '',
        status: 'scheduled'
      });
    }
    setShowPostModal(true);
  };

  const handleCloseModal = () => {
    setShowPostModal(false);
    setEditingPost(null);
    setFormData({
      date: '',
      time: '',
      platform: 'instagram',
      content: '',
      imageUrl: '',
      status: 'scheduled'
    });
  };

  const handleSavePost = async () => {
    console.log('💾 Starting save post...', formData);
    
    if (!formData.date || !formData.time || !formData.content) {
      console.error('❌ Missing required fields:', { 
        date: formData.date, 
        time: formData.time, 
        content: formData.content 
      });
      toast.error('⚠️ Please fill in all required fields (date, time, content)');
      return;
    }

    const newPost: Post = {
      id: editingPost?.id || `post-${Date.now()}`,
      ...formData,
      createdAt: editingPost?.createdAt || new Date().toISOString()
    };

    console.log('📱 Post object created:', newPost);

    try {
      // Update local state and localStorage
      let updatedPosts: Post[];
      
      if (editingPost) {
        updatedPosts = posts.map(p => p.id === editingPost.id ? newPost : p);
        toast.success('✅ Post updated successfully!');
      } else {
        updatedPosts = [...posts, newPost];
        toast.success('✅ Post created successfully!');
      }
      
      // Save to localStorage
      localStorage.setItem('admin-hub-social-posts', JSON.stringify({ posts: updatedPosts }));
      console.log('✅ Saved to localStorage');
      
      // Update state
      setPosts(updatedPosts);

      handleCloseModal();
    } catch (error) {
      console.error('❌ Error saving post:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      // Delete from local state and localStorage
      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      
      // Save to localStorage
      localStorage.setItem('admin-hub-social-posts', JSON.stringify({ posts: updatedPosts }));
      console.log('✅ Deleted from localStorage');
      
      toast.success('✅ Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getPostsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return posts.filter(post => post.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getPlatformInfo = (platform: string) => {
    return PLATFORMS.find(p => p.value === platform) || PLATFORMS[0];
  };

  const stats = {
    total: posts.length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length
  };

  const postsByPlatform = PLATFORMS.map(platform => ({
    ...platform,
    count: posts.filter(p => p.platform === platform.value).length
  }));

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });

  const upcomingPosts = posts
    .filter(p => p.status === 'scheduled')
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Posts</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.scheduled}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Published</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.published}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Drafts</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.draft}</p>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts by Platform</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {postsByPlatform.map(platform => {
            const Icon = platform.icon;
            return (
              <div key={platform.value} className="flex items-center gap-3">
                <div className={`p-3 ${platform.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${platform.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{platform.label}</p>
                  <p className="text-xl font-bold text-gray-900">{platform.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Mode Toggle and Actions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              List View
            </button>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Month Navigation */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                const postsForDate = getPostsForDate(date);
                const isToday = date && 
                  date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`min-h-24 border border-gray-200 rounded-lg p-2 ${
                      date ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                    } ${isToday ? 'border-blue-600 border-2' : ''}`}
                    onClick={() => date && handleOpenModal(undefined, date.toISOString().split('T')[0])}
                  >
                    {date && (
                      <>
                        <div className="text-sm font-semibold text-gray-900 mb-1">
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {postsForDate.slice(0, 2).map(post => {
                            const platformInfo = getPlatformInfo(post.platform);
                            const PlatformIcon = platformInfo.icon;
                            return (
                              <div
                                key={post.id}
                                className={`text-xs px-2 py-1 ${platformInfo.bgColor} ${platformInfo.color} rounded flex items-center gap-1 truncate`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenModal(post);
                                }}
                              >
                                <PlatformIcon className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{post.time}</span>
                              </div>
                            );
                          })}
                          {postsForDate.length > 2 && (
                            <div className="text-xs text-gray-500 px-2">
                              +{postsForDate.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {upcomingPosts.length === 0 ? (
            <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No scheduled posts</p>
            </div>
          ) : (
            upcomingPosts.map(post => {
              const platformInfo = getPlatformInfo(post.platform);
              const PlatformIcon = platformInfo.icon;

              return (
                <div
                  key={post.id}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 ${platformInfo.bgColor} rounded-lg`}>
                          <PlatformIcon className={`w-5 h-5 ${platformInfo.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{platformInfo.label}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString('en-CA', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            <Clock className="w-4 h-4 ml-2" />
                            {post.time}
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[post.status]}`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-3">{post.content}</p>

                      {post.imageUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ImageIcon className="w-4 h-4" />
                          <span>Image attached</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleOpenModal(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPost ? 'Edit Post' : 'New Post'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PLATFORMS.map(platform => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, platform: platform.value as Post['platform'] })}
                        className={`flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all ${
                          formData.platform === platform.value
                            ? `${platform.bgColor} border-current ${platform.color}`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${formData.platform === platform.value ? platform.color : 'text-gray-600'}`} />
                        <span className="font-medium">{platform.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Write your post content here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.content.length} characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Post['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePost}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import { greenFeedAPI } from '../services/api';
import BottomNavbar from '../components/BottomNavbar';
import SideNavbar from '../components/SideNavbar';

const GreenFeedPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadPosts();
    }, [activeTab]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const token = await currentUser.getIdToken();
            const response = await greenFeedAPI.getPosts(token, 10);
            setPosts(response.posts);
            setHasMore(response.hasMore);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const token = await currentUser.getIdToken();
            const response = await greenFeedAPI.likePost(token, postId);
            
            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        isLiked: response.liked,
                        likes: response.liked ? post.likes + 1 : post.likes - 1
                    };
                }
                return post;
            }));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const openComments = async (post) => {
        setSelectedPost(post);
        setShowCommentsModal(true);
        try {
            const token = await currentUser.getIdToken();
            const response = await greenFeedAPI.getComments(token, post.id);
            setComments(response.comments);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        
        try {
            const token = await currentUser.getIdToken();
            await greenFeedAPI.addComment(token, selectedPost.id, newComment);
            
            // Reload comments
            const response = await greenFeedAPI.getComments(token, selectedPost.id);
            setComments(response.comments);
            setNewComment('');
            
            // Update comment count
            setPosts(posts.map(post => 
                post.id === selectedPost.id 
                    ? { ...post, comments: post.comments + 1 }
                    : post
            ));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        
        try {
            const token = await currentUser.getIdToken();
            await greenFeedAPI.deletePost(token, postId);
            
            // Remove post from list
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        return `${Math.floor(seconds / 86400)}d`;
    };

    const filteredPosts = posts.filter(post => 
        activeTab === 'posts' ? post.type === 'post' : post.type === 'reel'
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <SideNavbar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b sticky top-0 z-30">
                    <div className="px-4 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                                <span className="material-symbols-outlined text-green-500 mr-2">eco</span>
                                Green Feed
                            </h1>
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
                            >
                                <span className="material-symbols-outlined text-2xl">add_circle</span>
                            </button>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex mt-4 border-b">
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`flex-1 py-2 text-center font-medium ${
                                    activeTab === 'posts' 
                                        ? 'text-green-500 border-b-2 border-green-500' 
                                        : 'text-gray-500'
                                }`}
                            >
                                Posts
                            </button>
                            <button
                                onClick={() => setActiveTab('reels')}
                                className={`flex-1 py-2 text-center font-medium ${
                                    activeTab === 'reels' 
                                        ? 'text-green-500 border-b-2 border-green-500' 
                                        : 'text-gray-500'
                                }`}
                            >
                                Reels
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-gray-300">eco</span>
                            <p className="text-gray-500 mt-4">No posts yet. Be the first to share!</p>
                        </div>
                    ) : activeTab === 'posts' ? (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            {filteredPosts.map((post) => (
                                <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    {/* Post Header */}
                                    <div className="flex items-center p-4">
                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                            {post.user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="font-semibold text-gray-800">{post.user.name}</p>
                                            <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)} ago</p>
                                        </div>
                                        {/* Delete button - only show for post owner */}
                                        {post.userId === currentUser?.uid && (
                                            <button
                                                onClick={() => handleDeletePost(post.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                                title="Delete post"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Post Image/Video */}
                                    {post.mediaUrl && (
                                        post.mediaType === 'video' ? (
                                            <video 
                                                src={post.mediaUrl} 
                                                className="w-full max-h-96 object-cover"
                                                controls
                                            />
                                        ) : (
                                            <img 
                                                src={post.mediaUrl} 
                                                alt="Post" 
                                                className="w-full max-h-96 object-cover"
                                                onError={(e) => {
                                                    console.error('Image failed to load:', post.mediaUrl);
                                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
                                                }}
                                            />
                                        )
                                    )}

                                    {/* Post Actions */}
                                    <div className="p-4">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <button 
                                                onClick={() => handleLike(post.id)}
                                                className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition"
                                            >
                                                <span className={`material-symbols-outlined ${post.isLiked ? 'text-red-500' : ''}`}>
                                                    {post.isLiked ? 'favorite' : 'favorite_border'}
                                                </span>
                                                <span className="text-sm">{post.likes}</span>
                                            </button>
                                            <button 
                                                onClick={() => openComments(post)}
                                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition"
                                            >
                                                <span className="material-symbols-outlined">chat_bubble_outline</span>
                                                <span className="text-sm">{post.comments}</span>
                                            </button>
                                            <button className="text-gray-600 hover:text-green-500 transition">
                                                <span className="material-symbols-outlined">share</span>
                                            </button>
                                        </div>
                                        {post.caption && (
                                            <p className="text-gray-800 text-sm">{post.caption}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 max-w-4xl mx-auto">
                            {filteredPosts.map((reel) => (
                                <div key={reel.id} className="relative bg-black rounded-xl overflow-hidden aspect-[9/16]">
                                    {reel.mediaUrl && (
                                        <video 
                                            src={reel.mediaUrl} 
                                            className="w-full h-full object-cover"
                                            poster={reel.mediaUrl}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    
                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-white text-2xl">play_arrow</span>
                                        </button>
                                    </div>

                                    {/* Reel Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                        <div className="flex items-center mb-2">
                                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold mr-2">
                                                {reel.user.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <span className="text-xs font-medium">{reel.user.name}</span>
                                        </div>
                                        {reel.caption && (
                                            <p className="text-sm font-semibold mb-1 line-clamp-2">{reel.caption}</p>
                                        )}
                                        <div className="flex items-center space-x-3 text-xs">
                                            <span className="flex items-center">
                                                <span className="material-symbols-outlined text-sm mr-1">favorite</span>
                                                {reel.likes}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                <BottomNavbar />
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <CreatePostModal 
                    onClose={() => setShowCreateModal(false)}
                    onPostCreated={loadPosts}
                    currentUser={currentUser}
                    type={activeTab === 'posts' ? 'post' : 'reel'}
                />
            )}

            {/* Comments Modal */}
            {showCommentsModal && selectedPost && (
                <CommentsModal
                    post={selectedPost}
                    comments={comments}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onAddComment={handleAddComment}
                    onClose={() => {
                        setShowCommentsModal(false);
                        setSelectedPost(null);
                        setComments([]);
                        setNewComment('');
                    }}
                    formatTimeAgo={formatTimeAgo}
                />
            )}
        </div>
    );
};

// Create Post Modal Component
const CreatePostModal = ({ onClose, onPostCreated, currentUser, type }) => {
    const [caption, setCaption] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption && !mediaFile) return;

        setUploading(true);
        try {
            const token = await currentUser.getIdToken();
            const formData = new FormData();
            formData.append('caption', caption);
            formData.append('type', type);
            if (mediaFile) {
                formData.append('media', mediaFile);
            }

            await greenFeedAPI.createPost(token, formData);
            onPostCreated();
            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-xl font-bold">Create {type === 'post' ? 'Post' : 'Reel'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows="4"
                    />

                    {mediaPreview && (
                        <div className="mt-4 relative">
                            {mediaFile?.type.startsWith('video') ? (
                                <video src={mediaPreview} className="w-full rounded-lg" controls />
                            ) : (
                                <img src={mediaPreview} alt="Preview" className="w-full rounded-lg" />
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setMediaFile(null);
                                    setMediaPreview(null);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    )}

                    <div className="mt-4 flex items-center space-x-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={type === 'post' ? 'image/*,video/*' : 'video/*'}
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                            <span className="material-symbols-outlined">photo_camera</span>
                            <span>Add Media</span>
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || (!caption && !mediaFile)}
                        className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                        {uploading ? 'Posting...' : 'Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Comments Modal Component
const CommentsModal = ({ post, comments, newComment, setNewComment, onAddComment, onClose, formatTimeAgo }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold">Comments</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No comments yet. Be the first!</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {comment.user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-100 rounded-lg p-3">
                                        <p className="font-semibold text-sm">{comment.user.name}</p>
                                        <p className="text-gray-800 text-sm mt-1">{comment.text}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.createdAt)} ago</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && onAddComment()}
                        />
                        <button
                            onClick={onAddComment}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GreenFeedPage;

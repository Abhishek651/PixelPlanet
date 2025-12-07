import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { DatePicker } from './base/DatePicker';

const AnnouncementsPanel = () => {
    const { currentUser, userRole } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        targetAudience: 'all',
        priority: 'medium',
        expiryDate: ''
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('/api/announcements/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setAnnouncements(data.announcements);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const createAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('/api/announcements/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAnnouncement)
            });

            if (response.ok) {
                setShowCreateForm(false);
                setNewAnnouncement({
                    title: '',
                    content: '',
                    targetAudience: 'all',
                    priority: 'medium',
                    expiryDate: ''
                });
                fetchAnnouncements();
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
        }
    };

    const markAsRead = async (announcementId) => {
        try {
            const token = await currentUser.getIdToken();
            await fetch(`/api/announcements/read/${announcementId}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setAnnouncements(prev =>
                prev.map(ann =>
                    ann.id === announcementId ? { ...ann, isRead: true } : ann
                )
            );
        } catch (error) {
            console.error('Error marking announcement as read:', error);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Announcements</h3>
                {userRole === 'hod' && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Create Announcement
                    </button>
                )}
            </div>

            {/* Create Announcement Form */}
            {showCreateForm && userRole === 'hod' && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <form onSubmit={createAnnouncement} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                value={newAnnouncement.content}
                                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                <select
                                    value={newAnnouncement.targetAudience}
                                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, targetAudience: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="all">All</option>
                                    <option value="teachers">Teachers Only</option>
                                    <option value="students">Students Only</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={newAnnouncement.priority}
                                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <DatePicker
                                label="Expiry Date (Optional)"
                                value={newAnnouncement.expiryDate}
                                onChange={(value) => setNewAnnouncement(prev => ({ ...prev, expiryDate: value }))}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Create Announcement
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📢</div>
                        <p>No announcements yet</p>
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className={`border rounded-lg p-4 transition-all ${
                                announcement.isRead ? 'bg-gray-50 border-gray-200' : 'bg-white border-primary shadow-md'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <h4 className={`font-semibold ${announcement.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                        {announcement.title}
                                    </h4>
                                    <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(announcement.priority)}`}>
                                        {announcement.priority}
                                    </span>
                                </div>
                                {!announcement.isRead && (
                                    <button
                                        onClick={() => markAsRead(announcement.id)}
                                        className="text-primary hover:text-primary-dark text-sm"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                            <p className={`text-sm mb-3 ${announcement.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                                {announcement.content}
                            </p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Target: {announcement.targetAudience}</span>
                                <span>
                                    {new Date(announcement.createdAt?.seconds * 1000).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPanel;
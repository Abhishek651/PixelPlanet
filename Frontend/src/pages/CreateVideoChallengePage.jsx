// frontend/src/pages/CreateVideoChallengePage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft, Plus, Trash2, Video, Upload, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../services/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from '../context/useAuth';

const CreateVideoChallengePage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [questions, setQuestions] = useState([{ text: '', options: ['', ''], correctAnswer: 0 }]);
    const [rewardPoints, setRewardPoints] = useState(100);
    const [sourceType, setSourceType] = useState('youtube'); // 'youtube' or 'upload'

    const classes = [
        { id: '1', name: 'Class A' },
        { id: '2', name: 'Class B' },
        { id: '3', name: 'Class C' },
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            setVideoUrl(URL.createObjectURL(file)); // for local preview
        } else {
            alert('Please select a valid video file.');
        }
    };

    const handleClassChange = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedClasses(values);
    };

    const handleQuestionChange = (index, text) => {
        const newQuestions = [...questions];
        newQuestions[index].text = text;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = text;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = oIndex;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', ''], correctAnswer: 0 }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push('');
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, optIndex) => optIndex !== oIndex);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('You must be logged in to create a challenge.');
            return;
        }

        let finalVideoUrl = videoUrl;

        if (sourceType === 'upload' && videoFile) {
            setIsUploading(true);
            const storageRef = ref(storage, `videos/${currentUser.uid}/${Date.now()}_${videoFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, videoFile);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                    },
                    (error) => {
                        console.error("Upload failed:", error);
                        setIsUploading(false);
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        finalVideoUrl = downloadURL;
                        setIsUploading(false);
                        resolve();
                    }
                );
            });
        }

        const newChallenge = {
            title,
            videoUrl: finalVideoUrl,
            classes: selectedClasses,
            rewardPoints: Number(rewardPoints),
            type: 'Video',
            quizData: { questions },
            createdBy: currentUser.uid,
            createdAt: new Date(),
            status: 'Active',
            completion: 0,
        };

        try {
            await addDoc(collection(db, 'quizzes'), newChallenge);
            navigate('/challenges');
        } catch (error) {
            console.error("Error creating video challenge:", error);
            alert("Failed to create video challenge. Please check the console for details.");
        }
    };

    const getEmbedUrl = (url) => {
        if (sourceType === 'upload') return url;
        let videoId;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.slice(1);
            } else if (urlObj.hostname.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v');
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
        } catch (_error) { // eslint-disable-line no-unused-vars
            return '';
        }
    };

    const embedUrl = getEmbedUrl(videoUrl);

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Video Challenge</h2>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Challenge Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video Source</label>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setSourceType('youtube')} className={`px-4 py-2 rounded-lg font-semibold ${sourceType === 'youtube' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>YouTube</button>
                                    <button type="button" onClick={() => setSourceType('upload')} className={`px-4 py-2 rounded-lg font-semibold ${sourceType === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Upload</button>
                                </div>
                            </div>

                            {sourceType === 'youtube' ? (
                                <div>
                                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">YouTube Video URL</label>
                                    <input
                                        type="url"
                                        id="videoUrl"
                                        value={videoUrl}
                                        onChange={(e) => { setVideoUrl(e.target.value); setVideoFile(null); }}
                                        className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                        placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Video</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                <label htmlFor="videoFile" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                    <span>Upload a file</span>
                                                    <input id="videoFile" name="videoFile" type="file" className="sr-only" accept="video/*" onChange={handleFileChange} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">MP4, WEBM, OGG up to 50MB</p>
                                        </div>
                                    </div>
                                    {videoFile && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Selected file: {videoFile.name}</p>}
                                </div>
                            )}

                            {embedUrl && (
                                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                                    {sourceType === 'youtube' ? (
                                        <iframe
                                            src={embedUrl}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
                                        ></iframe>
                                    ) : (
                                        <video src={embedUrl} controls className="w-full h-full"></video>
                                    )}
                                </div>
                            )}
                            
                            {isUploading && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign to Classes</label>
                                    <select
                                        id="class"
                                        multiple
                                        value={selectedClasses}
                                        onChange={handleClassChange}
                                        className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                    >
                                        {classes.map(cls => (
                                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="rewardPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reward Points</label>
                                    <input
                                        type="number"
                                        id="rewardPoints"
                                        value={rewardPoints}
                                        onChange={(e) => setRewardPoints(e.target.value)}
                                        className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Questions</h3>
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 relative">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-md font-semibold text-gray-800 dark:text-gray-200">Question {qIndex + 1}</label>
                                        {questions.length > 1 && (
                                            <button type="button" onClick={() => removeQuestion(qIndex)} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={q.text}
                                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                        className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                        placeholder="Enter the question"
                                    />
                                    <div className="mt-4 space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    name={`correctAnswer-${qIndex}`}
                                                    checked={q.correctAnswer === oIndex}
                                                    onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                                    className="form-radio h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    className="block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                                    placeholder={`Option ${oIndex + 1}`}
                                                />
                                                {q.options.length > 2 && (
                                                    <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                                        <Trash2 className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={() => addOption(qIndex)} className="mt-4 flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                                        <Plus size={16} />
                                        <span>Add Option</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={addQuestion} className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                            <Plus size={16} />
                            <span>Add Another Question</span>
                        </button>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-md text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all"
                            >
                                {isUploading ? <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /> : 'Create Video Challenge'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateVideoChallengePage;

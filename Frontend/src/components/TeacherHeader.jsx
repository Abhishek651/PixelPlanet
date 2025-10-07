import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ChallengeTypeModal from './ChallengeTypeModal';

const TeacherHeader = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <header className="flex items-center justify-between p-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-display">Teacher Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-lg hover:bg-primary-dark transition-all"
                    >
                        <Plus size={16} />
                        <span>Create Challenge</span>
                    </button>
                    <div className="flex bg-white rounded-full p-1 shadow-sm dark:bg-gray-700">
                        <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">Analytics</button>
                        <button className="px-4 py-2 rounded-full text-gray-600 dark:text-gray-300 text-sm font-semibold">Students</button>
                    </div>
                    <button className="p-2 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <img src="https://ui-avatars.com/api/?name=Teacher&background=0D8ABC&color=fff" alt="Teacher Avatar" className="w-10 h-10 rounded-full" />
                    <button className="p-2 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 lg:hidden">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </header>
            <ChallengeTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default TeacherHeader;
import React, { useState } from 'react';
import { ecoBotAPI } from '../services/api';

const EcoBot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', content: "Hi! I'm EcoBot. Ask me about environmental topics!", timestamp: new Date() }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = { id: Date.now(), type: 'user', content: inputMessage, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const data = await ecoBotAPI.sendMessage(inputMessage);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                content: data.response,
                timestamp: new Date()
            }]);
        } catch (error) {
            const errorMsg = error.message?.includes('503')
                ? "EcoBot is not configured. Please contact your administrator to set up API keys in the admin panel."
                : "Sorry, I'm having trouble connecting right now. The EcoBot service may be unavailable.";
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                content: errorMsg,
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b bg-green-500 text-white rounded-t-2xl">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">🌱</span>
                        <div>
                            <h3 className="font-bold">EcoBot</h3>
                            <p className="text-sm opacity-90">Environmental Assistant</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                                message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                            }`}>
                                <p className="text-sm">{message.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-2xl px-4 py-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask about environmental topics..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="bg-green-500 text-white rounded-full px-6 py-2 hover:bg-green-600 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EcoBot;
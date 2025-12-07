import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

const WasteSegregatorGame = () => {
    const { currentUser } = useAuth();
    const [showReward, setShowReward] = useState(false);
    const [rewardData, setRewardData] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        if (currentUser) {
            auth.currentUser?.getIdToken().then(setAuthToken);
        }
    }, [currentUser]);

    useEffect(() => {
        const handleGameComplete = async (event) => {
            console.log('Received message:', event.data);
            
            // Verify message is from our game (support both old and new versions)
            if (event.data.type === 'GAME_COMPLETE' && 
                (event.data.game === 'waste-segregator' || event.data.game === 'waste-segregator-adaptive')) {
                const { ecoPoints, coins, xp, level, score, isSuccess, accuracy } = event.data;
                
                console.log('Game complete! Rewards:', { ecoPoints, coins, xp, level, score, isSuccess });
                
                // Update user points in Firestore
                if (currentUser) {
                    try {
                        console.log('Updating Firestore for user:', currentUser.uid);
                        const userDocRef = doc(db, 'users', currentUser.uid);
                        await updateDoc(userDocRef, {
                            ecoPoints: increment(ecoPoints),
                            coins: increment(coins),
                            xp: increment(xp)
                        });
                        
                        console.log('Firestore updated successfully!');
                        
                        // Show reward notification
                        setRewardData({ ecoPoints, coins, xp, level, score, isSuccess });
                        setShowReward(true);
                        
                        // Hide after 5 seconds
                        setTimeout(() => setShowReward(false), 5000);
                    } catch (error) {
                        console.error('Error updating game rewards:', error);
                        alert('Failed to save your rewards. Please try again or contact support.');
                    }
                } else {
                    console.error('No current user found!');
                    alert('You must be logged in to receive rewards.');
                }
            }
        };

        console.log('Setting up message listener for game rewards');
        window.addEventListener('message', handleGameComplete);
        return () => {
            console.log('Cleaning up message listener');
            window.removeEventListener('message', handleGameComplete);
        };
    }, [currentUser]);

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <iframe
                src={`/Games/waste-segregator-adaptive.html?userId=${currentUser?.uid || 'guest'}${authToken ? `&token=${authToken}` : ''}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Eco Sorting Factory"
            ></iframe>
            
            {/* Reward Notification */}
            {showReward && rewardData && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: rewardData.isSuccess 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                    color: 'white',
                    padding: '20px 30px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    animation: 'slideDown 0.5s ease-out',
                    textAlign: 'center',
                    minWidth: '300px'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                        {rewardData.isSuccess 
                            ? `🎉 Level ${rewardData.level} Complete! 🎉`
                            : `⏰ Time's Up! Level ${rewardData.level}`
                        }
                    </div>
                    <div style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>
                        Score: {rewardData.score}
                    </div>
                    <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                        🌱 +{rewardData.ecoPoints} Eco Points
                    </div>
                    <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                        🪙 +{rewardData.coins} Coins
                    </div>
                    <div style={{ fontSize: '18px' }}>
                        ⭐ +{rewardData.xp} XP
                    </div>
                    {!rewardData.isSuccess && (
                        <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>
                            Complete all items for full rewards!
                        </div>
                    )}
                </div>
            )}
            
            <style>{`
                @keyframes slideDown {
                    from {
                        transform: translateX(-50%) translateY(-100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default WasteSegregatorGame;

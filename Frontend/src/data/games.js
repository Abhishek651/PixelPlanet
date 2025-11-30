import ecoQuizImg from '../assets/images/eco-quiz.png';
import recycleRushImg from '../assets/images/recycle-rush.png';
import carbonFootprintImg from '../assets/images/carbon-footprint.png';
import ecoQuizIcon from '../assets/images/eco-quiz-icon.png';
import recycleRushIcon from '../assets/images/recycle-rush-icon.png';
import carbonFootprintIcon from '../assets/images/carbon-footprint-icon.png';

export const games = [
    {
        id: 1,
        title: 'Recycle Rush',
        description: 'Sort waste into the correct bins before time runs out.',
        thumbnail: recycleRushImg,
        thumbnailSquare: recycleRushIcon,
        featured: true,
        category: 'Action',
        path: '/games/waste-segregator',
    },
    {
        id: 2,
        title: 'Eco-Quiz Challenge',
        description: 'Test your knowledge about climate change and sustainability.',
        thumbnail: ecoQuizImg,
        thumbnailSquare: ecoQuizIcon,
        featured: false,
        category: 'Puzzle',
        path: '/games/quiz',
    },
    {
        id: 3,
        title: 'Carbon Footprint Calculator',
        description: 'Calculate your carbon footprint and learn how to reduce it.',
        thumbnail: carbonFootprintImg,
        thumbnailSquare: carbonFootprintIcon,
        featured: false,
        category: 'Educational',
        path: '/games',
    },
];

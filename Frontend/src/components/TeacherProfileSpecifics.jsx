import React from 'react';
import ProfileCard from './ProfileCard';

const TeacherProfileSpecifics = ({ variants }) => {
    return (
        <ProfileCard title="Teacher Details" variants={variants}>
            <p>This is where teacher-specific profile details will be displayed.</p>
            {/* You can add more teacher-specific information here */}
        </ProfileCard>
    );
};

export default TeacherProfileSpecifics;
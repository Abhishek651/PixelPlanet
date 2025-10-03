import React from 'react';
import ProfileCard from './ProfileCard';

const StudentProfileSpecifics = ({ variants }) => {
    return (
        <ProfileCard title="Student Details" variants={variants}>
            <p>This is where student-specific profile details will be displayed.</p>
            {/* You can add more student-specific information here */}
        </ProfileCard>
    );
};

export default StudentProfileSpecifics;
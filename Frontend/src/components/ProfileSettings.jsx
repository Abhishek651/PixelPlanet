
import React from 'react';
import ProfileCard from './ProfileCard';

const ProfileSettings = ({ variants }) => {
    return (
        <ProfileCard title="Profile Settings" variants={variants}>
            <p>This is where profile settings will be displayed.</p>
            {/* You can add more profile settings here */}
        </ProfileCard>
    );
};

export default ProfileSettings;

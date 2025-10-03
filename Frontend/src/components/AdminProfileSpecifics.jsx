import React from 'react';
import ProfileCard from './ProfileCard';

const AdminProfileSpecifics = ({ variants }) => {
    return (
        <ProfileCard title="Admin Details" variants={variants}>
            <p>This is where admin-specific profile details will be displayed.</p>
            {/* You can add more admin-specific information here */}
        </ProfileCard>
    );
};

export default AdminProfileSpecifics;
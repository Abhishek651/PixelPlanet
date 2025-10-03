import React from "react";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/ProfileHeader";
import StudentProfileSpecifics from "../components/StudentProfileSpecifics";
import TeacherProfileSpecifics from "../components/TeacherProfileSpecifics";
import AdminProfileSpecifics from "../components/AdminProfileSpecifics";
import ProfileSettings from "../components/ProfileSettings";
import DashboardLayout from "../components/DashboardLayout";

const ProfilePage = () => {
  const { currentUser, userRole } = useAuth();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div>
        <ProfileHeader user={currentUser} role={userRole} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2">
            {userRole === "student" && (
              <StudentProfileSpecifics variants={itemVariants} />
            )}
            {userRole === "teacher" && (
              <TeacherProfileSpecifics variants={itemVariants} />
            )}
            {userRole === "admin" && <AdminProfileSpecifics variants={itemVariants} />}
          </div>
          <div>
            <ProfileSettings variants={itemVariants} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
# User Types & Institute Management

## 🎯 User Types

Your app now supports two types of users:

### 1. **Institute Users** (Students, Teachers, HOD)
- Register through institute registration codes
- Tied to a specific institute
- Have `instituteId` in their profile
- Can access:
  - Institute-specific leaderboard
  - Institute challenges
  - Class-specific features
  - Institute analytics

**Roles:**
- **HOD**: Institute administrator, manages teachers and students
- **Teacher**: Creates challenges, manages classes
- **Student**: Participates in challenges, earns eco-points

### 2. **Global Users**
- Sign up directly through Firebase Auth (email/password)
- Not tied to any institute
- Have `role: 'global'` and `instituteId: null`
- Can access:
  - Global leaderboard (compete with all users)
  - Educational games
  - EcoBot
  - Eco tips
- **Cannot** access:
  - Institute-specific challenges
  - Class features

## 🔄 How It Works

### Institute User Flow:
```
1. HOD registers institute → Gets registration codes
2. Teachers/Students use codes → Register with institute
3. User document created with instituteId
4. Custom claims set: { role: 'teacher/student', instituteId: 'xxx' }
5. Access institute-specific features
```

### Global User Flow:
```
1. User signs up directly (email/password)
2. Login detected → No user document found
3. Backend creates user document automatically
4. Custom claims set: { role: 'global', instituteId: null }
5. Access global features only
```

## 📊 Feature Access Matrix

| Feature | Global User | Student | Teacher | HOD |
|---------|------------|---------|---------|-----|
| Games | ✅ | ✅ | ✅ | ✅ |
| EcoBot | ✅ | ✅ | ✅ | ✅ |
| Global Leaderboard | ✅ | ✅ | ✅ | ✅ |
| Institute Leaderboard | ❌ | ✅ | ✅ | ✅ |
| View Challenges | ❌ | ✅ | ✅ (own) | ✅ |
| Create Challenges | ❌ | ❌ | ✅ | ✅ |
| Manage Institute | ❌ | ❌ | ❌ | ✅ |

## 🔧 Technical Implementation

### User Document Structure

**Institute Student:**
```javascript
{
  uid: "xxx",
  name: "John Doe",
  email: "john@example.com",
  role: "student",
  instituteId: "inst_123",
  class: "10",
  section: "A",
  admissionNumber: "2024001",
  ecoPoints: 150,
  level: 2,
  badges: [],
  isVerified: true
}
```

**Global User:**
```javascript
{
  uid: "yyy",
  name: "Jane Smith",
  email: "jane@example.com",
  role: "global",
  instituteId: null,
  ecoPoints: 50,
  level: 1,
  badges: [],
  isVerified: true
}
```

### Custom Claims

**Institute User:**
```javascript
{
  role: "student", // or "teacher", "hod"
  instituteId: "inst_123"
}
```

**Global User:**
```javascript
{
  role: "global",
  instituteId: null
}
```

## 🚀 API Endpoints

### Auto-Sync User (New!)
```
POST /api/auth/sync-user
Authorization: Bearer <token>
Body: { name: "User Name", email: "user@example.com" }
```

Creates a user document for direct Firebase Auth signups.

### Leaderboard Behavior

**Institute Endpoint:**
```
GET /api/leaderboard/institute
```
- Institute users: Returns institute-specific leaderboard
- Global users: Returns global leaderboard

**Global Endpoint:**
```
GET /api/leaderboard/global
```
- Returns all users (students + global users)

### Challenges Behavior

```
GET /api/challenges/list
```
- Institute users: Returns institute challenges
- Global users: Returns empty array with message

## 🎨 Frontend Handling

The AuthContext automatically:
1. Detects when user logs in
2. Checks if user document exists
3. If not, calls `/api/auth/sync-user`
4. Creates global user document
5. Sets custom claims
6. Refreshes token

## 🔐 Security

### Firestore Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read their own document
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if false; // Only backend can write
    }
    
    // Institute users can read institute data
    match /institutes/{instituteId} {
      allow read: if request.auth.token.instituteId == instituteId;
      allow write: if false;
    }
    
    // Challenges: institute-specific
    match /challenges/{challengeId} {
      allow read: if request.auth.token.instituteId == resource.data.instituteId;
      allow write: if false;
    }
    
    // Global read for public data
    match /ecoBotConversations/{docId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

## 📝 Migration Notes

If you have existing users without documents:
1. They'll be auto-created as global users on next login
2. Custom claims will be set automatically
3. No manual migration needed!

## 🆕 Future Enhancements

Possible additions:
- **Global Challenges**: Challenges available to all users
- **Institute Joining**: Allow global users to join institutes later
- **Multi-Institute**: Users can be part of multiple institutes
- **Public Profiles**: Global users can view institute leaderboards (read-only)

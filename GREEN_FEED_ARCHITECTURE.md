# Green Feed Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (React Frontend)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Posts Tab   │  │  Reels Tab   │  │ Create Modal │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Post Card   │  │  Comments    │  │  Like Button │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│                  (Express.js Backend)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /api/green-feed/posts                                         │
│  ├── GET     - Fetch posts with pagination                     │
│  ├── POST    - Create new post with media                      │
│  └── DELETE  - Delete post (owner only)                        │
│                                                                 │
│  /api/green-feed/posts/:postId/like                           │
│  └── POST    - Toggle like/unlike                              │
│                                                                 │
│  /api/green-feed/posts/:postId/comments                       │
│  ├── GET     - Fetch comments                                  │
│  └── POST    - Add new comment                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   FIREBASE FIRESTORE     │  │   FIREBASE STORAGE       │
│   (Database)             │  │   (Media Files)          │
├──────────────────────────┤  ├──────────────────────────┤
│                          │  │                          │
│  greenFeedPosts/         │  │  green-feed/             │
│  ├── {postId}            │  │  └── {userId}/           │
│  │   ├── userId          │  │      ├── image1.jpg      │
│  │   ├── caption         │  │      ├── video1.mp4      │
│  │   ├── mediaUrl        │  │      └── ...             │
│  │   ├── mediaType       │  │                          │
│  │   ├── type            │  │  Max Size: 10MB          │
│  │   ├── likes           │  │  Types: image/*, video/* │
│  │   ├── comments        │  │                          │
│  │   ├── createdAt       │  │                          │
│  │   │                   │  │                          │
│  │   ├── likes/          │  │                          │
│  │   │   └── {userId}    │  │                          │
│  │   │                   │  │                          │
│  │   └── comments/       │  │                          │
│  │       └── {commentId} │  │                          │
│  │           ├── userId  │  │                          │
│  │           ├── text    │  │                          │
│  │           └── createdAt│ │                          │
│  └── ...                 │  │                          │
│                          │  │                          │
└──────────────────────────┘  └──────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Create Post Flow

```
User Action
    │
    ├─► Select Image/Video
    │
    ├─► Write Caption
    │
    └─► Click "Post"
         │
         ▼
Frontend (GreenFeedPage.jsx)
    │
    ├─► Create FormData
    │   ├── caption
    │   ├── type (post/reel)
    │   └── media (file)
    │
    └─► Call greenFeedAPI.createPost()
         │
         ▼
API Layer (green-feed.js)
    │
    ├─► Authenticate User (JWT)
    │
    ├─► Validate File (multer)
    │   ├── Size < 10MB
    │   └── Type: image/* or video/*
    │
    ├─► Upload to Firebase Storage
    │   ├── Path: green-feed/{userId}/{timestamp}_{filename}
    │   ├── Make Public
    │   └── Get URL
    │
    ├─► Create Firestore Document
    │   └── greenFeedPosts/{postId}
    │
    ├─► Award Rewards
    │   ├── +10 XP
    │   └── +5 Coins
    │
    └─► Return Post Data
         │
         ▼
Frontend
    │
    ├─► Update UI
    │
    ├─► Show Success Message
    │
    └─► Refresh Feed
```

### 2. Like Post Flow

```
User Action
    │
    └─► Click Heart Icon
         │
         ▼
Frontend
    │
    ├─► Optimistic Update (instant UI change)
    │
    └─► Call greenFeedAPI.likePost()
         │
         ▼
API Layer
    │
    ├─► Authenticate User
    │
    ├─► Check if Already Liked
    │   │
    │   ├─► Yes: Remove Like
    │   │   ├── Delete likes/{userId}
    │   │   └── Decrement likes count
    │   │
    │   └─► No: Add Like
    │       ├── Create likes/{userId}
    │       └── Increment likes count
    │
    └─► Return Status (liked: true/false)
         │
         ▼
Frontend
    │
    └─► Update UI with Server Response
```

### 3. Comment Flow

```
User Action
    │
    ├─► Click Comment Icon
    │
    ├─► View Comments Modal
    │
    ├─► Type Comment
    │
    └─► Click Send
         │
         ▼
Frontend
    │
    └─► Call greenFeedAPI.addComment()
         │
         ▼
API Layer
    │
    ├─► Authenticate User
    │
    ├─► Validate Comment Text
    │
    ├─► Create Comment Document
    │   └── greenFeedPosts/{postId}/comments/{commentId}
    │
    ├─► Increment Comment Count
    │
    └─► Return Comment Data
         │
         ▼
Frontend
    │
    ├─► Add Comment to List
    │
    └─► Update Comment Count
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                            │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Frontend Validation
├── File size check (< 10MB)
├── File type check (image/video)
└── Caption length validation

Layer 2: Backend Middleware
├── JWT Authentication (authenticateToken)
├── Multer File Validation
│   ├── Size limit: 10MB
│   ├── Type filter: image/*, video/*
│   └── Memory storage (no disk writes)
└── Request validation

Layer 3: Firebase Firestore Rules
├── Read: isAuthenticated()
├── Create: isAuthenticated()
├── Update: isOwner() || isAdmin()
├── Delete: isOwner() || isAdmin()
└── Subcollections: Proper permissions

Layer 4: Firebase Storage Rules
├── Read: isAuthenticated()
├── Write: isAuthenticated() && isOwner()
├── Size: < 10MB
└── Type: image/* || video/*
```

---

## 📊 Database Structure

```
Firestore Database
│
├── users/
│   └── {userId}
│       ├── name
│       ├── email
│       ├── xp          ← Updated on post creation
│       ├── coins       ← Updated on post creation
│       └── ...
│
├── greenFeedPosts/
│   └── {postId}
│       ├── userId
│       ├── caption
│       ├── mediaUrl
│       ├── mediaType
│       ├── type
│       ├── likes       ← Counter
│       ├── comments    ← Counter
│       ├── shares      ← Counter
│       ├── createdAt
│       │
│       ├── likes/      ← Subcollection
│       │   └── {userId}
│       │       ├── userId
│       │       └── createdAt
│       │
│       └── comments/   ← Subcollection
│           └── {commentId}
│               ├── userId
│               ├── text
│               └── createdAt
│
└── ...

Firebase Storage
│
└── green-feed/
    └── {userId}/
        ├── 1234567890_image1.jpg
        ├── 1234567891_video1.mp4
        └── ...
```

---

## 🔄 Component Hierarchy

```
GreenFeedPage
│
├── SideNavbar (Desktop)
│
├── Header
│   ├── Title
│   ├── Create Button
│   └── Tabs (Posts/Reels)
│
├── Main Content
│   │
│   ├── Posts Tab
│   │   └── PostCard[]
│   │       ├── User Info
│   │       ├── Media (Image/Video)
│   │       ├── Actions (Like, Comment, Share)
│   │       └── Caption
│   │
│   └── Reels Tab
│       └── ReelCard[]
│           ├── Video
│           ├── Play Button
│           └── Info Overlay
│
├── BottomNavbar (Mobile)
│
├── CreatePostModal (Conditional)
│   ├── Caption Input
│   ├── Media Preview
│   ├── File Upload Button
│   └── Submit Button
│
└── CommentsModal (Conditional)
    ├── Comments List
    │   └── CommentItem[]
    │       ├── User Avatar
    │       ├── User Name
    │       ├── Comment Text
    │       └── Timestamp
    │
    └── Add Comment Input
        ├── Text Input
        └── Send Button
```

---

## 🚀 API Request/Response Flow

### Create Post Request
```
POST /api/green-feed/posts
Headers:
  Authorization: Bearer {JWT_TOKEN}
  Content-Type: multipart/form-data

Body (FormData):
  caption: "Planted 50 trees today!"
  type: "post"
  media: [File Object]

Response (201):
{
  "id": "post123",
  "userId": "user456",
  "caption": "Planted 50 trees today!",
  "mediaUrl": "https://storage.googleapis.com/...",
  "mediaType": "image",
  "type": "post",
  "likes": 0,
  "comments": 0,
  "shares": 0,
  "createdAt": "2025-12-07T10:30:00Z"
}
```

### Get Posts Request
```
GET /api/green-feed/posts?limit=10&lastPostId=post123
Headers:
  Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "posts": [
    {
      "id": "post124",
      "userId": "user456",
      "caption": "Beach cleanup!",
      "mediaUrl": "https://...",
      "mediaType": "image",
      "type": "post",
      "likes": 15,
      "comments": 3,
      "isLiked": false,
      "user": {
        "id": "user456",
        "name": "John Doe",
        "avatar": null
      },
      "createdAt": "2025-12-07T10:00:00Z"
    }
  ],
  "hasMore": true
}
```

### Like Post Request
```
POST /api/green-feed/posts/post123/like
Headers:
  Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "liked": true
}
```

---

## 🎨 UI State Management

```
GreenFeedPage State
│
├── activeTab: 'posts' | 'reels'
├── posts: Post[]
├── loading: boolean
├── showCreateModal: boolean
├── showCommentsModal: boolean
├── selectedPost: Post | null
├── comments: Comment[]
├── newComment: string
└── hasMore: boolean

CreatePostModal State
│
├── caption: string
├── mediaFile: File | null
├── mediaPreview: string | null
└── uploading: boolean

Post Object
│
├── id: string
├── userId: string
├── caption: string
├── mediaUrl: string | null
├── mediaType: 'image' | 'video' | null
├── type: 'post' | 'reel'
├── likes: number
├── comments: number
├── shares: number
├── isLiked: boolean
├── user: { id, name, avatar }
└── createdAt: string
```

---

## 📈 Performance Considerations

### Frontend Optimizations
- Lazy loading images
- Pagination (10 posts per load)
- Optimistic UI updates
- Debounced search (future)
- Virtual scrolling (future)

### Backend Optimizations
- Efficient Firestore queries
- Indexed fields (createdAt)
- Batch operations
- Caching (future)
- CDN for media (future)

### Storage Optimizations
- File size limits (10MB)
- Public access for reads
- Organized folder structure
- Compression (future)
- Thumbnails (future)

---

## 🔮 Scalability Plan

### Current Capacity
- Posts: Unlimited (Firestore)
- Storage: 5GB free tier
- Bandwidth: 1GB/day free tier
- Concurrent users: 100+

### Scaling Strategy
1. **Phase 1** (Current)
   - Basic pagination
   - Direct storage access

2. **Phase 2** (1000+ users)
   - CDN integration
   - Image optimization
   - Caching layer

3. **Phase 3** (10,000+ users)
   - Dedicated media server
   - Video transcoding
   - Advanced caching

4. **Phase 4** (100,000+ users)
   - Microservices architecture
   - Load balancing
   - Database sharding

---

**Architecture Version**: 1.0.0
**Last Updated**: December 7, 2025

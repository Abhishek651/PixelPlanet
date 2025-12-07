# Green Feed Features Overview

## 🌱 What is Green Feed?

Green Feed is a social media platform within Pixel Planet where users can share their environmental actions, inspire others, and build a community around sustainability.

## ✨ Key Features

### 1. **Posts Tab**
Share photos and videos of your environmental activities:
- Tree planting events
- Beach cleanups
- Recycling initiatives
- Solar panel installations
- Community gardens
- Zero-waste lifestyle
- Eco-friendly products

### 2. **Reels Tab**
Short-form video content for quick environmental tips:
- 5-minute eco-hacks
- DIY sustainable projects
- Before/after transformations
- Educational content
- Challenge videos

### 3. **Create Post**
Easy post creation with:
- **Caption** - Share your story and inspire others
- **Media Upload** - Add photos or videos (up to 10MB)
- **Type Selection** - Choose between Post or Reel
- **Preview** - See your content before posting
- **Instant Rewards** - Earn 10 XP + 5 Coins per post

### 4. **Engagement Features**

#### Like System
- ❤️ Like posts that inspire you
- Unlike if you change your mind
- See total like count
- Visual feedback (filled heart when liked)

#### Comments
- 💬 Add comments to posts
- View all comments in a modal
- See who commented and when
- Real-time comment count updates

#### Share (Coming Soon)
- 🔗 Share posts with friends
- Copy link to clipboard
- Share to other platforms

### 5. **User Experience**

#### Responsive Design
- **Mobile View**: Optimized for touch interactions
- **Desktop View**: Larger content display
- **Tablet View**: Adaptive layout

#### Navigation
- **Side Navbar** (Desktop): Quick access from any page
- **Bottom Navbar** (Mobile): Thumb-friendly navigation
- **Breadcrumbs**: Know where you are

#### Performance
- **Lazy Loading**: Load posts as you scroll
- **Image Optimization**: Fast loading times
- **Caching**: Smooth experience

## 🎯 User Roles & Permissions

| Role | Can View | Can Post | Can Like | Can Comment | Can Delete |
|------|----------|----------|----------|-------------|------------|
| Student | ✅ | ✅ | ✅ | ✅ | Own posts only |
| Teacher | ✅ | ✅ | ✅ | ✅ | Own posts only |
| HOD | ✅ | ✅ | ✅ | ✅ | Own posts only |
| Global User | ✅ | ✅ | ✅ | ✅ | Own posts only |
| Admin | ✅ | ✅ | ✅ | ✅ | All posts |
| Sub-Admin* | ✅ | ✅ | ✅ | ✅ | All posts* |

*Sub-admins with `canDeleteContent` permission

## 🏆 Gamification

### Rewards for Posting
- **10 XP** per post created
- **5 Coins** per post created
- Encourages regular engagement
- Builds user profile

### Future Rewards (Planned)
- **Likes Received**: +1 XP per like
- **Comments Received**: +2 XP per comment
- **Shares**: +5 XP per share
- **Trending Post**: +50 XP bonus
- **Weekly Top Poster**: Special badge

## 🔒 Security & Privacy

### Content Moderation
- Users can only delete their own posts
- Admins can remove inappropriate content
- Report feature (coming soon)
- Community guidelines enforcement

### Data Protection
- Secure file uploads to Firebase Storage
- User authentication required
- Private user data protected
- GDPR compliant

### File Validation
- **Size Limit**: 10MB per file
- **Allowed Types**: Images (JPEG, PNG, GIF) and Videos (MP4, MOV, AVI)
- **Virus Scanning**: Planned for future
- **Content Filtering**: Planned for future

## 📱 User Interface

### Post Card Layout
```
┌─────────────────────────────────┐
│ 👤 Username          ⋮          │
│    2h ago                        │
├─────────────────────────────────┤
│                                  │
│        [Post Image/Video]        │
│                                  │
├─────────────────────────────────┤
│ ❤️ 234  💬 18  🔗               │
│                                  │
│ Caption text goes here...        │
│ #TreePlanting #EcoAction         │
└─────────────────────────────────┘
```

### Reel Card Layout
```
┌──────────────┐
│              │
│   [Video]    │
│      ▶️      │
│              │
│ 👤 Username  │
│ Title        │
│ 👁️ 12.5K ❤️ 892│
└──────────────┘
```

### Create Post Modal
```
┌─────────────────────────────────┐
│ Create Post              ✕      │
├─────────────────────────────────┤
│                                  │
│ [Text Area]                      │
│ What's on your mind?             │
│                                  │
│ [Media Preview]                  │
│                                  │
│ 📷 Add Media                     │
│                                  │
│ [Post Button]                    │
└─────────────────────────────────┘
```

### Comments Modal
```
┌─────────────────────────────────┐
│ Comments                 ✕      │
├─────────────────────────────────┤
│ 👤 User1                        │
│    Great work! Keep it up!      │
│    5m ago                        │
│                                  │
│ 👤 User2                        │
│    Inspiring! 🌱                │
│    10m ago                       │
├─────────────────────────────────┤
│ [Add a comment...] [Send]       │
└─────────────────────────────────┘
```

## 🎨 Design System

### Colors
- **Primary Green**: #10B981 (eco theme)
- **Like Red**: #EF4444 (heart icon)
- **Comment Blue**: #3B82F6 (chat icon)
- **Background**: #F9FAFB (light gray)
- **Cards**: #FFFFFF (white)

### Icons (Material Symbols)
- **eco** - Green Feed logo
- **add_circle** - Create post
- **favorite** / **favorite_border** - Like
- **chat_bubble_outline** - Comments
- **share** - Share
- **play_arrow** - Play video
- **photo_camera** - Add media
- **close** - Close modal

### Typography
- **Headings**: Bold, 24px
- **Username**: Semibold, 16px
- **Caption**: Regular, 14px
- **Timestamp**: Regular, 12px, Gray

## 📊 Analytics (Future)

### User Metrics
- Total posts created
- Total likes received
- Total comments received
- Engagement rate
- Most popular post

### Platform Metrics
- Total posts
- Daily active users
- Most liked posts
- Trending topics
- Growth rate

## 🚀 Performance Optimization

### Current
- Pagination (10 posts per load)
- Image lazy loading
- Efficient Firebase queries
- Minimal re-renders

### Planned
- Infinite scroll
- Image compression
- Video thumbnails
- CDN integration
- Service worker caching

## 🌍 Environmental Impact

### Tracking (Future)
- Trees planted (from posts)
- Plastic removed (kg)
- Carbon offset (tons)
- Community events
- Global impact map

### Challenges Integration
- Link posts to challenges
- Verify challenge completion
- Award bonus XP
- Leaderboard integration

## 📈 Growth Strategy

### Phase 1 (Current)
- ✅ Basic posting
- ✅ Like/comment system
- ✅ Media uploads
- ✅ Responsive design

### Phase 2 (Next)
- [ ] Hashtags
- [ ] User mentions
- [ ] Search functionality
- [ ] Post reporting

### Phase 3 (Future)
- [ ] Stories (24h posts)
- [ ] Direct messaging
- [ ] Live streaming
- [ ] Video filters

### Phase 4 (Advanced)
- [ ] AI content moderation
- [ ] Personalized feed
- [ ] Trending algorithm
- [ ] Influencer program

## 💡 Use Cases

### For Students
- Share school eco-projects
- Document environmental journey
- Connect with peers
- Earn rewards for participation

### For Teachers
- Share classroom activities
- Inspire students
- Showcase school initiatives
- Build community

### For Global Users
- Share personal eco-actions
- Learn from others
- Find local events
- Track progress

### For Organizations
- Promote events
- Share impact reports
- Recruit volunteers
- Build brand awareness

## 🎓 Educational Value

### Learning Outcomes
- Environmental awareness
- Social media literacy
- Digital citizenship
- Community building
- Content creation skills

### Curriculum Integration
- Science projects
- Social studies
- Language arts
- Art & design
- Technology

## 🤝 Community Guidelines

### Do's
- ✅ Share authentic environmental actions
- ✅ Be respectful and supportive
- ✅ Give credit to others
- ✅ Use appropriate hashtags
- ✅ Inspire and educate

### Don'ts
- ❌ Post inappropriate content
- ❌ Spam or self-promote excessively
- ❌ Bully or harass others
- ❌ Share false information
- ❌ Violate copyright

## 📞 Support & Feedback

### Getting Help
- Check documentation
- Contact support team
- Report bugs
- Suggest features
- Join community forum

### Reporting Issues
- Inappropriate content
- Technical problems
- Security concerns
- Feature requests
- General feedback

---

**Green Feed** - Share your eco-journey, inspire others, save the planet! 🌍💚

# Virtual GP - AI Medical Consultation Platform

A mobile-first web application that provides an AI-powered medical consultation experience, built with Next.js and TypeScript.

## 🌟 Features

### 1. Mobile-Optimized Interface
- iPhone-style frame layout (375x812px viewport)
- Responsive design with mobile-first approach
- Smooth animations and transitions

### 2. Core Functionalities

#### Medical Consultation
- Real-time chat interface with AI doctor
- Camera integration (disabled in current version)
- Voice input capability (UI only)
- End consultation with summary generation

#### Medical Records Management
- Upload and manage medical reports
- Timeline view of medical history
- Edit and delete capabilities
- Secure access with fingerprint authentication

#### Appointment Booking
- Search and filter doctors by:
  - Gender
  - Price range
  - Distance
  - Available time slots (morning/afternoon/all day)
- Doctor profiles with detailed information
- Appointment scheduling system
- Medical records attachment feature

### 3. Security Features
- Fingerprint authentication for sensitive data
- Session management
- Secure data storage

## 🛠️ Technical Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI Components**: 
  - Shadcn UI
  - Tailwind CSS
  - Custom components
- **State Management**: React Hooks
- **Authentication**: Local storage based (demo)
- **Data Storage**: Local storage (simulated database)

## 📦 Project Structure

```
virtual_gp/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── chat/              # Chat consultation
│   │   ├── dashboard/         # Main dashboard
│   │   ├── medical-reports/   # Medical records
│   │   ├── book-appointment/  # Doctor booking
│   │   └── consultation-summary/ # Chat summaries
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   └── ...               # Other components
│   └── lib/                   # Utilities and helpers
├── public/                    # Static assets
└── ...                       # Config files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (preferred package manager)

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/Xwdgood/Virtual-GP.git
cd Virtual-GP
\`\`\`

2. Install dependencies
\`\`\`bash
pnpm install
\`\`\`

3. Start development server
\`\`\`bash
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

### Build for Production
\`\`\`bash
pnpm build
pnpm start
\`\`\`

## 🎯 Key Features in Detail

### Chat Consultation
- Structured medical questionnaire
- Symptom analysis
- Medical advice generation
- Emergency detection
- Consultation summary generation

### Medical Records
- Multiple record types support
- Secure access control
- Editable records
- Timeline visualization
- Export capabilities

### Doctor Booking System
- Advanced search and filter
- Real-time availability
- Location-based matching
- Appointment confirmation
- Medical record attachment

## 👥 User Flow

1. **Login/Dashboard**
   - Access main features
   - Quick action buttons
   - Session management

2. **Medical Consultation**
   - Start chat
   - Answer questions
   - Receive medical advice
   - End consultation
   - View summary

3. **Medical Records**
   - Fingerprint authentication
   - View/Edit records
   - Upload new records
   - Delete records

4. **Book Appointment**
   - Search doctors
   - Apply filters
   - View doctor profiles
   - Select time slot
   - Confirm booking

## 🔒 Security Considerations

- Fingerprint authentication for sensitive data
- Session management
- Secure data storage
- Privacy protection
- Data encryption (planned)

## 🎨 UI/UX Features

- Consistent color scheme
- Intuitive navigation
- Responsive design
- Loading states
- Error handling
- Success feedback
- Smooth transitions

## 🔄 Future Improvements

- [ ] Real doctor integration
- [ ] Video consultation
- [ ] Payment integration
- [ ] Cloud data storage
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Emergency services integration
- [ ] Health tracking features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn UI for beautiful components
- All contributors and testers

---

Built with ❤️ for AI Hackathon Festival 2025
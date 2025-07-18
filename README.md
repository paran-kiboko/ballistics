# Next.js Prototype Boilerplate

Korean-first Next.js 14 boilerplate for rapid prototyping with authentication, internationalization, and modern UI components.

## 🚀 Features

- **Next.js 14** with App Router
- **Authentication** - NextAuth.js with Google/Apple sign-in
- **Korean Language Support** - i18next with 6+ languages
- **Modern UI** - shadcn/ui + Tailwind CSS
- **State Management** - Redux Toolkit
- **Analytics** - Firebase Analytics + Vercel Analytics
- **TypeScript** - Full type safety
- **Responsive Design** - Mobile-first approach

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, SCSS
- **Authentication**: NextAuth.js
- **State**: Redux Toolkit
- **Internationalization**: i18next
- **Analytics**: Firebase, Vercel Analytics
- **Icons**: Lucide React
- **Animations**: Animate.css

## 📁 Project Structure

```
app/                    # Next.js App Router
├── api/               # API routes
├── common/            # Shared components
├── login/             # Authentication pages
├── dashboard/         # Main dashboard
└── ...

components/            # Reusable components
├── ui/               # shadcn/ui components
└── theme-provider.tsx

lib/                   # Utilities and configs
├── auth.ts           # Auth helpers
├── authOptions.ts    # NextAuth config
└── utils.ts

store/                 # Redux store
├── admin/            # App state
└── index.ts

locales/              # i18n translations
├── ko.json           # Korean (primary)
├── en.json           # English
└── ...
```

## 🚀 Quick Start

1. **Clone or copy the boilerplate**
   ```bash
   # For new project
   cp -r nextjs-prototype-boilerplate my-new-project
   cd my-new-project
   
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit: Next.js prototype boilerplate"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your credentials.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Authentication

Configure providers in `lib/authOptions.ts`:

```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add more providers
  ],
}
```

### Internationalization

Add translations in `locales/`:
- Primary: Korean (`ko.json`)
- Supported: English, Japanese, Thai, Vietnamese, Chinese

### Theme & Styling

- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality components
- **CSS Variables** - Easy theming
- **Dark Mode** - Built-in support

## 📱 Pages & Features

- **Landing** (`/`) - Auto-redirect based on auth
- **Login** (`/login`) - Authentication with providers
- **Dashboard** (`/dashboard`) - Main app interface
- **Profile** (`/edit-profile`) - User profile management
- **Settings** (`/account-settings`) - App preferences

## 🎨 UI Components

Pre-configured shadcn/ui components:
- Cards, Buttons, Forms
- Dialogs, Toasts, Alerts
- Navigation, Tabs, Accordions
- And 50+ more components

## 🌐 Internationalization

```typescript
import { useTranslation } from 'react-i18next'

function Component() {
  const { t } = useTranslation()
  
  return <h1>{t('dashboard.welcome', '대시보드')}</h1>
}
```

## 📊 Analytics

- **Firebase Analytics** - User behavior tracking
- **Vercel Analytics** - Performance monitoring
- **LogSnag** - Event notifications (optional)

## 🔒 Authentication Flow

1. User visits protected route
2. Redirects to `/login` if not authenticated
3. Choose provider (Google/Apple)
4. Callback & session creation
5. Redirect to `/dashboard`

## 🛡️ Security

- Environment variable protection
- NextAuth.js security
- CSRF protection
- Secure session management

## 📦 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## 🔧 Customization

### Adding New Pages

1. Create page in `app/your-page/page.tsx`
2. Add route protection if needed
3. Update navigation components

### Adding New Languages

1. Create new file in `locales/`
2. Update i18n configuration
3. Test with language switcher

### Styling Customization

1. Update `tailwind.config.ts`
2. Modify CSS variables in `globals.css`
3. Customize component themes

## 📝 Environment Variables

Required:
```env
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

Optional:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LOGSNAG_TOKEN=your-logsnag-token
CHANNEL_IO_PLUGIN_KEY=your-channel-io-key
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
1. Build: `npm run build`
2. Start: `npm start`
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - feel free to use for any project.

---

## 💡 Perfect For

- **MVP Development** - Get to market fast
- **Client Prototypes** - Professional demos
- **Korean Startups** - Localized by default
- **Full-stack Apps** - Add your backend
- **Learning Projects** - Best practices included

Happy prototyping! 🎉
# 🗂️ FUD-Archive

A Next.js web application for archiving and showcasing bad Bitcoin takes from social media.

## ✨ Features

- **Public Gallery** with advanced filtering (language, platform, year, topic, search)
- **Submission Form** with drag-and-drop image upload and client-side optimization
- **Admin Dashboard** for reviewing and moderating submissions
- **Internationalization** (English + German) via `next-intl`
- **Light/Dark Mode** with persistent theme preference
- **Mobile-Responsive** design throughout
- **Rate Limiting** and honeypot protection against spam

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Styling**: CSS Modules
- **i18n**: next-intl

## 📦 Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/fudarchive.git
   cd fudarchive
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run `supabase/schema.sql` in the SQL Editor
   - Create a storage bucket named `screenshots` (public)
   - Run `supabase/storage-policies.sql` in the SQL Editor
   - Create an admin user in Authentication → Users

4. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_EMAIL=your-admin@email.com
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   npx vercel
   ```

3. **Set environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`

## 📁 Project Structure

```
fudarchive/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and Supabase client
├── messages/              # i18n translations
├── supabase/              # Database schema and policies
└── public/                # Static assets
```

## 🔑 Admin Access

Navigate to `/admin` and log in with your admin credentials (configured in Supabase Authentication).

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

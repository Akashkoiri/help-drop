# 💧 Help Drop

Help Drop is a modern, lightning-fast issue tracking and helpdesk application built for clarity and speed. Designed to strip away the clutter of traditional issue trackers, it offers a focused workflow for modern product teams to manage support requests and tasks seamlessly.

![Help Drop Screenshot](public/logo.jpg) <!-- Replace with an actual dashboard screenshot later if needed -->

## ✨ Features

- **Minimalist Dashboard**: A clean, user-friendly interface that clearly separates Pending and Resolved issues.
- **Lightning Fast**: Built with modern Next.js optimizations for a fluid, instantaneous experience.
- **Secure Authentication**: Seamless user sign-in and access management powered by Clerk.
- **Dark/Light Mode**: Full theming support tailored for modern aesthetics.
- **Dynamic Interactions**: Smooth micro-animations powered by Framer Motion and custom UI components.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database & Backend**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/), [Tabler Icons](https://tabler.io/icons)

## 🛠️ Getting Started

### Prerequisites

Ensure you have Node.js and `npm` (or `yarn`, `pnpm`, `bun`) installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/help-drop.git
   cd help-drop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Supabase Database
   DATABASE_URL=your_supabase_postgresql_url
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations (Drizzle):**
   ```bash
   npx drizzle-kit push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
├── public/              # Static assets (images, fonts, etc.)
├── src/
│   ├── app/             # Next.js App Router (Pages, API routes, Layouts)
│   ├── components/      # Reusable React components (UI, Forms, etc.)
│   ├── lib/             # Utility functions, database config, schema
├── .env.local           # Environment variables (not tracked by Git)
├── drizzle.config.ts    # Drizzle ORM configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── package.json         # Project dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Help Drop, please feel free to fork the repository, make your changes, and submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

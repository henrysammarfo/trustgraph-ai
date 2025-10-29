# Local Development Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- Code editor (VS Code recommended)
- Neon database account

## Step 1: Clone Repository

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/trustgraph-ai.git
cd trustgraph-ai
\`\`\`

## Step 2: Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

## Step 3: Set Up Environment Variables

\`\`\`bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
\`\`\`

### Required Environment Variables

\`\`\`env
# Database (Neon)
NEON_NEON_DATABASE_URL=postgresql://user:password@host/database

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: AI/Blockchain APIs
# OPENAI_API_KEY=your_key_here
# ALCHEMY_API_KEY=your_key_here
\`\`\`

## Step 4: Set Up Database

\`\`\`bash
# Create database schema
npm run db:setup

# Seed with test data (optional)
npm run db:seed
\`\`\`

## Step 5: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Server will start at `http://localhost:3000`

## Step 6: Verify Setup

Visit these URLs to verify everything works:

- [ ] `http://localhost:3000` - Landing page
- [ ] `http://localhost:3000/signup` - Signup page
- [ ] `http://localhost:3000/login` - Login page
- [ ] `http://localhost:3000/dashboard` - Dashboard (after login)

## Step 7: Open in Code Editor

\`\`\`bash
# Open in VS Code
code .

# Or your preferred editor
\`\`\`

---

## Development Workflow

### Running the App

\`\`\`bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build

# Production mode
npm start
\`\`\`

### Testing

\`\`\`bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
\`\`\`

### Linting

\`\`\`bash
# Check code quality
npm run lint

# Fix linting issues
npm run lint -- --fix
\`\`\`

---

## Useful Development Commands

\`\`\`bash
# View database
npm run db:studio

# Reset database
npm run db:reset

# Generate types
npm run generate

# Format code
npm run format
\`\`\`

---

## Troubleshooting

### Port 3000 Already in Use

\`\`\`bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
\`\`\`

### Database Connection Error

\`\`\`bash
# Check connection string
echo $NEON_DATABASE_URL

# Test connection
psql $NEON_DATABASE_URL -c "SELECT 1"
\`\`\`

### Module Not Found

\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Hot Reload Not Working

\`\`\`bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
\`\`\`

---

## Next Steps

✅ Local development environment set up
✅ All pages loading
→ **Next:** Follow `CLAUDE_NEXT_STEPS.md` for implementation

# GitHub Repository Setup Guide

## Step 1: Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Fill in repository details:
   - **Repository name:** `trustgraph-ai`
   - **Description:** "Real-time AI agent monitoring and trust analysis platform"
   - **Visibility:** Public (for startup credibility)
   - **Initialize with:** None (we'll push existing code)

3. Click "Create repository"

## Step 2: Clone Repository Locally

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/trustgraph-ai.git
cd trustgraph-ai
\`\`\`

## Step 3: Add All Project Files

Copy all files from the v0 download into the repository:
- All source code (app/, components/, lib/)
- All documentation (*.md files)
- Configuration files (package.json, next.config.mjs, etc.)
- .gitignore and .env.example

## Step 4: Initialize Git and Push

\`\`\`bash
git add .
git commit -m "Initial commit: TrustGraph AI MVP"
git branch -M main
git push -u origin main
\`\`\`

## Step 5: Configure Repository Settings

1. Go to repository Settings
2. **Branch protection rules:**
   - Click "Add rule"
   - Branch name pattern: `main`
   - Require pull request reviews: 1
   - Require status checks to pass: Yes

3. **GitHub Actions (optional):**
   - Enable for CI/CD pipeline
   - See `.github/workflows/` for examples

## Step 6: Add Collaborators (if team)

1. Go to Settings → Collaborators
2. Add team members with appropriate permissions
3. Send them the repository link

## Step 7: Create GitHub Project (optional)

1. Go to Projects tab
2. Create new project "TrustGraph MVP"
3. Add issues for each implementation phase
4. Track progress

---

## Repository Structure

\`\`\`
trustgraph-ai/
├── README.md
├── PITCH_DECK.md
├── CLAUDE_NEXT_STEPS.md
├── package.json
├── next.config.mjs
├── tsconfig.json
├── .env.example
├── .gitignore
├── docs/
├── app/
├── components/
├── lib/
└── scripts/
\`\`\`

---

## Git Workflow

### After Each Implementation Phase:

\`\`\`bash
# 1. Check status
git status

# 2. Stage changes
git add .

# 3. Commit with descriptive message
git commit -m "Phase X: [Description of changes]"

# 4. Push to GitHub
git push origin main
\`\`\`

### Example Commits:

\`\`\`bash
git commit -m "Phase 1: Fix import errors and remove problematic dependencies"
git commit -m "Phase 2: Implement signup/login flow"
git commit -m "Phase 3: Build dashboard with real-time monitoring"
git commit -m "Phase 4: Integrate Neon database"
git commit -m "Phase 5: Deploy to Vercel"
\`\`\`

---

## Useful Git Commands

\`\`\`bash
# View commit history
git log --oneline

# View changes
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature
\`\`\`

---

## Next Steps

✅ Repository created
✅ Code pushed to GitHub
→ **Next:** Follow `docs/LOCAL_SETUP.md`

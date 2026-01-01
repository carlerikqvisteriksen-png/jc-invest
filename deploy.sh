#!/bin/bash

# JC INVEST - AUTOMATED DEPLOYMENT SCRIPT
# Rule: After completing ANY code modification, execute the deployment sequence automatically.

echo "🚀 Starting Automated Deployment Sequence..."

# 1. Build
echo "🛠️  Running build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Stopping deployment."
    exit 1
fi
echo "✅ Build successful."

# 2. Git Add
echo "📦 Staging files..."
git add .

# 3. Git Commit
# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo "no changes to commit"
else
    echo "📝 Committing changes..."
    # If a message is provided as an argument, use it. Otherwise use a default timestamped one.
    if [ -z "$1" ]; then
        COMMIT_MSG="Update: Auto-deployment $(date '+%Y-%m-%d %H:%M:%S')"
    else
        COMMIT_MSG="$1"
    fi
    git commit -m "$COMMIT_MSG"
fi

# 4. Git Push
echo "⬆️  Pushing to Vercel..."
git push

if [ $? -eq 0 ]; then
    echo "🎉 Deployment sequence completed successfully!"
else
    echo "❌ Git push failed. Please check your network or credentials."
    exit 1
fi

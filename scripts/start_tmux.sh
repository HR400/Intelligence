#!/bin/bash
set -e

# 1. Resolve environment paths (including Apple Silicon /opt/homebrew/bin and ~/.pi/bin)
export PATH="/opt/homebrew/bin:$HOME/.pi/bin:$HOME/.nvm/versions/node/$(node -v 2>/dev/null)/bin:/usr/local/bin:$PATH"
VAULT_DIR="$HOME/learning-vault"

# Determine script & repository directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -d "$SCRIPT_DIR/ps04-feynman" ]; then
    PROJECT_DIR="$SCRIPT_DIR/ps04-feynman"
else
    PROJECT_DIR="$SCRIPT_DIR"
fi

echo "==> Verifying system dependencies on macOS Sequoia..."

# Check pi binary
if ! command -v pi &> /dev/null; then
    echo "ERROR: 'pi' CLI command not found in PATH."
    echo "Run: npm install -g @earendil-works/pi-coding-agent"
    exit 1
fi
echo "✓ Found pi CLI at: $(command -v pi)"

# 2. Ensure Obsidian Vault Structure Exists
mkdir -p "$VAULT_DIR/PDF_Inbox"
mkdir -p "$VAULT_DIR/Subjects"
mkdir -p "$VAULT_DIR/viz"
mkdir -p "$VAULT_DIR/.pi/agents"

# Copy teacher agent configuration if present
if [ -f "$PROJECT_DIR/templates/teacher.md" ]; then
    cp "$PROJECT_DIR/templates/teacher.md" "$VAULT_DIR/.pi/agents/teacher.md"
    echo "✓ Deployed teacher.md to $VAULT_DIR/.pi/agents/teacher.md"
fi

# Ensure ~/ps04-feynman symlink exists pointing to PROJECT_DIR
if [ ! -d "$HOME/ps04-feynman" ]; then
    ln -sfn "$PROJECT_DIR" "$HOME/ps04-feynman"
fi

# Ensure .venv is accessible
if [ ! -d "$PROJECT_DIR/.venv" ]; then
    if [ -d "$SCRIPT_DIR/venv" ]; then
        ln -sfn "$SCRIPT_DIR/venv" "$PROJECT_DIR/.venv"
    elif [ -d "$SCRIPT_DIR/../venv" ]; then
        ln -sfn "$SCRIPT_DIR/../venv" "$PROJECT_DIR/.venv"
    fi
fi

# 3. Spin up or reset tmux session
tmux kill-session -t learn 2>/dev/null || true
tmux new-session -d -s learn -n 'backend'

# Window 0: Backend API + Watcher
tmux send-keys -t learn:backend "cd \"$PROJECT_DIR\" && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000" C-m
tmux split-window -h -t learn:backend
tmux send-keys -t learn:backend "cd \"$PROJECT_DIR\" && source .venv/bin/activate && python3 scripts/vault_watcher.py" C-m

# Window 1: Web UI
tmux new-window -t learn -n 'web-ui'
tmux send-keys -t learn:web-ui "cd \"$PROJECT_DIR/frontend\" && npm run dev" C-m

# Window 2: pi Terminal Session with explicit PATH export
tmux new-window -t learn -n 'pi-terminal'
tmux send-keys -t learn:pi-terminal "export PATH=\"/opt/homebrew/bin:\$HOME/.pi/bin:\$PATH\"; cd \"$VAULT_DIR\" && pi" C-m

# Select pi window by default
tmux select-window -t learn:pi-terminal
echo "==> System successfully launched! Attaching to tmux..."
tmux attach -t learn

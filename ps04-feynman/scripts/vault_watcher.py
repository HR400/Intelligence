import os
import time
import requests
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import frontmatter

API_URL = "http://localhost:8000/api/sync/vault-node"

# Ensure absolute path expansion without tilde bottleneck
VAULT_PATH = Path.home() / "learning-vault"
VAULT_PATH.mkdir(parents=True, exist_ok=True)
(VAULT_PATH / "PDF_Inbox").mkdir(parents=True, exist_ok=True)
(VAULT_PATH / "Subjects").mkdir(parents=True, exist_ok=True)


class VaultSyncHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory or not event.src_path.endswith(".md"):
            return
        try:
            post = frontmatter.load(event.src_path)
            if "node_id" in post.metadata:
                payload = {
                    "node_id": post.metadata["node_id"],
                    "mastery_score": float(post.metadata.get("mastery_score", 0.0)),
                    "status": post.metadata.get("status", "LOCKED"),
                    "content": post.content,
                    "filepath": event.src_path,
                }
                requests.post(API_URL, json=payload, timeout=2)
                print(f"[Watcher] Synced {post.metadata['node_id']} (Mastery: {post.metadata.get('mastery_score')})")
        except Exception as e:
            print(f"[Watcher Error] {e}")


if __name__ == "__main__":
    subjects_path = VAULT_PATH / "Subjects"
    print(f"[Watcher] Starting Obsidian Vault observer on: {subjects_path}")
    observer = Observer()
    observer.schedule(VaultSyncHandler(), path=str(subjects_path), recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

---
name: make-pr
description: When making a pr, create a new branch, commit the changes, and push to origin. The pr should be titled with the provided argument and include a description of the changes.
argument-hint: "pr-title"
---

# Make a Pull Request

The user wants to make a pull request with the title "$ARGUMENTS".

## Steps

1. Create a new git branch named `$ARGUMENTS` (or a slugified version of it)
2. Commit all changes with a message like "Update bots.json with new bot entry"
3. Push the branch to origin
4. Create a pull request on GitHub with the title "$ARGUMENTS" and a description that summarizes the changes made (e.g. "Added a new bot entry to bots.json with placeholder values for token, webhookUrl, and sessionId.").

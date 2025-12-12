---
name: worktrees
description: use this when there is a complex task that requires multiple steps
---

## worktrees

use git worktrees when working on a complex task, without disturbing the main branch

this can be useful when there is a dev server running and you need to switch branches quickly,

or when a coworker asked you to fix a bug on main branch while you are working on a feature branch,

or when reviewing a PR that has multiple commits and you want to test the changes locally without disturbing your current branch

### creating a worktree 

in the project directory, the `.worktrees` folder contains all the worktrees created for that repository

we first need to make sure that the `.worktrees` folder exists

```bash
mkdir -p .worktrees
```

then, we need to check if it is in the `.gitignore` file, if not, we need to add it immediately

```bash
grep -qxF '.worktrees' .gitignore || echo '.worktrees' >> .gitignore
```

finally, to create a worktree, use the following command:

```bash
git worktree add .worktrees/<worktree-name> <branch-name>
```

always tell the user when creating a worktree, never assume that they know

### move to a worktree 

to move to a worktree, simply change directory to the worktree folder

```bash
cd .worktrees/<worktree-name>
```
now you can work on the branch without disturbing the main branch 

### removing a worktree 

to remove a worktree, use the following command :

```bash
# first make sure you are not in the worktree directory
cd ..
# now remove the worktree
git worktree remove .worktrees/<worktree-name>
```
this will remove the worktree and all its files, but will not delete the branch 

### listing worktrees

to list all the worktrees for the repository, use the following command :

```bash
git worktree list 
```
this will show the path and branch name for each worktree 

### misc.

- always make sure to commit or stash your changes before switching worktrees
- never delete a worktree directory manually, always use the git command to remove it 
- if you delete a branch that has a worktree, you need to remove the worktree first before deleting the branch 
- worktrees can be used to test different versions of dependencies or configurations without affecting the main branch 
- always clean up unused worktrees to avoid clutter and confusion

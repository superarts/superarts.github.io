---
layout: post
title:  Subversion Guidance
date:   2008-08-17 07:58:00
tags:
- Subversion
---

This article was written for internal training purpose when I was working in ATEN Shanghai.

Content
---
Legend

1. Tips Before Reading
1. Repository Overview
1. Repository Setup
1. User / Password Setup
1. Authorization Setup    
1. Starting SVNServe Daemon
1. Initial Checkout
1. Update, Change, Cleanup & Commit (Check In)
1. Add, Delete, Copy, Move, Mkdir, & Revert
1. Viewing History
1. Fetching History
1. Lock & Unlock
1. Repository Backup
1. Branching & Merging


### Legend:
- Words in `UPPERCASE`
  - it's kinda 'variable' thing, so that it should vary depending on actual case.
- `N/A`
  - blank fields.
- `[itme1|item2|...|]`
  - items1, items2, ..., N/A may present.
- `$`
  - command line



### 1.    Tips Before Reading

This document is for both svn admins and svn users. Before reading, please take a look at the content section, and pick up the topic you have interest in. To get the detailed information about svn, see corresponding section of its documentation. It's pretty well.

Although this document covers most basic topics of svn, basic concept should be noticed from the beginning. You should already know that what I mean svn is subversion, a version control software, which is similar with cvs and is not so fimiliar with StarTeam or VSS, which means - let's make it easy - it's based on merging but not locking.

Svn has some components such as svn, svnadmin, svnserve, etc. They will be mentioned later in the following chapters. Command line usage will be mentioned first while a GUI will be introduced later. There will not be too much description about how to use command line program, see svn document - remarks and examples - when necessary.

One last thing: when you got confused sometimes, type '$svn help' in the first place. That may save you a lot of time...



### 2.     Repository Overview

Multiple repository structure is used as storage layout. Each repository contains a project or some files that are of the same purpose, so that words 'repository' and 'project' usually refer to the same thing.
Repositories share the same password and authorization files, which are located in the root svn folder (d:\svn will be taken as an example).



### 3.     Repository Setup

As svn community suggested, whether a repository hosts one or more projects within, the structure of TTB directories should be considered in the first place. See the paragraph below from svn document.

*Notice*: Because Subversion uses regular directory copies for branching and tagging (see Chapter 4, Branching and Merging), the Subversion community recommends that you choose a repository location for each project root—the “top-most” directory which contains data related to that project—and then create three subdirectories beneath that root: trunk, meaning the directory under which the main project development occurs; branches, which is a directory in which to create various named branches of the main development line; tags, which is a directory of branches that are created, and perhaps destroyed, but never changed.

- Create repository: `$svnadmin create d:\svn\PROJECT_NAME`
- Import files: `$svn import PROJECT_PATH file:///d:/svn/PROJECT_NAME -m "REVISION MESSAGE"`
- Edit `d:\svn\PROJECT_NAME\conf\subserve.conf`, then:
  - Modify `# password-db` section to `..\..\passwd`, which is pointed to `d:\svn\passwd`;
  - Modify `# authz-db` section to `..\..\authz`, which is pointed to `d:\svn\authz`;
  - Modify `anon-access = read` to `anon-access = none` to prevent anonymous login.



### 4.     User / Password Setup

- Edit `d:\svn\passwd`:
  - Find `users` field;
  - Add records in format: `USER_NAME = PASSWORD`;



### 5.     Authorization Setup

- Edit `d:\svn\authz`:
  - Edit group:
    - Find `groups` field;
    - Add records in format: `GROUP_NAME = USER_NAME_1,USER_NAME_2,...`
  - Edit authorization for groups:
    - Add fields in `PROJECT:PATH format`;
    - Add records in `[@GROUP_NAME|*] = [r|rw|] format`, * means all groups while N/A means no-access;



### 6.    Starting SVNServe Daemon

-     Start daemon in root: $svnserve -d -r d:\svn
-     How to visit: $svn COMMAND svn://HOSTID/PROJECT_NAME OPTION



### 7.    Initial Checkout

To start working, users need to checkout current revision initially.

-     Go to your local root working directory, e.g. d:\project
-     Checkout: $svn checkout svn://HOSTID/PROJECT_NAME



### 8.    Update, Change, Cleanup & Commit (Check In)

- Update to the newest revision: $svn update PROJECT_NAME
- Apply Changes to certain files (file content).
- Check status before checkin: $svn status PROJECT_NAME
  - `-u`: show updates (login needed)
- Cleanup L status: $svn cleanup
- Check detailed difference: $svn diff PROJECT_NAME
- Commit changes: `$svn commit PROJECT_NAME [-m "REVISION MESSAGE"|--file LOG_FILE_NAME]`



### 9.    Add, Delete, Copy, Move, Mkdir, & Revert

If changes other than file content, but file structure are made, corresponding svn commands should be used. Those commands are used between each update and commit. You need to enter the root folder of the project / repository first, though.

- Add file or directory: `$svn add NAME`
- Delete file or directory: `$svn delete NAME`
  - Note: all files will be deleted if NAME is a directory, but it will remain there as an empty direcotry until next commit.
- Copy file or directory: `$svn copy SOURCE_NAME DEST_NAME`
- Move file or directory: `$svn move SOURCE_NAME DEST_NAME`
  - Note: move is exactly the same as 'add and delete' commands.
- Make directory: `$svn mkdir DIR_NAME`
- Revert (undo) changes: `$svn revert NAME`



### 10.    Viewing History

- View logs: $svn log PROJECT_NAME
  - -r REVISION_START:REVISION_END is used for viewing history between certain revisions.
  - Command log can be used for both the whole project and a file / directory.
  - -v is used for verbose mode, as you may expect.
- View difference between revisions: $svn diff -r REVISION1:REVISION2 NAME
- View file history content: $svn cat -r REVISION FILE_NAME
- View file history list: $svn list -r REVISION DIRECTORY_NAME



### 11.    Fetching History

Both the commands 'checkout' and 'update' work for previous revision, by adding '-r REVISION' argument. Besides, command 'export' works for getting a revision without those .svn directories. Like checkout and update, if -r does not present, latest revision will be exported as default.

- Export revision: $svn export -r REVISION



### 12.    Lock & Unlock

In svn, lock can only work for files, but not directories. Stay good communication for lock related operations!

- Lock a file: `$svn lock FILE_NAME [-m "MESSAGE"|--file LOG_FILE]`
  - Check brief status: `$svn status`
  - Check detailed lock info: `$svn info FILE_NAME`
- Command commit will unlock the file.
  - --no-unlock option makes commit without unlocking the file.
- Unlock a file: `$svn unlock FILE_NAME`
  - Command unlock can only be performed by the user who locked the file.
- Break a lock: $svn unlock --force ...
- Steal a lock: $svn lock --force ...



### 13.    Repository Backup

- Dump all: $svnadmin dump PROJECT > DUMP_FILE
- Load all: $svnadmin load PROJECT < DUMP_FILE
- Dump incrementally: $svnadmin dump PROJECT --incremental -r REVISION_HEAD:REVISION_TAIL > DUMP_FILE
- Load incrementally: $svnadmin load PROJECT < DUMP_FILE_XX one by one



### 14.    Branching & Merging

Branching is an important concept in version control. Contents below only show how to perform this technically; specified cases such as working flow will be discussed in another document.
TTB directories is assumed to be used here.

- Create a branch
  - Make a cheap copy based on local: `$svn copy trunk branches/BRANCH_NAME`
  - OR make a cheap copy based on url: $svn copy `svn://HOSTID/trunk svn://HOSTID/branches/BRANCH_NAME`
  - Commit changes: `$svn commit -m "BRANCH CREATED: /trunk"`
- Work with a branch
  - Checkout: $svn checkout `svn://HOSTID/branches/BRANCH_NAME`
  - Apply changes to this branch
- Merge between trunk and branch
  - Check newest changes on terminal: `$svn diff -r REV_OLD:REV_NEW svn://HOSTID/trunk`
  - Merge newest changes to local: `$svn merge -r REV_OLD:REV_NEW svn://HOSTID/trunk`
- Tag a version: `$svn copy svn://HOSTID/trunk svn://HOSTID/tags/TAG_NAME`



### XXX.    Advanced Topics Not Covered in This Document

Resolving Conflict, Property, Portability, Ignorance, Keyword Substitution...

- Conflict may occur when different users edit a file at the same time. Merging manually should be used to resolve conflicts.
- Property is a file-specified mechanism, which can be considered as a two fields 'table' - name & value.
- Protability should be considered for cross-platform development.
- Ignorance is used for unversioned files, such as text editor backups, intermediate compiling files, etc.
- Keyword substitution is a mechanism that helps people substitute things (revision number, author, date, etc.) by using svn keywords.

Originally published at [Google Sites](https://sites.google.com/a/superarts.org/studio/Home/documents/subversion-guidance?pli=1)

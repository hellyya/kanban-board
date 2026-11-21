# Kanban Task Board

A lightweight Kanban board built with React that runs entirely in the browser. There is no build step and no backend.

## Features

- Three starter columns (**To Do**, **In Progress**, **Done**), plus your own custom boards
- Add tasks with a title, description and creation date
- **Drag and drop** tasks between columns, or onto another task to reorder them
- Rename and delete boards
- Everything is saved to `localStorage`, so your boards survive a page reload

## Tech stack

React 18 (loaded from a CDN), JavaScript, HTML, CSS. JSX is compiled in the browser with Babel Standalone.

## Running it

Open `index.html` in a browser. That's it.

## How it works

- Board and task state lives in React `useState` hooks and is written to `localStorage` on every change through a `useEffect` hook.
- Drag-and-drop uses the native HTML5 drag events. The dragged task's ID and its source board are held in state, and a single `moveTask` function handles moving a task between columns and reordering it within a column.

---
title: Redesigning this site around one light
date: 2026-09-26
kind: Exploration
summary: Cutting six hover effects down to one motif borrowed from 80s tail lamps.
draft: true
---

This is a starter post so you can see how writing looks on the site. It's marked `draft: true`, so it only shows up when running locally. Edit it, or delete the file.

The design started from the pixel-grid lamps on Hyundai's heritage concept cars: dim cells at rest, lit cells when something is on.

## What changed

- The first version had six unrelated effects. Each was nice on its own, but together they felt random.
- Now there's one motif: a strip of lamp cells that lights up to show what you're pointing at.
- Every animation shares one duration and one easing curve.

## Writing a new post

Add a markdown file to `src/content/writing/`. The filename becomes the URL, and the block at the top sets the title, date, kind and summary.

---
title: Pixelated headers
date: 2026-09-27
kind: Exploration
summary: A grid of lamp cells borrowed from a Hyundai headlamp, and everything else it turned out to be good at showing, from fireflies to gradient descent.
draft: true
---

The design of this site started with a headlamp from one of Hyundai's heritage concept cars. Behind the glass is a grid of square lenses, six rows deep, each one its own little lamp inside a chrome frame. The part I liked most is that the grid never disappears. When the lamp is off you can still see every lens, and when it's on the gaps between them stay dark, so the light always reads as cells.

![A headlamp made of a grid of square lenses, six rows deep, lit bright white inside a chrome frame](/writing/hyundai-headlamp.jpg)

*The headlamp that started it, from one of Hyundai's heritage concept cars.*

The footer of this site became a band of those cells that light up around your cursor. I wanted the top of the home page to use the same idea, so the page opens and closes on one motif.

That gave the header a job with a few rules. It sits behind my name and a paragraph of text, so it has to be calm. It's there every time the page loads, so it can't get old. And it should read as a surface, like the lamp itself, not a scene that's trying to say something.

So I built a grid and tried things on it. The first two groups below are real candidates for the header. The last group never was: once the grid existed, it turned out to be good at showing how simulations and learning algorithms behave, and I kept going. Every demo is live, and most have sliders underneath.

## The grid

A few decisions carry over from the headlamp to every demo.

**A cell is never fully off.** At rest it sits at 12% brightness, like an unlit lens, so the grid is always visible even when nothing is happening.

**Bright cells grow.** As a cell brightens it swells from 86% to 100% of its slot, and the whole field has a soft glow around it. The gaps shrink as the light gets stronger, which is what makes a lit cell feel like it's giving off light instead of just changing color.

**Light fades instead of switching off.** Every pattern has afterglow, like a bulb filament cooling down. When a cell should go dark, it dims over a few frames instead. This one decision does more than anything else to make the grid feel like hardware rather than a spreadsheet, and it turns out to matter in almost every demo below.

**The cursor is a lamp.** Move over the field and the cells near you light up, spreading a little more sideways than up and down so it matches the wide shape of the strip. It sits on top of whatever pattern is running, so every demo responds to you the same way.

```pixel
flat height=96 interactive
```

## Lamps

Things a real lamp panel could do.

### Sweep

The obvious 80s reference is a scanner bar sliding back and forth. It only works because of afterglow: the bar leaves a tail as it moves instead of jumping from cell to cell.

```pixel
sweep height=64 controls
```

It looks great for about four seconds. After that it feels like a loading bar, and it pulls your eye away from everything else on the page.

### Clock

A grid of lamps is basically a scoreboard, so it can tell the time. This is your local time in a tiny 3×5 font. The colons blink every half second, and afterglow blurs each digit change a little, like an old incandescent scoreboard.

```pixel
clock height=150 cell=8
```

It's the most useful demo here and the wrong one for a header. A clock makes a personal site feel like a dashboard.

### Dither

Real lamp matrices are often just on or off, with no in-between. This takes the clouds pattern from the next section and forces every cell to one or the other, using a repeating pattern of thresholds so soft areas turn into checkerboards instead of grays.

```pixel
dither controls
```

This looks the most like real hardware. It also flickers the most, because cells near their threshold keep switching as the clouds move. Behind text, that flicker is all you notice.

## Nature

### Clouds

Soft blobs of light drifting slowly across the strip, like clouds passing over the sun. It never repeats, and nothing in it ever demands attention. The blobs are wide and flat to suit a strip that's much wider than it is tall. The Threshold slider decides how much of the sky counts as lit.

```pixel
drift controls
```

This is calm enough to leave running behind a name and a paragraph of text.

### Rain

Each column has a drop falling at its own speed, trailing afterglow. This one uses bigger cells, closer to the footer's.

```pixel
rain cell=16 controls
```

It's nice, but it's a scene more than a surface. Rain says something specific, and the home page doesn't need to say it.

### Ripple

This one already lives on the site. Click the footer band at the bottom of this page and a ring spreads out from where you clicked, like a drop hitting a pond. Here, drops land on their own every second or so. The rings spread wider than they are tall, to match the strip. Click anywhere to drop your own.

```pixel
ripple cell=24 height=110 interactive controls
```

In the footer, a ripple is an answer: you click, it responds. Running on its own, every drop is an event, and each one pulls your eye the same way the sweep does. It works best when you're the one making it happen.

### Fireflies

In a few places, like the Great Smoky Mountains, thousands of fireflies end up flashing in unison. None of them is leading. Each one just nudges its own rhythm toward the flashes it can see nearby, and a whole field slowly falls into step.

```pixel
fireflies height=180 cell=10 controls
```

They start out random and are mostly flashing together within 10 to 20 seconds. Drop Coupling to 0 and they never sync. Around 0.15 it's a coin flip: some fields lock in and others drift in and out of step for as long as you watch.

This was the closest call for the header. It's calm and it's nature, but the moment they sync is an event, and an event pulls your eye the same way the sweep does.

## Simulations

None of these were header candidates. They're here because a grid of lamps with afterglow turned out to be a surprisingly good way to watch something think.

### Game of Life

A grid of cells that are on or off is exactly what Conway's Game of Life runs on. This is the first demo where the grid isn't just showing something. The cells are the thing. Afterglow means dying cells fade out instead of vanishing, which makes it much easier to follow what's moving. Click to drop a glider.

```pixel
life height=180 cell=10 controls
```

### Gradient descent

The background is a landscape of hills and valleys, drawn as a few brightness levels so it reads like a contour map where the valleys glow. Each bright dot is rolling downhill, looking for the lowest point. Click anywhere to drop a new one.

```pixel
descent height=180 controls
```

Afterglow is what makes this readable. Every step leaves a fading trail, so you can see the path each point took, including the ones that overshoot a valley and swing back. Some settle in a small dip and never find the deepest valley. That's a local minimum, and it's easier to understand by watching it happen than by reading the definition.

Set Momentum to 0 and the points crawl. Turn Bumpiness up and small dips appear everywhere. Without momentum, points get stuck in them. With it, most roll straight through.

### k-means

k-means finds groups in data. The dim points are fixed, drawn from a few blobs. The bright cells are centers looking for those groups: every point joins its nearest center, every center moves to the middle of its points, and that repeats until nothing moves. The faint lines are the borders between each center's territory. Point at a region to light up the points that belong to it.

```pixel
kmeans height=200 cell=10 controls
```

The surprising part is what happens when k matches Blobs exactly. Even then, it only gives each blob its own center about half the time. Often two centers start in the same blob and split it, while one far away ends up covering two. Once it's there, it can't fix itself. It's the same trap as the dots stuck in a small dip above.

These are toys. The landscape is made up and the blobs are generated. But on a monochrome grid with no axes or labels, you can still see momentum, dead ends, and groups being found, including the times they aren't.

## What shipped

Going back to the rules: calm, doesn't get old, a surface and not a scene. Sweep, ripple and fireflies each have moments that pull your eye. Rain and the clock say something specific. Dither flickers. The simulations are interesting to watch but need a paragraph of explanation each.

Clouds is the only one that passes all three. The home page runs it at a lower brightness so the text on top stays readable, with the cursor light on top so it responds the same way the footer band does:

```pixel
drift level=0.7 height=200 interactive
Jared Rudnicki
I build software where design and AI meet.
```

## How it works

For anyone curious about what's underneath, a few parts were more interesting than I expected.

**Every demo is one function.** A pattern takes a cell's position and the current time and returns a brightness from 0 to 1. The grid calls it for every cell, every frame. If you've written a shader, it's the same idea at a much lower resolution. The simulations are the exception: they keep their own state and update it once per frame before the cells are drawn.

```js
// x: the cells column
// y: the cells row
// t: seconds since the field started, adjusted by slider
// returns: brightness, from 0 (resting) to 1 (fully lit)
const pattern = (x, y, t) => brightness;
```

**Afterglow is two lines.** Each cell takes whichever is brighter: what the pattern wants now, or what it had last frame after fading a little. The fade is raised to the power of the time since the last frame, so trails are the same length on a 60Hz laptop and a 120Hz phone:

```js
const keep = Math.pow(afterglow, dt * 60);
glow[k] = Math.max(pattern(x, y, t), glow[k] * keep);
```

**The glow is one CSS filter.** The footer draws each cell as a `<span>`, which is fine for about a hundred cells. A header has over a thousand, and this page has a dozen headers, so these are drawn on `<canvas>`. The soft glow is a single `drop-shadow` filter on the whole canvas. Giving each cell its own canvas shadow would mean a thousand blurs every frame.

**Only what you can see is running.** Each field pauses as soon as it scrolls out of view, so only the one or two on screen are animating. A long pause, like switching tabs, is capped so the simulations don't jump ahead when you come back.

**Reduced motion still shows something.** If you've turned on reduced motion, every field draws a single still frame. For the simulations, that frame is run a few hundred steps forward first, so you see the process part-way through instead of its random start.

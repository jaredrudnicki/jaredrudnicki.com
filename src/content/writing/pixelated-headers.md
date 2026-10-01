---
title: Pixelated headers
date: 2026-09-27
kind: Exploration
summary: A grid of lamp cells borrowed from a Hyundai headlamp, the patterns I tried on it for the home page header, and the simulations it turned out to be good at showing.
draft: true
---

The design of this site started with a headlamp from one of Hyundai's heritage concept cars. Behind the glass is a grid of square lenses, six rows deep, each one its own little lamp inside a chrome frame. The part I liked most is that the grid never disappears. When the lamp is off you can still see every lens, and when it's on the gaps between them stay dark, so the light always reads as cells.

![A headlamp made of a grid of square lenses, six rows deep, lit bright white inside a chrome frame](/writing/hyundai-headlamp.jpg)

*The headlamp that started it, from one of Hyundai's heritage concept cars.*

The footer of this site became a band of those cells that light up around your cursor. I wanted the top of the home page to use the same idea, so the top and bottom of the page match.

That set three rules for the header. It sits behind my name and a paragraph of text, so it has to be calm. It's there every time the page loads, so it can't get old. And like the lamp itself, it should be a pattern of light, not a picture of something.

So I built a grid and tried patterns on it. The first two groups below are real candidates for the header. The last group never was. Once the grid existed, it turned out to be good at showing how simulations and learning algorithms behave, so I kept going. Every demo is live, and most have sliders underneath.

## The grid

A few decisions carry over from the headlamp to every demo.

**A cell is never fully off.** At rest it's at 12% brightness, like an unlit lens, so the grid is always visible even when nothing is happening.

**Bright cells grow.** As a cell brightens it grows from 86% to 100% of its slot, and the whole field has a soft glow around it. The gaps shrink as the light gets stronger. That's what makes a lit cell look like it's giving off light instead of changing color.

**Light fades instead of switching off.** Every pattern has afterglow, like a bulb filament cooling down. When a pattern turns a cell off, the cell dims over a few frames. This one decision does the most to make the grid look like hardware instead of a spreadsheet. It also matters in almost every demo below.

**The cursor lights cells.** Move over the field and the cells near you light up. The light spreads a little more sideways than up and down, to match the wide strip. It adds to whatever pattern is running, so every demo responds to the cursor the same way.

```pixel
flat height=96 interactive
```

## Lamps

Patterns a real lamp panel could show.

### Sweep

The obvious 80s reference is a scanner bar sliding back and forth. It only works because of afterglow. The bar leaves a tail as it moves instead of jumping from cell to cell.

```pixel
sweep height=64 controls
```

It looks great for about four seconds. After that it feels like a loading bar, and it pulls your eye away from everything else on the page.

### Clock

A grid of lamps is a scoreboard, so it can show the time. This is your local time in a tiny 3×5 font. The colons blink every half second, and afterglow blurs each digit change a little, like an old incandescent scoreboard.

```pixel
clock height=150 cell=8
```

It's the most useful demo here and the wrong one for a header. A clock makes a personal site feel like a dashboard.

### Dither

Real lamp matrices are often only on or off. This demo takes the clouds pattern from the next section and forces every cell to one or the other. It uses a repeating pattern of thresholds, so soft areas turn into checkerboards instead of grays.

```pixel
dither controls
```

This looks the most like real hardware. It also flickers the most, because cells near their threshold keep switching as the clouds move. Behind text, that flicker is all you notice.

## Nature

### Clouds

Soft blobs of light drift across the strip, like clouds passing over the sun. It never repeats, and nothing in it changes suddenly. The blobs are wide and flat to suit a strip that's much wider than it is tall. The Threshold slider sets how much of the sky counts as lit.

```pixel
drift controls
```

This is calm enough to leave running behind a name and a paragraph of text.

### Rain

Each column has a drop falling at its own speed, with an afterglow trail. This one uses bigger cells, closer to the footer's.

```pixel
rain cell=16 controls
```

It's nice, but it's a picture of rain, and the home page has no reason to show rain.

### Ripple

This one is already on the site. Click the footer band at the bottom of this page and a ring spreads out from where you clicked, like a drop hitting a pond. Here, drops land on their own every second or so. The rings spread wider than they are tall, to match the strip. Click anywhere to drop your own.

```pixel
ripple cell=24 height=110 interactive controls
```

In the footer, a ripple only happens when you click. Here, drops land on their own, and each one pulls your eye the same way the sweep does. It works best when you cause it.

### Fireflies

In a few places, like the Great Smoky Mountains, thousands of fireflies end up flashing in unison. No firefly leads. Each one nudges its own rhythm toward the flashes it can see nearby, and after a while the whole field flashes together.

```pixel
fireflies height=180 cell=10 controls
```

They start out random and are mostly flashing together within 10 to 20 seconds. Drop Coupling to 0 and they never sync. Around 0.15 it's a coin flip. Some fields sync, and others drift in and out of step for as long as you watch.

This was the closest call for the header. It's calm, but the moment they sync pulls your eye the same way the sweep does.

## Simulations

None of these were header candidates. They're here because a grid of lamps with afterglow turned out to be a good way to watch an algorithm work.

### Game of Life

Conway's Game of Life runs on a grid of cells that are on or off, so it fits the lamp grid directly. In the other demos the grid displays a pattern. Here, the cells are the simulation. Afterglow makes dying cells fade out instead of vanishing, so it's easier to follow what's moving. Click to drop a glider.

```pixel
life height=180 cell=10 controls
```

### Gradient descent

The background is a landscape of hills and valleys, drawn as a few brightness levels so it reads like a contour map where the valleys glow. Each bright point rolls downhill, looking for the lowest spot. Click anywhere to drop a new one.

```pixel
descent height=180 controls
```

Afterglow is what makes this readable. Every step leaves a fading trail, so you can see the path each point took, including the ones that overshoot a valley and swing back. Some settle in a small dip and never find the deepest valley. That's a local minimum, and it's easier to understand by watching it happen than by reading the definition.

Set Momentum to 0 and the points crawl. Turn Bumpiness up and small dips appear everywhere. Without momentum, points get stuck in them. With it, most roll straight through.

### k-means

k-means finds groups in data. The dim points are fixed, drawn from a few blobs. The bright cells are centers looking for those groups. Each round, every point joins its nearest center, and every center moves to the middle of its points. That repeats until nothing moves. The faint lines are the borders between each center's territory. Hover over a region to light up its points.

```pixel
kmeans height=200 cell=10 controls
```

Even when k matches Blobs exactly, each blob gets its own center only about half the time. Often two centers start in the same blob and split it, while one far away ends up covering two. Once that happens, k-means can't fix it. It's the same trap as the points stuck in a small dip above.

These are toys. The landscape is made up and the blobs are random. Still, on a monochrome grid with no axes or labels, you can watch momentum carry a point through a dip, another point get stuck, and k-means split a blob it shouldn't.

## What shipped

Back to the three rules: calm, doesn't get old, and not a picture of something. Sweep, ripple and fireflies each have moments that pull your eye. Rain and the clock are pictures of something. Dither flickers. The simulations are interesting to watch but need a paragraph of explanation each.

Clouds is the only one that passes all three. The home page runs it at a lower brightness so the text on top stays readable. The cursor light works on it the same way it does in the footer band.

```pixel
drift level=0.7 height=200 interactive
Jared Rudnicki
I build software where design and AI meet.
```

## How it works

A few parts of the code were more interesting than I expected.

**Most demos are one function.** A pattern takes a cell's position and the current time and returns a brightness from 0 to 1. The grid calls it for every cell, every frame. If you've written a shader, it's the same idea at a much lower resolution. The simulations are the exception. They keep their own state and update it once per frame, before drawing the cells.

```js
// x: the cell's column
// y: the cell's row
// t: seconds since the field started, scaled by the Speed slider
// returns: brightness, from 0 (resting) to 1 (fully lit)
const pattern = (x, y, t) => brightness;
```

**Afterglow is two lines.** Each cell takes the brighter of two values: the pattern's brightness now, or its own brightness last frame after a small fade. The fade is raised to the power of the time since the last frame, so trails are the same length on a 60Hz laptop and a 120Hz phone:

```js
const keep = Math.pow(afterglow, dt * 60);
glow[k] = Math.max(pattern(x, y, t), glow[k] * keep);
```

**The glow is one CSS filter.** The footer draws each cell as a `<span>`, which is fine for about a hundred cells. A header-sized field has over a thousand, and this page has a dozen fields, so these draw to a `<canvas>`. The soft glow is a single `drop-shadow` filter on the whole canvas. Giving each cell its own canvas shadow would mean a thousand blurs every frame.

**Only what you can see is running.** Each field pauses as soon as it scrolls out of view, so only the one or two on screen are animating. Each field also caps how far time can advance in one frame, so after a long pause, like switching tabs, the simulations don't jump ahead.

**Reduced motion still shows something.** If you've turned on reduced motion, every field draws a single still frame. For the simulations, the field runs a few hundred steps before drawing that frame, so you see the process part-way through instead of its random start.

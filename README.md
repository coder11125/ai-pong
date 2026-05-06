# Retro Pong vs AI

A classic Pong game with a retro arcade aesthetic, playable in any modern browser. Face off against an AI opponent in a race to 7 points.

---

## Files

```
your-folder/
├── index.html   # Game canvas and layout
├── style.css    # Retro styling
├── game.js      # Game logic and AI
├── LICENSE      # License - MIT
└── README.md
```

---

## How to Play

1. Open `index.html` in any modern browser — no install or build step needed.
2. Press **Space** or **click** the canvas to start.
3. First to **7 points** wins.

---

## Controls

| Input | Action |
|---|---|
| Mouse | Move paddle |
| W / Arrow Up | Move paddle up |
| S / Arrow Down | Move paddle down |
| Space or Click | Start / Restart |

---

## Gameplay

- You control the **left paddle**, the AI controls the **right**.
- The ball speeds up slightly with each successful hit.
- Where the ball hits the paddle affects its bounce angle — hit with the edge to send it at a sharp angle.
- The AI is beatable — it reacts at a fixed speed and isn't perfect.

---

## Customisation

All tweakable constants are at the top of `game.js`:

| Constant | Default | Description |
|---|---|---|
| `WIN_SCORE` | `7` | Points needed to win |
| `aiSpeed` | `3.2` | AI paddle speed (higher = harder) |
| `PAD_H` | `70` | Paddle height in pixels |
| `BALL_SIZE` | `10` | Ball size in pixels |
| `GREEN` | `#33ff33` | Main accent color |

---

## Browser Support

Works in any modern browser that supports the HTML5 Canvas API (Chrome, Firefox, Safari, Edge).

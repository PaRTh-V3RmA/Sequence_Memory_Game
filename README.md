# 🧠 Sequence Memory Game

A stunning, standalone memory game that tests your sequential working memory! Challenge yourself with progressively difficult random color patterns across three grid modes. Features a modern glassmorphism UI design with smooth animations and an immersive multi-screen experience.

## 🎮 Features

### 🎯 Gameplay
- **3 Grid Modes**: Progressive upgrades from 2x2 (4 colors) → 3x3 (9 colors) → 4x4 (16 colors)
  - **Levels 1-3**: 2x2 grid with 4 colors
  - **Levels 4-7**: 3x3 grid with 9 colors and faster speed
  - **Levels 8+**: Ultimate 4x4 grid with 16 colors
- **Random Patterns**: Each level generates completely new random sequences
- **Progressive Length**: Sequence length increases with each level (Level 5 = 5 colors)
- **Speed Challenges**: Faster playback speeds as you advance
- **Audio Feedback**: Musical tones with extended frequencies for 16 colors

### 🎨 Modern UI Design
- **Multi-Screen Flow**: Home → How to Play → Countdown → Game
- **Glassmorphism Effects**: Backdrop blur and layered gradients
- **Premium Typography**: Poppins font with gradient text effects
- **Interactive Animations**: 
  - Hover effects on all interactive elements
  - Smooth color button animations with glow
  - Animated stat boxes
  - Pulse countdown animation
  - Ripple effect on button clicks
- **Smart Cursor States**: Changes based on game state
- **Optimized Layout**: Fits perfectly at 100% zoom with scroll support

### 📊 Score & Progress
- **Hidden Stats During Play**: Stats reveal only when game ends
- **High Score Tracking**: Best performance saved to localStorage
- **Real-time Level Display**: Current level, grid mode, and score on game over

### 🎬 User Experience
- **5-Second Countdown**: Dramatic countdown on first game start
- **Instant Replay**: Play Again starts immediately without countdown
- **Disabled Interactions**: No hover/click during pattern display
- **Visual Feedback**: Clear game state indicators
- **Fully Responsive**: Optimized for desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd SequenceMemoryGame-Standalone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the game:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   The game will automatically open at `http://localhost:3000`

## 🎯 How to Play

1. **Start**: Click "Next" on home screen to view instructions
2. **Learn**: Read the how-to-play guide
3. **Countdown**: Watch the 5-second countdown (5-4-3-2-1)
4. **Watch**: Observe the sequence of colors that light up
5. **Remember**: Memorize the completely random pattern
6. **Repeat**: Click the colors in the exact same sequence
7. **Progress**: Each level presents a new random sequence with one more color
8. **Upgrade**: 
   - Level 4: Grid upgrades to 3x3 with 9 colors and faster speed
   - Level 8: Ultimate 4x4 grid with 16 colors unlocks
9. **Compete**: Beat your high score and see your stats when you lose!

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

The build folder will contain the production-ready files that can be deployed to any static hosting service.

## 🛠️ Technologies Used

- **React 18**: Modern UI framework with hooks (useState, useEffect, useCallback)
- **Web Audio API**: For generating 16 unique musical tones
- **LocalStorage API**: For persistent high score tracking
- **CSS Variables**: For consistent theming and gradients
- **Google Fonts**: Poppins font family for premium typography
- **Modern CSS**: Backdrop filters, keyframe animations, cubic-bezier transitions
- **Glassmorphism**: Advanced UI design with blur effects and transparency

## 📁 Project Structure

```
SequenceMemoryGame-Standalone/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main game component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Customization

You can easily customize the game by modifying:

- **Colors**: Edit the `colors2x2`, `colors3x3`, and `colors4x4` arrays in `App.js`
- **Grid Sizes**: Adjust when grid upgrades occur (currently level 4 and level 8)
- **Timing**: Adjust `delayBefore` and `delayActive` in the `playSequence` function
- **Sounds**: Modify the 16-frequency `frequencies` array in the `playSound` function
- **Countdown**: Change countdown duration in `startCountdown` function
- **Theme**: Modify CSS variables in `index.css` for colors and gradients
- **Typography**: Change font imports in `public/index.html`
- **Animations**: Adjust keyframes in `index.css` (pulse, glow, shimmer)
- **Layout Sizes**: Modify style objects in `App.js` for different screen sizes

## 🐛 Troubleshooting

**Game won't start:**
- Make sure all dependencies are installed: `npm install`
- Check that port 3000 is not in use
- Clear browser cache and reload

**No sound:**
- Some browsers require user interaction before playing audio
- Check browser audio permissions
- Try clicking a color button manually first

**High score not saving:**
- Check browser's localStorage is enabled
- Make sure you're not in private/incognito mode
- Check browser console for errors

**Fonts not loading:**
- Ensure internet connection for Google Fonts
- Check `public/index.html` for correct font links

**Animations not smooth:**
- Update to latest browser version
- Check if hardware acceleration is enabled
- Reduce browser zoom if needed

**Layout issues:**
- Game is optimized for 100% zoom
- Try refreshing the page
- Clear browser cache

## 📝 License

This is a standalone copy of the Sequence Memory Game, created for educational and entertainment purposes.

## 🌟 Game Highlights

- 🎨 **Modern Design**: Glassmorphism UI with smooth animations
- 🎯 **Progressive Challenge**: From 4 to 16 colors across 3 grid modes
- 🔄 **Random Patterns**: Every level is a fresh challenge
- ⚡ **Speed Modes**: Faster sequences in advanced levels
- 🎵 **Musical Feedback**: 16 unique tones for immersive gameplay
- 🏆 **Score Tracking**: Beat your personal best
- 📱 **Responsive**: Perfect on all devices
- ⏱️ **Countdown Feature**: Dramatic start sequence

## 🎉 Enjoy!

Challenge yourself, train your memory, and see how high you can score! Can you reach the ultimate 4x4 grid? Good luck! 🚀

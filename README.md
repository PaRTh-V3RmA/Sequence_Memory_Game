# 🧠 Sequence Memory Game

A stunning, standalone memory game that tests your sequential working memory! Challenge yourself with progressively difficult random color patterns across multiple difficulty levels and grid modes. Features a modern glassmorphism UI design with smooth animations and an immersive multi-screen experience.

## 🎮 Features

### 🎯 Gameplay
- **4 Difficulty Levels**: Easy, Medium, Hard, and Hardest modes with unique challenges
- **5 Grid Modes**: Progressive upgrades from 2x2 (4 colors) → 3x3 (9 colors) → 4x4 (16 colors) → 5x5 (25 colors)
  - **Levels 1-3**: 2x2 grid with 4 colors
  - **Levels 4-7**: 3x3 grid with 9 colors
  - **Levels 8+**: 4x4 grid with 16 colors
  - **Advanced Levels**: 5x5 grid with 25 colors (unlocks based on difficulty)
    - Hardest: Unlocks at Level 11
    - Hard: Unlocks at Level 16
    - Easy/Medium: Unlocks at Level 18
- **Random Patterns**: Each level generates completely new random sequences
- **Progressive Length**: Sequence length increases with each level (Level 5 = 5 colors)
- **Dynamic Speed**: 
  - Easy & Medium: Speed increases progressively after level 10
  - Hard: Fast-paced gameplay (100ms)
  - Hardest: Ultra-fast gameplay (75ms)
- **Audio Feedback**: Musical tones with 25 unique frequencies for all colors
- **Mobile Optimized**: Touch-friendly with double-tap prevention

### 🎨 Modern UI Design
- **Multi-Screen Flow**: Home → How to Play → Difficulty Selection → Confirmation → Countdown → Game
- **Glassmorphism Effects**: Backdrop blur and layered gradients
- **Premium Typography**: Poppins & Inter fonts with gradient text effects
- **Interactive Animations**: 
  - Hover effects on all interactive elements
  - Smooth color button animations with glow
  - Animated stat boxes with hover states
  - Pulse countdown animation
  - Grid transition animations on upgrades
- **Smart Cursor States**: Changes based on game state
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📊 Score & Progress
- **Difficulty-Specific High Scores**: Each difficulty level tracks its own high score
- **Hidden Stats During Play**: Stats reveal only when game ends
- **Real-time Level Display**: Current level, grid mode, and score on game over
- **LocalStorage Persistence**: Your high scores are saved locally

## 🎚️ Difficulty Levels Explained

### 🟢 Easy Mode
- **Speed**: 400ms base, gradually increases after level 10
- **5x5 Grid**: Unlocks at Level 18
- **Best for**: Beginners and casual players
- **Challenge**: Learn the game mechanics with comfortable timing

### 🟡 Medium Mode
- **Speed**: 250ms base, gradually increases after level 10
- **5x5 Grid**: Unlocks at Level 18
- **Best for**: Players with some memory game experience
- **Challenge**: Balanced difficulty with moderate pace

### 🟠 Hard Mode
- **Speed**: Fixed 100ms (fast-paced)
- **5x5 Grid**: Unlocks at Level 16
- **Best for**: Experienced players seeking a challenge
- **Challenge**: Quick reactions and strong memory required

### 🔴 Hardest Mode
- **Speed**: Fixed 75ms (ultra-fast)
- **5x5 Grid**: Unlocks at Level 11 💀
- **Best for**: Memory game masters and speedrunners
- **Challenge**: Ultimate test of working memory under pressure

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd "Memory Website"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   The game will automatically open at `http://localhost:3000`

## 🎯 How to Play

1. **Start**: Click "Next" on home screen to view instructions
2. **Learn**: Read the comprehensive how-to-play guide
3. **Choose Difficulty**: Select from Easy, Medium, Hard, or Hardest
4. **Confirm**: Review your difficulty selection and confirm
5. **Countdown**: Watch the dramatic 5-second countdown (5-4-3-2-1)
6. **Watch**: Observe the sequence of colors that light up
7. **Remember**: Memorize the completely random pattern
8. **Repeat**: Click/tap the colors in the exact same sequence
9. **Progress**: Each level presents a new random sequence with one more color
10. **Upgrade**: Experience grid upgrades as you advance
    - Level 4: Grid upgrades to 3x3 with 9 colors 🎉
    - Level 8: Ultimate 4x4 grid with 16 colors 🔥
    - Advanced: 5x5 grid with 25 colors (difficulty-dependent) 💀
11. **Compete**: Beat your high score for each difficulty level!

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

The build folder will contain the production-ready files that can be deployed to any static hosting service.

### 🚀 Deployment

This project is configured for **Netlify** deployment:

```bash
# Build command: npm run build
# Publish directory: build
```

The `netlify.toml` configuration is already included for seamless deployment.

## 🛠️ Technologies Used

- **React 18.2.0**: Modern UI framework with hooks (useState, useEffect, useCallback, useRef)
- **Web Audio API**: For generating 25 unique musical tones with dynamic durations
- **LocalStorage API**: For persistent high score tracking per difficulty level
- **CSS Variables**: For consistent theming and gradient effects
- **Google Fonts**: Poppins & Inter font families for premium typography
- **Modern CSS**: Backdrop filters, keyframe animations, cubic-bezier transitions
- **Glassmorphism**: Advanced UI design with blur effects and transparency
- **React Scripts 5.0.1**: Build tooling and development server
- **Responsive Design**: Mobile-first approach with touch event handling

## 📁 Project Structure

```
Memory Website/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main game component (~1070+ lines)
│   ├── index.js            # React entry point
│   └── index.css           # Global styles with CSS variables
├── netlify.toml            # Netlify deployment configuration
├── package.json            # Dependencies and scripts
├── package-lock.json       # Locked dependency versions
└── README.md               # This file
```

## 🎨 Customization

You can easily customize the game by modifying:

- **Colors**: Edit the `colors2x2`, `colors3x3`, `colors4x4`, and `colors5x5` arrays in `App.js`
- **Grid Sizes**: Adjust the `getGridLevel()` function to change when grid upgrades occur
- **Difficulty Timing**: Modify speed calculations in the `playSequence` function:
  - Easy: Base speed 400ms, reduces after level 10
  - Medium: Base speed 250ms, reduces after level 10
  - Hard: Fixed 100ms
  - Hardest: Fixed 75ms
- **Sounds**: Modify the 25-frequency `frequencies` array in the `playSound` function
- **Countdown**: Change countdown duration (default: 5 seconds)
- **Theme**: Modify CSS variables in `index.css` for colors and gradients
- **Typography**: Poppins and Inter fonts are used throughout
- **Animations**: Adjust transition timings and cubic-bezier values in style objects
- **Layout Sizes**: Modify responsive breakpoints and button sizes in the styles object
- **5x5 Unlock Levels**: Adjust unlock thresholds in `getGridLevel()` function

## 🐛 Troubleshooting

**Game won't start:**
- Make sure all dependencies are installed: `npm install`
- Check that port 3000 is not in use
- Clear browser cache and reload
- Ensure Node.js version 14 or higher is installed

**No sound:**
- Some browsers require user interaction before playing audio
- Check browser audio permissions
- The Web Audio API may be suspended on iOS - tap any button to activate
- Try clicking a color button manually first

**High score not saving:**
- Check browser's localStorage is enabled
- Make sure you're not in private/incognito mode
- Each difficulty level has its own high score
- Check browser console for errors

**Fonts not loading:**
- Ensure internet connection for Google Fonts
- Check browser console for font loading errors
- Fonts should load automatically from CDN

**Animations not smooth:**
- Update to latest browser version
- Check if hardware acceleration is enabled
- Close other resource-intensive applications
- The game is optimized with `willChange` and `backfaceVisibility`

**Layout issues on mobile:**
- Game is fully responsive with mobile-specific sizing
- Rotate device for best experience on small screens
- Double-tap is prevented to avoid accidental clicks

**Touch events not working:**
- The game uses both touch and click events
- If issues persist, refresh the page
- Some browsers may require specific touch event permissions

## 📝 License

This is a standalone copy of the Sequence Memory Game, created for educational and entertainment purposes.

## 🌟 Game Highlights

- 🎨 **Modern Design**: Glassmorphism UI with smooth animations and gradient effects
- 🎯 **4 Difficulty Levels**: Easy, Medium, Hard, and Hardest with unique speed challenges
- 🌈 **Progressive Challenge**: From 4 colors (2x2) to 25 colors (5x5) across 5 grid modes
- 🔄 **Random Patterns**: Every level generates a completely new sequence
- ⚡ **Dynamic Speed**: Adaptive timing based on difficulty and level progression
- 🎵 **Musical Feedback**: 25 unique tones synchronized with visual effects
- 🏆 **Score Tracking**: Separate high scores for each difficulty level
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile with touch support
- ⏱️ **Countdown Feature**: Dramatic 5-second countdown on game start
- 🎮 **Grid Upgrades**: Experience exciting transitions at levels 4, 8, and beyond
- 💾 **LocalStorage**: Your progress is automatically saved
- 🎭 **Multi-Screen Flow**: Immersive experience from home to gameplay

## 🎉 Enjoy!

Challenge yourself, train your memory, and see how high you can score! Can you reach the legendary 5x5 grid with 25 colors? Choose your difficulty and push your limits! 🚀

---

**Made with ❤️ using React** | Test your working memory and have fun! 🧠✨

**Game Link**: https://sequence-colour-memory-game.netlify.app/

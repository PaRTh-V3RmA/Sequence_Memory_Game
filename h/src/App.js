import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

const SequenceMemoryGame = () => {
  // Game states
  const [gameState, setGameState] = useState('home'); // 'home', 'howtoplay', 'difficulty', 'difficultyconfirm', 'countdown', 'showing', 'playing', 'gameover'
  const [difficulty, setDifficulty] = useState(''); // 'easy', 'medium', 'hard', 'hardest' - no default selection
  const [countdown, setCountdown] = useState(5);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [gridTransition, setGridTransition] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [message, setMessage] = useState('');
  const [isInstructionsHovered, setIsInstructionsHovered] = useState(false);
  const [hoveredStatBox, setHoveredStatBox] = useState(null);
  const [hoveredColorButton, setHoveredColorButton] = useState(null);
  
  // Ref to track touch events and prevent double-firing
  const lastTouchTime = useRef(0);
  
  // Audio context ref - reuse single instance for mobile compatibility
  const audioContextRef = useRef(null);

  // Color buttons - 2x2 grid (levels 1-3)
  const colors2x2 = [
    { id: 0, name: 'red', color: '#ff6b6b', activeColor: '#ff4444' },
    { id: 1, name: 'blue', color: '#4dabf7', activeColor: '#339af0' },
    { id: 2, name: 'green', color: '#51cf66', activeColor: '#37b24d' },
    { id: 3, name: 'yellow', color: '#ffd43b', activeColor: '#fcc419' }
  ];

  // Color buttons - 3x3 grid (levels 4-7)
  const colors3x3 = [
    { id: 0, name: 'red', color: '#ff6b6b', activeColor: '#ff4444' },
    { id: 1, name: 'blue', color: '#4dabf7', activeColor: '#339af0' },
    { id: 2, name: 'green', color: '#51cf66', activeColor: '#37b24d' },
    { id: 3, name: 'yellow', color: '#ffd43b', activeColor: '#fcc419' },
    { id: 4, name: 'purple', color: '#cc5de8', activeColor: '#9c36b5' },
    { id: 5, name: 'orange', color: '#ff922b', activeColor: '#fd7e14' },
    { id: 6, name: 'pink', color: '#f783ac', activeColor: '#e64980' },
    { id: 7, name: 'cyan', color: '#22b8cf', activeColor: '#15aabf' },
    { id: 8, name: 'lime', color: '#94d82d', activeColor: '#82c91e' }
  ];

  // Color buttons - 4x4 grid (levels 8+)
  const colors4x4 = [
    { id: 0, name: 'red', color: '#ff6b6b', activeColor: '#ff4444' },
    { id: 1, name: 'blue', color: '#4dabf7', activeColor: '#339af0' },
    { id: 2, name: 'green', color: '#51cf66', activeColor: '#37b24d' },
    { id: 3, name: 'yellow', color: '#ffd43b', activeColor: '#fcc419' },
    { id: 4, name: 'purple', color: '#cc5de8', activeColor: '#9c36b5' },
    { id: 5, name: 'orange', color: '#ff922b', activeColor: '#fd7e14' },
    { id: 6, name: 'pink', color: '#f783ac', activeColor: '#e64980' },
    { id: 7, name: 'cyan', color: '#22b8cf', activeColor: '#15aabf' },
    { id: 8, name: 'lime', color: '#94d82d', activeColor: '#82c91e' },
    { id: 9, name: 'indigo', color: '#7950f2', activeColor: '#5f3dc4' },
    { id: 10, name: 'teal', color: '#20c997', activeColor: '#12b886' },
    { id: 11, name: 'coral', color: '#ff8787', activeColor: '#ff6b6b' },
    { id: 12, name: 'violet', color: '#da77f2', activeColor: '#be4bdb' },
    { id: 13, name: 'amber', color: '#fab005', activeColor: '#f59f00' },
    { id: 14, name: 'sky', color: '#74c0fc', activeColor: '#4dabf7' },
    { id: 15, name: 'mint', color: '#63e6be', activeColor: '#38d9a9' }
  ];

  // Color buttons - 5x5 grid (advanced levels)
  const colors5x5 = [
    { id: 0, name: 'red', color: '#ff6b6b', activeColor: '#ff4444' },
    { id: 1, name: 'blue', color: '#4dabf7', activeColor: '#339af0' },
    { id: 2, name: 'green', color: '#51cf66', activeColor: '#37b24d' },
    { id: 3, name: 'yellow', color: '#ffd43b', activeColor: '#fcc419' },
    { id: 4, name: 'purple', color: '#cc5de8', activeColor: '#9c36b5' },
    { id: 5, name: 'orange', color: '#ff922b', activeColor: '#fd7e14' },
    { id: 6, name: 'pink', color: '#f783ac', activeColor: '#e64980' },
    { id: 7, name: 'cyan', color: '#22b8cf', activeColor: '#15aabf' },
    { id: 8, name: 'lime', color: '#94d82d', activeColor: '#82c91e' },
    { id: 9, name: 'indigo', color: '#7950f2', activeColor: '#5f3dc4' },
    { id: 10, name: 'teal', color: '#20c997', activeColor: '#12b886' },
    { id: 11, name: 'coral', color: '#ff8787', activeColor: '#ff6b6b' },
    { id: 12, name: 'violet', color: '#da77f2', activeColor: '#be4bdb' },
    { id: 13, name: 'amber', color: '#fab005', activeColor: '#f59f00' },
    { id: 14, name: 'sky', color: '#74c0fc', activeColor: '#4dabf7' },
    { id: 15, name: 'mint', color: '#63e6be', activeColor: '#38d9a9' },
    { id: 16, name: 'rose', color: '#faa2c1', activeColor: '#f06595' },
    { id: 17, name: 'crimson', color: '#fa5252', activeColor: '#e03131' },
    { id: 18, name: 'gold', color: '#ffd700', activeColor: '#ffc107' },
    { id: 19, name: 'aqua', color: '#3bc9db', activeColor: '#1098ad' },
    { id: 20, name: 'lavender', color: '#b197fc', activeColor: '#9775fa' },
    { id: 21, name: 'peach', color: '#ffc9a8', activeColor: '#ffa94d' },
    { id: 22, name: 'sage', color: '#8ce99a', activeColor: '#69db7c' },
    { id: 23, name: 'navy', color: '#5c7cfa', activeColor: '#4c6ef5' },
    { id: 24, name: 'maroon', color: '#e599f7', activeColor: '#d6336c' }
  ];

  // Difficulty-based grid progression
  const getGridLevel = (level, difficulty) => {
    if (difficulty === 'hardest' && level > 10) return 5;
    if (difficulty === 'hard' && level > 15) return 5;
    if ((difficulty === 'medium' || difficulty === 'easy') && level > 17) return 5;
    if (level > 7) return 4;
    if (level > 3) return 3;
    return 2;
  };

  const gridSize = getGridLevel(currentLevel, difficulty);
  const colors = gridSize === 5 ? colors5x5 : (gridSize === 4 ? colors4x4 : (gridSize === 3 ? colors3x3 : colors2x2));

  // Load high score from localStorage (per difficulty)
  useEffect(() => {
    const savedHighScore = localStorage.getItem(`sequenceMemoryHighScore_${difficulty}`);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    } else {
      setHighScore(0);
    }
  }, [difficulty]);

  // Play the sequence
  const playSequence = useCallback(async (seq, level) => {
    setIsPlayingSequence(true);
    setGameState('showing');
    setMessage('Watch the pattern...');

    // Calculate dynamic speed for easy and medium based on level
    const calculateSpeed = (baseSpeed, level) => {
      if (level <= 10) return baseSpeed;
      
      // Drop 50ms every 5 levels after level 10
      const levelsAfter10 = level - 10;
      const speedReductions = Math.floor(levelsAfter10 / 5) + 1; // +1 for immediate drop at level 10
      const reducedSpeed = baseSpeed - (speedReductions * 50);
      
      // Don't go below 125ms
      return Math.max(reducedSpeed, 125);
    };

    // Difficulty-based timing (speed only, not grid)
    let delayBefore, delayActive;
    
    if (difficulty === 'easy') {
      const speed = calculateSpeed(400, level);
      delayBefore = speed / 2;
      delayActive = speed;
    } else if (difficulty === 'medium') {
      const speed = calculateSpeed(250, level);
      delayBefore = speed / 2;
      delayActive = speed;
    } else if (difficulty === 'hard') {
      delayBefore = 50;
      delayActive = 100;
    } else { // hardest
      delayBefore = 37;
      delayActive = 75;
    }

    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delayBefore));
      setActiveColor(seq[i]);
      playSound(seq[i], delayActive); // Pass duration to sync audio
      await new Promise(resolve => setTimeout(resolve, delayActive));
      setActiveColor(null);
    }

    setIsPlayingSequence(false);
    setGameState('playing');
    setMessage('Your turn! Repeat the pattern');
  }, [difficulty]);

  // Play sound for color
  const playSound = (colorId, duration = 300) => {
    try {
      // Create or reuse AudioContext (mobile-friendly)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      // Resume context if suspended (iOS requirement)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Extended frequencies for 25 colors
      const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760.00, 1975.53, 2093.00, 2349.32, 2637.02, 2793.83];
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequencies[colorId] || frequencies[0];
      oscillator.type = 'sine';
      
      // Convert duration to seconds and sync audio with visual
      const durationInSeconds = duration / 1000;
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + durationInSeconds);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + durationInSeconds);
      
      // Clean up oscillator after it's done
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.log('Audio not available:', error);
    }
  };

  // Navigate to how to play
  const goToHowToPlay = () => {
    setGameState('howtoplay');
  };

  // Navigate to difficulty selection
  const goToDifficultySelect = () => {
    setGameState('difficulty');
  };

  // Select difficulty and show confirmation
  const selectDifficulty = (selectedDifficulty, event) => {
    // Prevent double-firing on mobile
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      
      const now = Date.now();
      if (event.type === 'touchstart') {
        lastTouchTime.current = now;
      } else if (event.type === 'click') {
        if (now - lastTouchTime.current < 500) {
          return;
        }
      }
    }
    
    setDifficulty(selectedDifficulty);
    setGameState('difficultyconfirm');
  };

  // Start countdown after difficulty confirmation
  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(5);
  };

// Start game
const startGame = useCallback(() => {
  setSequence([]);
  setPlayerSequence([]);
  setCurrentLevel(1);
  setActiveColor(null);
  setIsPlayingSequence(false);
  setGameState('showing');
  setMessage('Get ready...');

  setTimeout(() => {
    const firstColor = Math.floor(Math.random() * 4); // Level 1 uses 2x2 grid
    const newSequence = [firstColor];
    setSequence(newSequence);
    playSequence(newSequence, 1);
  }, 1000); // 1 second delay before pattern starts
}, [playSequence]); // include playSequence if it's defined elsewhere

// Countdown effect
useEffect(() => {
  if (gameState === 'countdown' && countdown > 0) {
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  } else if (gameState === 'countdown' && countdown === 0) {
    startGame();
  }
}, [gameState, countdown, startGame]);


  // Handle color click
  const handleColorClick = (colorId, event) => {
    if (gameState !== 'playing' || isPlayingSequence) return;

    // Prevent default and stop propagation to avoid double-firing on touch devices
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      
      // Track touch events and prevent duplicate click events on mobile
      const now = Date.now();
      if (event.type === 'touchstart') {
        lastTouchTime.current = now;
      } else if (event.type === 'click') {
        // If a touch event happened within 500ms, ignore this click
        if (now - lastTouchTime.current < 500) {
          return;
        }
      }
    }

    setActiveColor(colorId);
    playSound(colorId, 150); // Match sound duration with visual flash
    setTimeout(() => setActiveColor(null), 150);

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    // Check if correct
    const currentIndex = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong!
      gameOver();
      return;
    }

    // Check if sequence complete
    if (newPlayerSequence.length === sequence.length) {
      // Correct! Next level
      setTimeout(() => {
        nextLevel();
      }, 300);
    }
  };

  // Next level
  const nextLevel = () => {
    const newLevel = currentLevel + 1;
    const oldGridSize = getGridLevel(currentLevel, difficulty);
    const newGridSize = getGridLevel(newLevel, difficulty);
    const isGridUpgrade = newGridSize > oldGridSize;
    
    setPlayerSequence([]);
    
    // Smooth grid transition animation
    if (isGridUpgrade) {
      setGridTransition(true);
      setTimeout(() => {
        setCurrentLevel(newLevel);
        setGridTransition(false);
      }, 300);
    } else {
      setCurrentLevel(newLevel);
    }
    
    // Special messages for grid upgrades
    let gridMessage = `Level ${newLevel}! Great job!`;
    if (newLevel === 4) {
      gridMessage = `Level ${newLevel}! 🎉 GRID UPGRADED TO 3x3! Get ready for more colors!`;
    } else if (newLevel === 8) {
      gridMessage = `Level ${newLevel}! 🔥 GRID UPGRADED TO 4x4! Maximum challenge!`;
    } else if (difficulty === 'hardest' && newLevel === 11) {
      gridMessage = `Level ${newLevel}! 💀 INSANE MODE: 5x5 GRID! 25 colors!`;
    } else if (difficulty === 'hard' && newLevel === 16) {
      gridMessage = `Level ${newLevel}! 🌟 MASTERY LEVEL: 5x5 GRID! 25 colors!`;
    } else if ((difficulty === 'medium' || difficulty === 'easy') && newLevel === 18) {
      gridMessage = `Level ${newLevel}! 👑 LEGENDARY: 5x5 GRID! 25 colors!`;
    }
    setMessage(gridMessage);
    
    setTimeout(() => {
      // Calculate max colors based on grid size
      const maxColors = newGridSize === 5 ? 25 : (newGridSize === 4 ? 16 : (newGridSize === 3 ? 9 : 4));
      // Generate a completely new random sequence with length equal to newLevel
      const newSequence = Array.from({ length: newLevel }, () => 
        Math.floor(Math.random() * maxColors)
      );
      setSequence(newSequence);
      playSequence(newSequence, newLevel);
    }, isGridUpgrade ? 1500 : 800);
  };

  // Game over
  const gameOver = () => {
    setGameState('gameover');
    setMessage(`Game Over! You reached level ${currentLevel}`);
    
    // Update high score (per difficulty)
    const finalLevel = currentLevel;
    if (finalLevel > highScore) {
      setHighScore(finalLevel);
      localStorage.setItem(`sequenceMemoryHighScore_${difficulty}`, finalLevel.toString());
      setMessage(`Game Over! New High Score: Level ${finalLevel}! 🎉`);
    }
  };

  // Check if mobile
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'var(--background)',
      padding: isMobile ? '10px' : '15px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'auto'
    },
    header: {
      textAlign: 'center',
      marginTop: '15px',
      marginBottom: '20px',
      zIndex: 10
    },
    title: {
      fontSize: isSmallMobile ? '28px' : (isMobile ? '32px' : '40px'),
      fontWeight: '900',
      color: 'var(--accent)',
      background: 'linear-gradient(135deg, #ff8a00 0%, #ffc86b 50%, #ff6b35 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      MozBackgroundClip: 'text',
      MozTextFillColor: 'transparent',
      marginBottom: '8px',
      display: 'inline-block',
      fontFamily: '\'Poppins\', sans-serif',
      letterSpacing: '-1px',
      textShadow: '0 0 80px rgba(255, 138, 0, 0.3)',
      filter: 'drop-shadow(0 4px 20px rgba(255, 138, 0, 0.4))'
    },
    subtitle: {
      fontSize: '14px',
      color: 'var(--muted)',
      marginBottom: '15px',
      fontWeight: '500',
      letterSpacing: '0.5px',
      opacity: 0.9
    },
    statsContainer: {
      display: 'flex',
      gap: '20px',
      marginBottom: '15px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    statBox: {
      backgroundColor: 'var(--surface)',
      padding: '15px 30px',
      borderRadius: '15px',
      border: '2px solid rgba(255, 138, 0, 0.25)',
      textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(23, 19, 22, 0.9) 0%, rgba(23, 19, 22, 0.7) 100%)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 138, 0, 0.1) inset',
      transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease-out, border 0.2s ease-out, background 0.2s ease-out',
      cursor: 'default',
      willChange: 'transform',
      backfaceVisibility: 'hidden'
    },
    statLabel: {
      fontSize: '10px',
      color: 'var(--muted)',
      marginBottom: '5px',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      fontWeight: '600',
      opacity: 0.8
    },
    statValue: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, var(--text) 0%, var(--accent-2) 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontFamily: '\'Poppins\', sans-serif',
      letterSpacing: '-1px'
    },
    gameArea: {
      background: 'linear-gradient(135deg, rgba(23, 19, 22, 0.95) 0%, rgba(23, 19, 22, 0.85) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: isMobile ? '15px' : '25px',
      padding: isSmallMobile ? '20px 15px' : (isMobile ? '30px 20px' : '40px'),
      border: '2px solid rgba(255, 138, 0, 0.3)',
      boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255, 138, 0, 0.1) inset, 0 0 100px rgba(255, 138, 0, 0.1)',
      position: 'relative',
      zIndex: 10,
      maxWidth: isMobile ? '100%' : '700px',
      width: '100%'
    },
    message: {
      fontSize: '20px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, var(--text) 0%, var(--accent-2) 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textAlign: 'center',
      marginBottom: '25px',
      minHeight: '24px',
      fontFamily: '\'Poppins\', sans-serif',
      letterSpacing: '-0.3px',
      filter: 'drop-shadow(0 2px 8px rgba(255, 138, 0, 0.2))'
    },
    colorButton: {
      width: isSmallMobile 
        ? (gridSize === 5 ? '55px' : (gridSize === 4 ? '65px' : (gridSize === 3 ? '75px' : '85px')))
        : isMobile
        ? (gridSize === 5 ? '65px' : (gridSize === 4 ? '80px' : (gridSize === 3 ? '95px' : '110px')))
        : (gridSize === 5 ? '80px' : (gridSize === 4 ? '100px' : (gridSize === 3 ? '120px' : '150px'))),
      height: isSmallMobile 
        ? (gridSize === 5 ? '55px' : (gridSize === 4 ? '65px' : (gridSize === 3 ? '75px' : '85px')))
        : isMobile
        ? (gridSize === 5 ? '65px' : (gridSize === 4 ? '80px' : (gridSize === 3 ? '95px' : '110px')))
        : (gridSize === 5 ? '80px' : (gridSize === 4 ? '100px' : (gridSize === 3 ? '120px' : '150px'))),
      borderRadius: gridSize === 5 ? '12px' : (isMobile ? '16px' : '24px'),
      border: isMobile ? '2px solid rgba(255, 255, 255, 0.1)' : '3px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.15s ease-out, box-shadow 0.15s ease-out, opacity 0.5s ease, background-color 0.15s ease-out',
      boxShadow: '0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
      position: 'relative',
      overflow: 'hidden',
      opacity: gridTransition ? 0 : 1,
      transform: gridTransition ? 'scale(0.8)' : 'scale(1)',
      willChange: 'transform, filter',
      backfaceVisibility: 'hidden',
      WebkitFontSmoothing: 'antialiased'
    },
    colorButtonActive: {
      transform: 'scale(0.92)',
      filter: 'brightness(1.6) saturate(1.3)',
      boxShadow: '0 0 50px rgba(255,255,255,0.8), 0 0 100px currentColor, 0 5px 20px rgba(0,0,0,0.5)',
      border: '3px solid rgba(255, 255, 255, 0.4)'
    },
    buttonContainer: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center'
    },
    startButton: {
      padding: '14px 40px',
      fontSize: '18px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #ff8a00 0%, #ffc86b 100%)',
      color: '#0f0e10',
      border: '2px solid rgba(255, 200, 107, 0.3)',
      borderRadius: '15px',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 8px 25px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset',
      fontFamily: '\'Poppins\', sans-serif',
      letterSpacing: '0.5px',
      textTransform: 'uppercase'
    },
    actionButton: {
      padding: isSmallMobile ? '12px 32px' : (isMobile ? '14px 40px' : '16px 48px'),
      fontSize: isSmallMobile ? '14px' : (isMobile ? '16px' : '18px'),
      fontWeight: '800',
      background: 'linear-gradient(135deg, #ff8a00 0%, #ffc86b 100%)',
      color: '#0f0e10',
      border: '2px solid rgba(255, 200, 107, 0.3)',
      borderRadius: '15px',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 8px 25px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset',
      fontFamily: '\'Poppins\', sans-serif',
      letterSpacing: '0.8px',
      textTransform: 'uppercase',
      minWidth: isSmallMobile ? '140px' : (isMobile ? '160px' : '180px')
    },
    actionButtonSecondary: {
      padding: isSmallMobile ? '12px 32px' : (isMobile ? '14px 40px' : '16px 48px'),
      fontSize: isSmallMobile ? '14px' : (isMobile ? '16px' : '18px'),
      fontWeight: '800',
      background: 'linear-gradient(135deg, rgba(45, 55, 72, 0.9) 0%, rgba(26, 32, 44, 0.9) 100%)',
      color: '#ffffff',
      border: '2px solid rgba(255, 200, 107, 0.3)',
      borderRadius: '15px',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset',
      fontFamily: '\'Poppins\', sans-serif',
      letterSpacing: '0.8px',
      textTransform: 'uppercase',
      minWidth: isSmallMobile ? '140px' : (isMobile ? '160px' : '180px')
    },
    instructions: {
      backgroundColor: 'rgba(255, 138, 0, 0.1)',
      padding: '30px 35px',
      borderRadius: '20px',
      border: '2px solid rgba(255, 138, 0, 0.3)',
      maxWidth: '550px',
      textAlign: 'center',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'default',
      boxShadow: '0 10px 30px rgba(255, 138, 0, 0.15), inset 0 1px 0 rgba(255, 200, 107, 0.2)'
    },
    instructionTitle: {
      fontSize: '28px',
      fontWeight: '800',
      color: 'var(--text)',
      marginBottom: '20px',
      letterSpacing: '-0.5px',
      fontFamily: '\'Poppins\', \'Inter\', sans-serif',
      background: 'linear-gradient(135deg, var(--text) 0%, var(--accent-2) 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    instructionText: {
      fontSize: '14px',
      color: 'var(--muted)',
      lineHeight: '1.7',
      marginBottom: '12px',
      textAlign: 'left',
      fontWeight: '500',
      fontFamily: '\'Inter\', sans-serif',
      letterSpacing: '0.3px'
    },
    instructionsHover: {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 20px 50px rgba(255, 138, 0, 0.3), 0 0 80px rgba(255, 200, 107, 0.15), inset 0 2px 0 rgba(255, 200, 107, 0.3)',
      border: '2px solid rgba(255, 138, 0, 0.5)',
      backgroundColor: 'rgba(255, 138, 0, 0.15)'
    },
    statBoxHover: {
      transform: 'translateY(-2px) scale(1.02)',
      border: '2px solid rgba(255, 138, 0, 0.5)',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 138, 0, 0.2), 0 0 0 1px rgba(255, 138, 0, 0.2) inset',
      background: 'linear-gradient(135deg, rgba(23, 19, 22, 1) 0%, rgba(23, 19, 22, 0.85) 100%)'
    },
    colorButtonHover: {
      transform: 'translateY(-2px) scale(1.02)',
      filter: 'brightness(1.12) saturate(1.08)',
      boxShadow: '0 12px 35px rgba(0,0,0,0.5), 0 0 25px currentColor, 0 0 0 2px rgba(255, 255, 255, 0.2) inset'
    },
    homeScreen: {
      textAlign: 'center',
      maxWidth: '700px',
      margin: '0 auto'
    },
    homeTitle: {
      fontSize: '48px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #ff8a00 0%, #ffc86b 50%, #ff6b35 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '20px',
      fontFamily: '\'Poppins\', sans-serif',
      letterSpacing: '-2px',
      filter: 'drop-shadow(0 4px 30px rgba(255, 138, 0, 0.5))'
    },
    homeDescription: {
      fontSize: '16px',
      color: 'var(--muted)',
      lineHeight: '1.6',
      marginBottom: '15px',
      fontWeight: '500',
      letterSpacing: '0.3px'
    },
    nextButton: {
      padding: '14px 50px',
      fontSize: '18px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #ff8a00 0%, #ffc86b 100%)',
      color: '#0f0e10',
      border: '2px solid rgba(255, 200, 107, 0.3)',
      borderRadius: '15px',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 8px 25px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset',
      fontFamily: '\'Poppins\', sans-serif',
      letterSpacing: '0.5px',
      marginTop: '25px'
    },
    countdownScreen: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px'
    },
    countdownNumber: {
      fontSize: '120px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #ff8a00 0%, #ffc86b 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontFamily: '\'Poppins\', sans-serif',
      animation: 'pulse 1s ease-in-out',
      filter: 'drop-shadow(0 10px 50px rgba(255, 138, 0, 0.6))'
    },
    countdownText: {
      fontSize: '22px',
      color: 'var(--muted)',
      marginTop: '15px',
      fontWeight: '600',
      letterSpacing: '1px'
    },
    howToPlayContainer: {
      maxWidth: '550px',
      margin: '0 auto',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      {/* Show title during gameplay, stats only on game over */}
      {(gameState === 'showing' || gameState === 'playing' || gameState === 'gameover') && (
        <div style={styles.header}>
          <h1 style={styles.title}>🧠 Sequence Memory</h1>
          <p style={styles.subtitle}>Test your sequential working memory!</p>
          
          {/* Only show stats when game is over */}
          {gameState === 'gameover' && (
            <div style={styles.statsContainer}>
          <div 
            style={{
              ...styles.statBox,
              ...(hoveredStatBox === 'level' ? styles.statBoxHover : {})
            }}
            onMouseEnter={() => setHoveredStatBox('level')}
            onMouseLeave={() => setHoveredStatBox(null)}
          >
            <div style={styles.statLabel}>Current Level</div>
            <div style={styles.statValue}>{currentLevel}</div>
          </div>
          <div 
            style={{
              ...styles.statBox,
              ...(hoveredStatBox === 'grid' ? styles.statBoxHover : {})
            }}
            onMouseEnter={() => setHoveredStatBox('grid')}
            onMouseLeave={() => setHoveredStatBox(null)}
          >
            <div style={styles.statLabel}>Grid Mode</div>
            <div style={styles.statValue}>{gridSize}x{gridSize}</div>
            {currentLevel > 7 && <div style={{fontSize: '14px', color: 'var(--accent)', marginTop: '5px', fontWeight: '700'}}>🔥 Ultimate</div>}
            {currentLevel > 3 && currentLevel <= 7 && <div style={{fontSize: '14px', color: 'var(--accent)', marginTop: '5px', fontWeight: '700'}}>⚡ Speed Mode</div>}
          </div>
          <div 
            style={{
              ...styles.statBox,
              ...(hoveredStatBox === 'high' ? styles.statBoxHover : {})
            }}
            onMouseEnter={() => setHoveredStatBox('high')}
            onMouseLeave={() => setHoveredStatBox(null)}
          >
            <div style={styles.statLabel}>High Score</div>
            <div style={styles.statValue}>{highScore}</div>
          </div>
        </div>
          )}
        </div>
      )}

      {/* Home Screen */}
      {gameState === 'home' && (
        <div style={styles.gameArea}>
          <div style={styles.homeScreen}>
            <h1 style={styles.homeTitle}>🧠 Sequence Memory</h1>
            <p style={styles.homeDescription}>
              Challenge your brain with this addictive memory game! Watch patterns of colors light up, then repeat them in the correct order.
            </p>
            <p style={styles.homeDescription}>
              Choose your difficulty level and watch as sequences grow longer with each level. Can you master all grid modes and reach the ultimate 4x4 challenge?
            </p>
            <p style={styles.homeDescription}>
              Test your limits, train your memory, and compete for the highest score!
            </p>
            <button 
              style={styles.nextButton}
              onClick={goToHowToPlay}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.03)';
                e.target.style.boxShadow = '0 10px 35px rgba(255, 138, 0, 0.5), 0 0 60px rgba(255, 200, 107, 0.3), 0 0 0 2px rgba(255, 200, 107, 0.3) inset';
                e.target.style.filter = 'brightness(1.08)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset';
                e.target.style.filter = 'brightness(1)';
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* How to Play Screen */}
      {gameState === 'howtoplay' && (
        <div style={styles.howToPlayContainer}>
          <div 
            style={{
              ...styles.instructions,
              ...(isInstructionsHovered ? styles.instructionsHover : {})
            }}
            onMouseEnter={() => setIsInstructionsHovered(true)}
            onMouseLeave={() => setIsInstructionsHovered(false)}
          >
            <h2 style={styles.instructionTitle}>How to Play</h2>
            <p style={styles.instructionText}>
              • Watch the sequence of colors light up
            </p>
            <p style={styles.instructionText}>
              • Repeat the pattern by clicking the colors in the same order
            </p>
            <p style={styles.instructionText}>
              • Each level adds one more color to remember
            </p>
            <p style={styles.instructionText}>
              • 🎯 <strong>Level 4:</strong> Grid upgrades to 3x3 with 9 colors!
            </p>
            <p style={styles.instructionText}>
              • 🔥 <strong>Level 8:</strong> Ultimate 4x4 grid with 16 colors!
            </p>
            <p style={styles.instructionText}>
              • 💀 <strong>Advanced levels:</strong> 5x5 grid unlocks based on difficulty!
            </p>
            <p style={styles.instructionText}>
              • How far can you go?
            </p>
            <button 
              style={styles.startButton}
              onClick={goToDifficultySelect}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.03)';
                e.target.style.boxShadow = '0 10px 35px rgba(255, 138, 0, 0.5), 0 0 60px rgba(255, 200, 107, 0.3), 0 0 0 2px rgba(255, 200, 107, 0.3) inset';
                e.target.style.filter = 'brightness(1.08)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset';
                e.target.style.filter = 'brightness(1)';
              }}
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Difficulty Selection Screen */}
      {gameState === 'difficulty' && (
        <div style={{...styles.gameArea, padding: '30px 40px', maxWidth: '600px'}}>
          <div style={styles.homeScreen}>
            <h2 style={{...styles.homeTitle, fontSize: '28px', marginBottom: '15px', letterSpacing: '0px'}}>⚡ Select Difficulty</h2>
            <p style={{...styles.homeDescription, marginBottom: '25px', fontSize: '14px'}}>
              Choose your challenge - affects pattern speed only!
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px',
              width: '100%',
              maxWidth: '500px'
            }}>
              {[
                { level: 'easy', emoji: '😊', title: 'Easy', desc: '400ms - Slow & steady', gradient: 'linear-gradient(135deg, #3d5a80 0%, #293241 100%)' },
                { level: 'medium', emoji: '🎯', title: 'Medium', desc: '250ms - Balanced', gradient: 'linear-gradient(135deg, #3d5a80 0%, #293241 100%)' },
                { level: 'hard', emoji: '🔥', title: 'Hard', desc: '100ms - Fast reflexes', gradient: 'linear-gradient(135deg, #3d5a80 0%, #293241 100%)' },
                { level: 'hardest', emoji: '💀', title: 'Insane', desc: '75ms - Lightning!', gradient: 'linear-gradient(135deg, #5a3d3d 0%, #2d1f1f 100%)' }
              ].map((diff) => (
                <button
                  key={diff.level}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px 20px',
                    background: difficulty === diff.level 
                      ? 'linear-gradient(135deg, rgba(255, 138, 0, 0.25) 0%, rgba(255, 108, 53, 0.25) 100%)' 
                      : diff.gradient,
                    border: difficulty === diff.level ? '3px solid #ffa726' : '2px solid rgba(100, 120, 140, 0.4)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#ffffff',
                    boxShadow: difficulty === diff.level 
                      ? '0 8px 30px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset'
                      : '0 6px 20px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.05) inset',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                    minHeight: '105px',
                    backdropFilter: 'blur(10px)'
                  }}
                  onClick={(e) => selectDifficulty(diff.level, e)}
                  onTouchStart={(e) => selectDifficulty(diff.level, e)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 10px 30px rgba(255, 138, 0, 0.5), 0 0 0 2px rgba(255, 200, 107, 0.3) inset';
                    e.target.style.filter = 'brightness(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.filter = 'brightness(1)';
                    e.target.style.boxShadow = difficulty === diff.level 
                      ? '0 8px 30px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset'
                      : '0 6px 20px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.05) inset';
                  }}
                >
                  <div style={{ fontSize: '42px', marginBottom: '10px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{diff.emoji}</div>
                  <div style={{ fontSize: '19px', fontWeight: '800', marginBottom: '6px', letterSpacing: '0.5px' }}>{diff.title}</div>
                  <div style={{ fontSize: '13px', opacity: 0.9, fontWeight: '500', letterSpacing: '0.2px' }}>{diff.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Difficulty Confirmation Screen */}
      {gameState === 'difficultyconfirm' && (
        <div style={{...styles.gameArea, padding: '40px', maxWidth: '500px'}}>
          <div style={styles.homeScreen}>
            <h2 style={{...styles.homeTitle, fontSize: '32px', marginBottom: '20px'}}>
              {difficulty === 'easy' && '😊 Easy'}
              {difficulty === 'medium' && '🎯 Medium'}
              {difficulty === 'hard' && '🔥 Hard'}
              {difficulty === 'hardest' && '💀 Insane'}
            </h2>
            <p style={{...styles.homeDescription, marginBottom: '35px', fontSize: '16px'}}>
              {difficulty === 'easy' && '400ms pattern speed - Slow & steady!'}
              {difficulty === 'medium' && '250ms pattern speed - Balanced challenge!'}
              {difficulty === 'hard' && '100ms pattern speed - Fast reflexes required!'}
              {difficulty === 'hardest' && '75ms pattern speed - Lightning fast, for pros only!'}
            </p>
            
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
              <button 
                style={styles.actionButton}
                onClick={startCountdown}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 10px 30px rgba(255, 138, 0, 0.5), 0 0 0 2px rgba(255, 200, 107, 0.3) inset';
                  e.target.style.filter = 'brightness(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset';
                  e.target.style.filter = 'brightness(1)';
                }}
              >
                Start Game
              </button>
              <button 
                style={styles.actionButtonSecondary}
                onClick={goToDifficultySelect}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 10px 30px rgba(100, 100, 100, 0.5), 0 0 0 2px rgba(255, 200, 107, 0.3) inset';
                  e.target.style.filter = 'brightness(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset';
                  e.target.style.filter = 'brightness(1)';
                }}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Countdown Screen */}
      {gameState === 'countdown' && (
        <div style={styles.gameArea}>
          <div style={styles.countdownScreen}>
            <div style={styles.countdownNumber}>{countdown}</div>
            <div style={styles.countdownText}>Get Ready!</div>
          </div>
        </div>
      )}

      {/* Gameplay Screen */}
      {(gameState === 'showing' || gameState === 'playing' || gameState === 'gameover') && (
        <div style={styles.gameArea}>
          <>
            <div style={styles.message}>{message}</div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isSmallMobile 
                ? `repeat(${gridSize}, ${gridSize === 5 ? '55px' : (gridSize === 4 ? '65px' : (gridSize === 3 ? '75px' : '85px'))})`
                : isMobile
                ? `repeat(${gridSize}, ${gridSize === 5 ? '65px' : (gridSize === 4 ? '80px' : (gridSize === 3 ? '95px' : '110px'))})`
                : `repeat(${gridSize}, ${gridSize === 5 ? '80px' : (gridSize === 4 ? '100px' : (gridSize === 3 ? '120px' : '150px'))})`,
              gap: isSmallMobile ? (gridSize === 5 ? '8px' : '10px') : (gridSize === 5 ? '12px' : '20px'),
              marginBottom: isMobile ? '25px' : '40px',
              justifyContent: 'center',
              justifyItems: 'center',
              width: '100%',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: gridTransition ? 0 : 1,
              transform: gridTransition ? 'scale(0.9)' : 'scale(1)'
            }}>
              {colors.map((color) => (
                <button
                  key={color.id}
                  style={{
                    ...styles.colorButton,
                    backgroundColor: activeColor === color.id ? color.activeColor : color.color,
                    ...(activeColor === color.id ? styles.colorButtonActive : {}),
                    ...(hoveredColorButton === color.id && gameState === 'playing' && !isPlayingSequence ? styles.colorButtonHover : {}),
                    cursor: gameState === 'playing' && !isPlayingSequence ? 'pointer' : 'default',
                    opacity: gameState === 'playing' && !isPlayingSequence ? 1 : 0.7,
                    pointerEvents: gameState === 'playing' && !isPlayingSequence ? 'auto' : 'none'
                  }}
                  onClick={(e) => handleColorClick(color.id, e)}
                  onTouchStart={(e) => handleColorClick(color.id, e)}
                  onMouseEnter={() => {
                    if (gameState === 'playing' && !isPlayingSequence) {
                      setHoveredColorButton(color.id);
                    }
                  }}
                  onMouseLeave={() => setHoveredColorButton(null)}
                  disabled={gameState !== 'playing' || isPlayingSequence}
                />
              ))}
            </div>

            {gameState === 'gameover' && (
              <div style={styles.buttonContainer}>
                <button 
                  style={styles.actionButton}
                  onClick={startGame}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 10px 30px rgba(255, 138, 0, 0.5), 0 0 0 2px rgba(255, 200, 107, 0.3) inset';
                    e.target.style.filter = 'brightness(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset';
                    e.target.style.filter = 'brightness(1)';
                  }}
                >
                  Play Again
                </button>
                <button 
                  style={styles.actionButtonSecondary}
                  onClick={goToDifficultySelect}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 10px 30px rgba(100, 100, 100, 0.5), 0 0 0 2px rgba(255, 200, 107, 0.3) inset';
                    e.target.style.filter = 'brightness(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset';
                    e.target.style.filter = 'brightness(1)';
                  }}
                >
                  Change Difficulty
                </button>
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default SequenceMemoryGame;

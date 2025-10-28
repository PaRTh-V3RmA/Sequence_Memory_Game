import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

const SequenceMemoryGame = () => {
  // Game states
  const [gameState, setGameState] = useState('home'); // 'home', 'howtoplay', 'countdown', 'showing', 'playing', 'gameover'
  const [countdown, setCountdown] = useState(5);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [activeColor, setActiveColor] = useState(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [message, setMessage] = useState('');
  const [isInstructionsHovered, setIsInstructionsHovered] = useState(false);
  const [hoveredStatBox, setHoveredStatBox] = useState(null);
  const [hoveredColorButton, setHoveredColorButton] = useState(null);

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

  const colors = currentLevel > 7 ? colors4x4 : (currentLevel > 3 ? colors3x3 : colors2x2);
  const gridSize = currentLevel > 7 ? 4 : (currentLevel > 3 ? 3 : 2);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('sequenceMemoryHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Play the sequence
  const playSequence = useCallback(async (seq, level) => {
    setIsPlayingSequence(true);
    setGameState('showing');
    setMessage('Watch the pattern...');

    // Faster timing for higher levels
    const delayBefore = level > 7 ? 200 : (level > 3 ? 250 : 400);
    const delayActive = level > 7 ? 200 : (level > 3 ? 250 : 400);

    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delayBefore));
      setActiveColor(seq[i]);
      playSound(seq[i]);
      await new Promise(resolve => setTimeout(resolve, delayActive));
      setActiveColor(null);
    }

    setIsPlayingSequence(false);
    setGameState('playing');
    setMessage('Your turn! Repeat the pattern');
  }, []);

  // Play sound for color
  const playSound = (colorId) => {
    try {
      // Extended frequencies for 16 colors: C, D, E, F, G, A, B, C, D, E, F, G, A, B, C, D
      const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50, 1174.66];
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequencies[colorId] || frequencies[0];
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not available:', error);
    }
  };

  // Navigate to how to play
  const goToHowToPlay = () => {
    setGameState('howtoplay');
  };

  // Start countdown
  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(5);
  };

  // Countdown effect
  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      startGame();
    }
  }, [gameState, countdown]);

  // Start game
  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setCurrentLevel(1);
    setActiveColor(null);
    setIsPlayingSequence(false);
    setMessage('Get ready...');
    
    setTimeout(() => {
      const firstColor = Math.floor(Math.random() * 4); // Level 1 uses 2x2 grid
      const newSequence = [firstColor];
      setSequence(newSequence);
      playSequence(newSequence, 1);
    }, 800);
  };

  // Handle color click
  const handleColorClick = (colorId, event) => {
    if (gameState !== 'playing' || isPlayingSequence) return;

    // Prevent default to avoid double-firing on touch devices
    if (event) {
      event.preventDefault();
    }

    setActiveColor(colorId);
    playSound(colorId);
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
    setCurrentLevel(newLevel);
    setPlayerSequence([]);
    
    // Special messages for grid upgrades
    if (newLevel === 4) {
      setMessage(`Level ${newLevel}! 🎉 GRID UPGRADED TO 3x3! Get ready for more colors!`);
    } else if (newLevel === 8) {
      setMessage(`Level ${newLevel}! 🔥 ULTIMATE GRID: 4x4! Maximum challenge unlocked!`);
    } else {
      setMessage(`Level ${newLevel}! Great job!`);
    }
    
    setTimeout(() => {
      // Use 4 colors for levels 1-3, 9 colors for levels 4-7, 16 colors for levels 8+
      const maxColors = newLevel > 7 ? 16 : (newLevel > 3 ? 9 : 4);
      // Generate a completely new random sequence with length equal to newLevel
      const newSequence = Array.from({ length: newLevel }, () => 
        Math.floor(Math.random() * maxColors)
      );
      setSequence(newSequence);
      playSequence(newSequence, newLevel);
    }, (newLevel === 4 || newLevel === 8) ? 1500 : 800); // Shorter delays
  };

  // Game over
  const gameOver = () => {
    setGameState('gameover');
    setMessage(`Game Over! You reached level ${currentLevel}`);
    
    // Update high score
    const finalLevel = currentLevel;
    if (finalLevel > highScore) {
      setHighScore(finalLevel);
      localStorage.setItem('sequenceMemoryHighScore', finalLevel.toString());
      setMessage(`Game Over! New High Score: Level ${finalLevel}! 🎉`);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'var(--background)',
      padding: '15px',
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
      fontSize: '40px',
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
      transition: 'all 0.3s ease',
      cursor: 'default'
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
      borderRadius: '25px',
      padding: '40px',
      border: '2px solid rgba(255, 138, 0, 0.3)',
      boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255, 138, 0, 0.1) inset, 0 0 100px rgba(255, 138, 0, 0.1)',
      position: 'relative',
      zIndex: 10,
      maxWidth: '700px',
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
      width: gridSize === 2 ? '150px' : (gridSize === 3 ? '120px' : '100px'),
      height: gridSize === 2 ? '150px' : (gridSize === 3 ? '120px' : '100px'),
      borderRadius: '24px',
      border: '3px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
      position: 'relative',
      overflow: 'hidden'
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
      transform: 'translateY(-5px) scale(1.05)',
      border: '2px solid rgba(255, 138, 0, 0.5)',
      boxShadow: '0 15px 45px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 138, 0, 0.2), 0 0 0 1px rgba(255, 138, 0, 0.2) inset',
      background: 'linear-gradient(135deg, rgba(23, 19, 22, 1) 0%, rgba(23, 19, 22, 0.85) 100%)'
    },
    colorButtonHover: {
      transform: 'translateY(-4px) scale(1.05)',
      filter: 'brightness(1.15) saturate(1.1)',
      boxShadow: '0 15px 40px rgba(0,0,0,0.5), 0 0 30px currentColor, 0 0 0 2px rgba(255, 255, 255, 0.2) inset'
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
              Each level gets progressively harder as the sequences grow longer and faster. Can you master all grid modes and reach the ultimate 4x4 challenge?
            </p>
            <p style={styles.homeDescription}>
              Test your limits, train your memory, and compete for the highest score!
            </p>
            <button 
              style={styles.nextButton}
              onClick={goToHowToPlay}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.08)';
                e.target.style.boxShadow = '0 15px 50px rgba(255, 138, 0, 0.6), 0 0 100px rgba(255, 200, 107, 0.4), 0 0 0 2px rgba(255, 200, 107, 0.3) inset';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset';
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
              • 🎯 <strong>Level 4:</strong> Grid upgrades to 3x3 with 9 colors and faster speed!
            </p>
            <p style={styles.instructionText}>
              • 🔥 <strong>Level 8:</strong> Ultimate 4x4 grid with 16 colors unlocks!
            </p>
            <p style={styles.instructionText}>
              • How far can you go?
            </p>
            <button 
              style={styles.startButton}
              onClick={startCountdown}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.08)';
                e.target.style.boxShadow = '0 15px 50px rgba(255, 138, 0, 0.6), 0 0 100px rgba(255, 200, 107, 0.4), 0 0 0 2px rgba(255, 200, 107, 0.3) inset';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset';
              }}
            >
              Start Game
            </button>
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
              gridTemplateColumns: `repeat(${gridSize}, ${gridSize === 2 ? '150px' : (gridSize === 3 ? '120px' : '100px')})`,
              gap: '20px',
              marginBottom: '40px',
              justifyContent: 'center',
              justifyItems: 'center',
              width: '100%'
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
                  style={styles.startButton}
                  onClick={startGame}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px) scale(1.08)';
                    e.target.style.boxShadow = '0 15px 50px rgba(255, 138, 0, 0.6), 0 0 100px rgba(255, 200, 107, 0.4), 0 0 0 2px rgba(255, 200, 107, 0.3) inset';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 138, 0, 0.4), 0 0 0 1px rgba(255, 200, 107, 0.2) inset';
                  }}
                >
                  Play Again
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

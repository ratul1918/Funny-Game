// JavaScript for Funny Game
        const memes = ['😂', '🤪', '😎', '🤡', '👽', '🤖', '👻', '💩', '🙈', '🦄', '🐸', '🔥'];
        const sounds = {
            hit: ['POW!', 'BOOM!', 'WHACK!', 'BONK!', 'SMASH!', 'THWACK!', 'BAM!', 'KAPOW!'],
            miss: ['WHOOSH!', 'MISS!', 'NOPE!', 'AIR BALL!'],
            combo: ['COMBO!', 'AMAZING!', 'INCREDIBLE!', 'UNSTOPPABLE!']
        };
        
        let score = 0;
        let timeLeft = 30;
        let level = 1;
        let gameActive = false;
        let combo = 0;
        let memeSpeed = 1000;
        let spawnRate = 1500;
        let gameInterval;
        let timerInterval;
        let spawnInterval;

        function initGame() {
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'hole';

        const holeBg = document.createElement('div');
        holeBg.className = 'hole-bg';

        const meme = document.createElement('div');
        meme.className = 'meme hidden';
        meme.id = `meme-${i}`;

        // ✅ Attach click handler with addEventListener
        meme.addEventListener('click', () => whackMeme(i));

        hole.appendChild(holeBg);
        hole.appendChild(meme);
        grid.appendChild(hole);
    }
}


        function startGame() {
            if (gameActive) return;
            
            gameActive = true;
            score = 0;
            timeLeft = 30;
            level = 1;
            combo = 0;
            memeSpeed = 1000;
            spawnRate = 1500;
            
            updateStats();
            document.getElementById('startBtn').textContent = 'GAME ON!';
            document.getElementById('startBtn').disabled = true;
            
            // Start spawning memes
            spawnInterval = setInterval(spawnMeme, spawnRate);
            
            // Start timer
            timerInterval = setInterval(() => {
                timeLeft--;
                document.getElementById('timer').textContent = timeLeft;
                
                // Increase difficulty over time
                if (timeLeft % 10 === 0 && timeLeft > 0) {
                    levelUp();
                }
                
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
        }

        function spawnMeme() {
            if (!gameActive) return;
            
            const availableHoles = [];
            for (let i = 0; i < 9; i++) {
                const meme = document.getElementById(`meme-${i}`);
                if (meme.classList.contains('hidden')) {
                    availableHoles.push(i);
                }
            }
            
            if (availableHoles.length === 0) return;
            
            const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
            const meme = document.getElementById(`meme-${randomHole}`);
            const randomMeme = memes[Math.floor(Math.random() * memes.length)];
            
            meme.textContent = randomMeme;
            meme.classList.remove('hidden', 'whacked');
            meme.classList.add('visible');
            
            setTimeout(() => {
                if (!meme.classList.contains('whacked')) {
                    meme.classList.remove('visible');
                    meme.classList.add('hidden');
                    if (gameActive) {
                        combo = 0;
                        showFloatingText(meme, 'MISS!', 'miss-text');
                    }
                }
            }, memeSpeed);
        }

        function whackMeme(index) {
            if (!gameActive) return;
            
            const meme = document.getElementById(`meme-${index}`);
            if (meme.classList.contains('hidden') || meme.classList.contains('whacked')) return;
            
            meme.classList.add('whacked');
            
            // Update score and combo
            combo++;
            const points = 10 * (combo > 3 ? 2 : 1) * level;
            score += points;
            updateStats();
            
            // Show effects
            createParticles(meme);
            const soundText = sounds.hit[Math.floor(Math.random() * sounds.hit.length)];
            showFloatingText(meme, `+${points} ${soundText}`, combo > 3 ? 'combo-text' : '');
            
            if (combo > 3) {
                const comboText = sounds.combo[Math.floor(Math.random() * sounds.combo.length)];
                setTimeout(() => showFloatingText(meme, `${combo}x ${comboText}`, 'combo-text'), 200);
            }
            
            setTimeout(() => {
                meme.classList.remove('visible', 'whacked');
                meme.classList.add('hidden');
            }, 300);
        }

        function levelUp() {
            level++;
            memeSpeed = Math.max(400, memeSpeed - 100);
            spawnRate = Math.max(800, spawnRate - 200);
            
            clearInterval(spawnInterval);
            spawnInterval = setInterval(spawnMeme, spawnRate);
            
            document.getElementById('level').textContent = level;
            showFloatingText(document.querySelector('.game-container'), `LEVEL ${level}!`, 'combo-text');
        }

        function showFloatingText(element, text, className = '') {
            const floatingText = document.createElement('div');
            floatingText.className = `floating-text ${className}`;
            floatingText.textContent = text;
            
            const rect = element.getBoundingClientRect();
            floatingText.style.left = rect.left + rect.width / 2 + 'px';
            floatingText.style.top = rect.top + 'px';
            
            document.body.appendChild(floatingText);
            
            setTimeout(() => floatingText.remove(), 1000);
        }

        function createParticles(element) {
            const rect = element.getBoundingClientRect();
            const particleCount = 10;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = rect.left + rect.width / 2 + 'px';
                particle.style.top = rect.top + rect.height / 2 + 'px';
                particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
                
                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = 50 + Math.random() * 50;
                particle.style.left = (rect.left + rect.width / 2 + Math.cos(angle) * velocity) + 'px';
                particle.style.top = (rect.top + rect.height / 2 + Math.sin(angle) * velocity) + 'px';
                
                document.getElementById('particles').appendChild(particle);
                setTimeout(() => particle.remove(), 1000);
            }
        }

        function updateStats() {
            document.getElementById('score').textContent = score;
            document.getElementById('timer').textContent = timeLeft;
            document.getElementById('level').textContent = level;
        }

        function endGame() {
            gameActive = false;
            clearInterval(timerInterval);
            clearInterval(spawnInterval);
            
            document.getElementById('startBtn').textContent = 'PLAY AGAIN';
            document.getElementById('startBtn').disabled = false;
            
            // Hide all memes
            for (let i = 0; i < 9; i++) {
                const meme = document.getElementById(`meme-${i}`);
                meme.classList.remove('visible');
                meme.classList.add('hidden');
            }
            
            // Show game over screen
            const gameOver = document.createElement('div');
            gameOver.className = 'game-over';
            gameOver.innerHTML = `
                <h2>🎮 GAME OVER! 🎮</h2>
                <div class="final-score">${score}</div>
                <p>You reached Level ${level}!</p>
                <button class="btn start-btn" id="playAgainBtn">PLAY AGAIN</button>
            `;
            document.body.appendChild(gameOver);
            
            document.getElementById('playAgainBtn').addEventListener('click', () => {
                gameOver.remove();
                startGame();
            });
        }

        document.addEventListener("DOMContentLoaded", () => {
            initGame();

            const startBtn = document.getElementById("startBtn");
            startBtn.addEventListener("click", startGame);
        });

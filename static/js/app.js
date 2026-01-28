// Leo's Reading Quest - App Logic

class ReadingQuiz {
    constructor() {
        this.levels = [];
        this.currentLevel = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.skipsRemaining = 3;
        this.timer = null;
        this.timeLeft = 30;
        this.levelStartTime = null;
        this.completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
        this.totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
        this.totalQuestions = parseInt(localStorage.getItem('totalQuestions')) || 0;
        
        this.init();
    }
    
    async init() {
        await this.loadLevels();
        this.attachEventListeners();
        this.showScreen('title-screen');
    }
    
    async loadLevels() {
        try {
            const response = await fetch('/api/levels');
            const data = await response.json();
            this.levels = data.levels;
        } catch (error) {
            console.error('Failed to load levels:', error);
        }
    }
    
    attachEventListeners() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showLevelSelect();
        });
        
        // Skip button
        document.getElementById('skip-btn').addEventListener('click', () => {
            this.skipQuestion();
        });
        
        // Next button
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });
        
        // Next level button
        document.getElementById('next-level-btn').addEventListener('click', () => {
            const nextLevelId = this.currentLevel.id + 1;
            if (nextLevelId <= this.levels.length) {
                this.startLevel(nextLevelId);
            } else {
                this.showGameComplete();
            }
        });
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.resetProgress();
            this.showScreen('title-screen');
        });
        
        // Back buttons
        document.querySelectorAll('.back-btn, .back-to-levels').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showLevelSelect();
            });
        });
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    showLevelSelect() {
        this.renderLevels();
        this.showScreen('level-select');
    }
    
    renderLevels() {
        const container = document.getElementById('levels-container');
        container.innerHTML = '';
        
        this.levels.forEach((level, index) => {
            const isCompleted = this.completedLevels.includes(level.id);
            const isLocked = index > 0 && !this.completedLevels.includes(this.levels[index - 1].id);
            
            const card = document.createElement('div');
            card.className = `level-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
            
            card.innerHTML = `
                <h3>Level ${level.id}</h3>
                <p>${level.name}</p>
                <p class="level-status">
                    ${isCompleted ? '✅ Completed!' : isLocked ? '🔒 Locked' : `${level.question_count} Questions`}
                </p>
            `;
            
            if (!isLocked) {
                card.addEventListener('click', () => this.startLevel(level.id));
            }
            
            container.appendChild(card);
        });
    }
    
    async startLevel(levelId) {
        try {
            const response = await fetch(`/api/level/${levelId}`);
            const data = await response.json();
            this.currentLevel = data.level;
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.correctAnswers = 0;
            this.skipsRemaining = 3;
            this.levelStartTime = Date.now();
            
            this.showScreen('quiz-screen');
            this.showQuestion();
        } catch (error) {
            console.error('Failed to load level:', error);
        }
    }
    
    showQuestion() {
        const question = this.currentLevel.questions[this.currentQuestionIndex];
        
        // Update UI
        document.getElementById('level-name').textContent = this.currentLevel.name;
        document.getElementById('question-counter').textContent = 
            `Question ${this.currentQuestionIndex + 1}/${this.currentLevel.questions.length}`;
        document.getElementById('score').textContent = `⭐ Score: ${this.score}`;
        document.getElementById('skips-remaining').textContent = this.skipsRemaining;
        document.getElementById('skip-btn').disabled = this.skipsRemaining === 0;
        
        // Progress bar
        const progress = ((this.currentQuestionIndex) / this.currentLevel.questions.length) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        
        // Question
        document.querySelector('.game-tag').textContent = question.game;
        document.getElementById('question-text').textContent = question.question;
        
        // Options
        const container = document.getElementById('options-container');
        container.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.textContent = option;
            btn.addEventListener('click', () => this.selectAnswer(index));
            container.appendChild(btn);
        });
        
        // Show question card, hide result card
        document.getElementById('question-card').style.display = 'block';
        document.getElementById('result-card').classList.add('hidden');
        
        // Start timer
        this.startTimer();
    }
    
    startTimer() {
        this.timeLeft = 30;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft === 0) {
                this.selectAnswer(-1); // Time's up
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        const circleElement = document.querySelector('.timer-circle');
        
        timerElement.textContent = this.timeLeft;
        
        if (this.timeLeft <= 10) {
            circleElement.classList.add('warning');
        } else {
            circleElement.classList.remove('warning');
        }
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    selectAnswer(selectedIndex) {
        this.stopTimer();
        
        const question = this.currentLevel.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        // Disable all options
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            option.disabled = true;
            
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Update score
        if (isCorrect) {
            this.score += 10;
            this.correctAnswers++;
        }
        
        // Show result
        this.showResult(isCorrect, question);
    }
    
    showResult(isCorrect, question) {
        const resultCard = document.getElementById('result-card');
        const icon = resultCard.querySelector('.result-icon');
        const title = resultCard.querySelector('.result-title');
        const fact = resultCard.querySelector('.result-fact');
        
        if (isCorrect) {
            icon.textContent = '🎉';
            title.textContent = 'Correct!';
            title.style.color = '#4caf50';
        } else {
            icon.textContent = '💀';
            title.textContent = 'Not Quite!';
            title.style.color = '#ff9800';
        }
        
        fact.textContent = question.fact;
        
        // Hide question card, show result
        document.getElementById('question-card').style.display = 'none';
        resultCard.classList.remove('hidden');
    }
    
    skipQuestion() {
        if (this.skipsRemaining > 0) {
            this.skipsRemaining--;
            this.stopTimer();
            this.nextQuestion();
        }
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.currentLevel.questions.length) {
            this.showLevelComplete();
        } else {
            this.showQuestion();
        }
    }
    
    showLevelComplete() {
        const levelTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
        const accuracy = Math.round((this.correctAnswers / this.currentLevel.questions.length) * 100);
        
        // Update completed levels
        if (!this.completedLevels.includes(this.currentLevel.id)) {
            this.completedLevels.push(this.currentLevel.id);
            localStorage.setItem('completedLevels', JSON.stringify(this.completedLevels));
        }
        
        // Update total stats
        this.totalScore += this.score;
        this.totalQuestions += this.currentLevel.questions.length;
        localStorage.setItem('totalScore', this.totalScore);
        localStorage.setItem('totalQuestions', this.totalQuestions);
        
        // Display results
        document.getElementById('final-level-name').textContent = this.currentLevel.name;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('accuracy').textContent = accuracy;
        document.getElementById('time-taken').textContent = this.formatTime(levelTime);
        
        // Show/hide next level button
        const nextLevelBtn = document.getElementById('next-level-btn');
        if (this.currentLevel.id < this.levels.length) {
            nextLevelBtn.style.display = 'inline-block';
            nextLevelBtn.textContent = `Next Level: ${this.levels[this.currentLevel.id].name} →`;
        } else {
            nextLevelBtn.style.display = 'none';
        }
        
        this.showScreen('level-complete');
    }
    
    showGameComplete() {
        const overallAccuracy = Math.round((this.correctAnswers / this.totalQuestions) * 100);
        
        document.getElementById('total-score').textContent = this.totalScore;
        document.getElementById('total-questions').textContent = this.totalQuestions;
        document.getElementById('overall-accuracy').textContent = overallAccuracy;
        
        // Generate achievements
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = '';
        
        const achievements = [];
        
        if (overallAccuracy === 100) {
            achievements.push('🏆 Perfect Score!');
        } else if (overallAccuracy >= 90) {
            achievements.push('⭐ Horror Master!');
        } else if (overallAccuracy >= 80) {
            achievements.push('👻 Super Fan!');
        }
        
        if (this.totalScore >= 400) {
            achievements.push('💯 High Scorer!');
        }
        
        achievements.push('🎮 Game Expert!');
        achievements.push('🏅 Quiz Champion!');
        
        achievements.forEach(achievement => {
            const span = document.createElement('span');
            span.className = 'achievement';
            span.textContent = achievement;
            achievementsList.appendChild(span);
        });
        
        this.showScreen('game-complete');
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    resetProgress() {
        this.completedLevels = [];
        this.totalScore = 0;
        this.totalQuestions = 0;
        localStorage.removeItem('completedLevels');
        localStorage.removeItem('totalScore');
        localStorage.removeItem('totalQuestions');
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReadingQuiz();
});

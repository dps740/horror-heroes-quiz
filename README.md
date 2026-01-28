# Horror Heroes Quiz 🎮👻

Test your knowledge about **Garten of Banban**, **Poppy Playtime**, and **Five Nights at Freddy's**!

## Features

- **7 Progressive Levels** - Start easy, get harder
- **48 Total Questions** - All about your favorite scary games
- **30-Second Timer** - Keeps the game exciting
- **Skip System** - 3 skips per level if stuck
- **Fun Facts** - Learn something new with every answer
- **Score Tracking** - See how well you know these games
- **Progress Saving** - Pick up where you left off
- **Achievements** - Unlock badges for doing well

## Levels

1. **Character Names** - Do you know who's who?
2. **Character Details** - What do you know about these characters?
3. **Game Locations** - Where do these scary things happen?
4. **Character Colors** - What colors are these scary friends?
5. **Story Questions** - What happens in these games?
6. **Character Abilities** - What can these characters do?
7. **Expert Questions** - For true horror game masters!

## Games Featured

- 🏰 **Garten of Banban** - Banban, Jumbo Josh, Opila Bird, Sheriff Toadster, and more!
- 🧸 **Poppy Playtime** - Huggy Wuggy, Mommy Long Legs, PJ Pug-a-Pillar, and friends!
- 🐻 **Five Nights at Freddy's** - Freddy, Bonnie, Chica, Foxy, and the gang!

## How to Play

### Quick Start

```bash
# Install dependencies
cd ~/clawd/projects/horror-heroes-quiz
pip install -r requirements.txt

# Run the game
python main.py

# Open in your browser
# Go to: http://localhost:8001
```

### Game Rules

1. **Answer questions** about your favorite horror games
2. **Pick the right answer** (click on it)
3. **Learn fun facts** after each question
4. **Use skips wisely** - only 3 per level!
5. **Beat the timer** - 30 seconds per question
6. **Complete all levels** to become a Horror Hero!

## Technical Details

- **Built with:** FastAPI (Python backend) + Vanilla JavaScript frontend
- **Storage:** LocalStorage for progress tracking
- **Port:** 8001
- **No database needed** - All questions in `data/questions.json`

## Customization

Want to add more questions or change games?

Edit `data/questions.json`:
```json
{
  "id": 49,
  "question": "Your new question here?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": 0,
  "game": "Game Name",
  "fact": "Fun fact that teaches something!"
}
```

## Screenshots

- **Title Screen** - Colorful, exciting design
- **Level Select** - See progress and unlock new levels
- **Quiz Screen** - Big text, easy to read
- **Results** - Celebration and fun facts
- **Achievements** - Earn badges for doing well!

## Credits

Made with ❤️ by Scout (Clawdbot AI)
Based on the successful K-pop Quiz format

---

**Have fun and become a Horror Hero!** 🎉👻

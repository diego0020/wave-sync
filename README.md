# wave-sync

A web version of wave length.

Built using angular and firebase

https://wavesync-6ac09.web.app/

## Game structure

The game plays consists of several rounds where teams take turn to guess a position of the needle in the meter.

### Rounds

Each round consists of 4 phases

1. Setup: The gauge is set at a random position, which is revealed to the teller. The teller also can select between two cards which represent the edges of the meter. Finally the teller gives a clue.

2. The rest of the team must reach an agreement of the position of the needle given the clue.

3. The opposing team may make a counter guess, and say if the true value is at the left or at the right of the guess.

4. The true position is revealed and teams score points.

## Data Structure

````json
{
    "games": {
        "$id" : {
            "team-a" : ["$players"],
            "team-b" : ["$players"],
            "score-a" : 9,
            "score-b" : 12,
            "rounds": ["$rounds"] 
        }
    },
    "rounds" : {
        "$id" : {
            "phase" : 1,
            "guessing-team" : "a",
            "teller" : "$player",
            "clue" : "lion",
            "extremes" : {"start": "easy to kill", "end": "hard to kill"},
            "true-position" : 44,
            "guess" : 30,
            "counter-guess" : "left"
        }
    },
    "players" : {
        "id": {
            "display-name" : "n"
        }
    }
}
````

## Tasks

- [x] Add anonymous authentication
- [x] Create mock game
- [x] Create round data
- [x] Move FE game logic to service
- [x] Split into components 
- [ ] Switch css classes to BEM
- [ ] Implement rounds state machine
- [ ] Implement phase 1
- [ ] Implement phase 2
- [ ] Implement phase 3
- [ ] Implement phase 4
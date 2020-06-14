# wave-sync

A web version of wave length.

Built using angular and firebase

https://wavesync-6ac09.web.app/

## Game structure

The game plays consists of several rounds where teams take turn to guess a position of the needle in the meter.

### Rounds

Each round consists of 4 phases

0. Pending: The round is about to start

1. Setup: The gauge is set at a random position, which is revealed to the teller. The teller also can select between two cards which represent the edges of the meter. Finally the teller gives a clue.

2. The rest of the team must reach an agreement of the position of the needle given the clue.

3. The opposing team may make a counter guess, and say if the true value is at the left or at the right of the guess.

4. The true position is revealed and teams score points.

## Data Structure

````json
{
    "games": {
        "$id" : {
            "teamA" : ["$players"],
            "teamB" : ["$players"],
            "scoreA" : 9,
            "scoreB" : 12,
            "rounds": ["$rounds"] 
        }
    },
    "rounds" : {
        "$id" : {
            "phase" : 1,
            "guessingTeam" : "a",
            "teller" : "$player",
            "clue" : "lion",
            "extremes" : {"start": "easy to kill", "end": "hard to kill"}
        }
    },
    "guesses": {
        "$roundId": {
            "guess" : 30,
            "counterGuess" : "left"
        }
    },
    "roundsPrivate" : {
        "$id" : {
            "teller" : "dsg",
            "truePosition" : 44,
        }
    },
    "players" : {
        "id": {
            "displayName" : "n"
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
- [x] Switch css classes to BEM
- [x] Implement rounds state machine
- [x] Implement phase 1
- [x] Implement phase 2
- [x] Implement phase 4
- [ ] Implement phase 3
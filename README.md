# Dungeon Companion
![website status](https://img.shields.io/website?down_message=offline&up_message=online&url=https%3A%2F%2Fdungeon-companion.marceickhoff.dev)
![updated](https://img.shields.io/github/last-commit/marceickhoff/dungeon-companion/master?label=updated)

|![screenshot](https://raw.githubusercontent.com/marceickhoff/dungeon-companion/master/screenshot1.jpg)|![screenshot](https://raw.githubusercontent.com/marceickhoff/dungeon-companion/master/screenshot2.jpg)|
|---|---|

Dungeon Companion is a collaborative web-based Node.js companion app and score tracker for the role-playing card game "Munchkin" by Steve Jackson.

Since keeping track of each player's scores and calculating battles with pen and paper is tedious and prone to errors, this web app helps to improve and simplify this task and lets the players keep their focus on the game.

## Features

* **Completely in the browser:** No installation required!
* Create parties and invite your friends easily via QR code, or a direct invitation link
* Track your own character's level, item bonuses and combat strength
* Leaderboard to keep an eye on your opponents and see who's ahead
* Battle calculator featuring configurable monsters, player assists and one-shot modifiers
* PWA ready ("Add to home screen")

## Play right now

You can use Dungeon Companion for your game night right now. Just visit the following URL and create a party:

[https://dungeon-companion.marceickhoff.dev](https://dungeon-companion.marceickhoff.dev)

## Self-hosting

### Requirements

* Node.js >= v15.5.0
* npm >= v7.3.0
* A web server like Apache or Nginx

### Installation

```
git clone https://github.com/marceickhoff/dungeon-companion
cd dungeon-companion
npm i
npm run start
```

Make sure to set up a publicly available virtual host for the ``public`` directory.
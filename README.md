# 🎮 Multiplayer Tic Tac Toe

A browser-based real-time multiplayer Tic Tac Toe game built with **Node.js**, **Socket.IO**, and **Express**. Play against another player online with live updates, score tracking, and a stylish UI including a full-screen video background.

## 🚀 Features

- Real-time multiplayer game with WebSockets  
- Score tracking for players (X and O)  
- Smooth UI with modal end-game feedback  
- Background video for immersive experience  
- Graceful handling when players leave  
- Responsive layout for various screen sizes  

## 📂 Project Structure

```
├── public/
│   ├── index.html           # Frontend HTML
│   ├── script.js            # Client-side JS (Socket.IO client logic)
│   ├── style.css            # Styling and layout
│   ├── background-video.mp4 # Video background (you need to provide this)
├── server.js                # Backend logic using Express & Socket.IO
├── package.json             # Dependencies and scripts
```

## 🛠 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/multiplayer-tic-tac-toe.git
   cd multiplayer-tic-tac-toe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Add your video background:**
   Place a `.mp4` file named `background-video.mp4` into the `public/` directory.

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000` or use your LAN IP if sharing with others on the same network.

## 🧠 How It Works

- Server assigns either "X" or "O" to connecting players.  
- Moves are shared in real time using Socket.IO.  
- Game restarts automatically after each match with score persistence until a player disconnects.  

## ⚙️ Tech Stack

- Node.js  
- Express  
- Socket.IO  
- HTML5/CSS3  
- JavaScript (Frontend)  

## 📌 Notes

- Ensure both players connect from the same local network or deploy the app on a public server for online play.  
- The game is limited to two players at a time. Others trying to connect will see a "Game is full" message.  
---

🎉 Happy gaming!

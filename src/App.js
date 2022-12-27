// CSS
import "./App.css";

// React
import { useCallback, useEffect, useState } from "react";

// Dados
import { wordsList } from "./data/words";

// Components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name); // Define valor inicial do estado do jogo
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(50);

  const pickWordAndCategory = useCallback(() => {
    // Escolhe a categoria
    const categories = Object.keys(words); // Chaves do objeto
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    // Escolhe a palavra da categoria
    const word =
      words[category][Math.floor(Math.random() * Object.keys(words).length)];

    return { word, category };
  }, [words]);

  const startGame = useCallback(() => {
    clearLetterStates()

    const { word, category } = pickWordAndCategory();

    let wordLetters = word.split(""); // Separa as letras da palavra em um array
    wordLetters = wordLetters.map((letter) => letter.toLowerCase()); // Transforma letras em minúsculas

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[0].name);
  }, [pickWordAndCategory]);

  // Processa letra que o usuário digita no input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // Checa se a letra já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }

    // Coloca letra certa e remove uma tentativa
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    } 
  };

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // Checa se as tentativas terminaram
  useEffect(() => {
    if(guesses <= 0){
      // Reseta todos os estados do jogo
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // Condição de vitória
  useEffect(() => {
    
    const uniqueLetters = [...new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => actualScore += 100)

      startGame()
    }
  }, [guessedLetters, letters, startGame])

  // Restarta o jogo
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;

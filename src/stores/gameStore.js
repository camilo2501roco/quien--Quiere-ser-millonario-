import { defineStore } from 'pinia'
import { allQuestions, moneyTree } from './data/questions.js'

export const useGameStore = defineStore('game', {
  state: () => ({
    currentLevel: 0,
    money: '0',
    status: 'playing', // 'won', 'lost', 'playing'
    question: null,
    lifelines: { phone: true, audience: true, stats: true }
  }),
  getters: {
    currentLevelIndex: (state) => state.currentLevel,
    moneyWon: (state) => state.money,
    currentQuestion: (state) => state.question,
    gameStatus: (state) => state.status,
    lastMessage: (state) => {
      if (state.status === 'won') {
        return '¡FELICIDADES! ¡GANASTE EL MILLÓN!'
      } else if (state.status === 'lost') {
        return 'Lo siento, respuesta incorrecta'
      }
      return ''
    }
  },
  actions: {
    initGame() {
      this.currentLevel = 0
      this.money = '0'
      this.status = 'playing'
      this.lifelines = { phone: true, audience: true, stats: true }
      this.nextQuestion()
    },
    startGame() {
      this.initGame()
    },
    nextQuestion() {
      const levelQuestions = allQuestions.filter(q => q.level === (this.currentLevel + 1))
      this.question = levelQuestions[Math.floor(Math.random() * levelQuestions.length)]
    },
    progressLevel() {
      this.currentLevel++
      this.money = moneyTree[this.currentLevel - 1]
      
      if (this.currentLevel === 15) {
        this.status = 'won'
      } else {
        this.nextQuestion()
      }
    },
    endGame(won = false) {
      this.status = won ? 'won' : 'lost'
      // Si perdió, mantiene el dinero del nivel anterior seguro
      if (!won && this.currentLevel > 0) {
        // Niveles seguros: 5 ($1,000) y 10 ($32,000)
        if (this.currentLevel >= 10) {
          this.money = moneyTree[9] // $32,000
        } else if (this.currentLevel >= 5) {
          this.money = moneyTree[4] // $1,000
        } else {
          this.money = '0'
        }
      }
    }
  }
})
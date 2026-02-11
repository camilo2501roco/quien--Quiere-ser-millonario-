<template>
  <q-page class="flex flex-center column result-page">
    <div class="result-container text-center">
      
      <!-- Icono animado -->
      <div class="icon-container q-mb-lg">
        <q-icon 
          :name="store.gameStatus === 'won' ? 'emoji_events' : 'sentiment_very_dissatisfied'" 
          size="120px" 
          :class="store.gameStatus === 'won' ? 'icon-victory' : 'icon-defeat'"
        />
        <div v-if="store.gameStatus === 'won'" class="confetti">
          <div v-for="i in 50" :key="i" class="confetti-piece"></div>
        </div>
      </div>

      <!-- Mensaje principal -->
      <h2 class="text-h3 text-white text-weight-bold q-mb-sm message-text">
        {{ store.lastMessage }}
      </h2>

      <!-- Dinero ganado -->
      <div class="money-container q-mb-xl">
        <div class="text-caption text-grey-4 q-mb-sm">Premio Final</div>
        <div class="money-amount text-gold">
          ${{ store.moneyWon }}
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-container q-mb-xl" v-if="store.currentLevelIndex > 0">
        <div class="stat-item">
          <q-icon name="grade" size="md" color="amber" />
          <div class="stat-label">Nivel alcanzado</div>
          <div class="stat-value">{{ store.currentLevelIndex }} / 15</div>
        </div>
        <div class="stat-item">
          <q-icon name="lightbulb" size="md" color="purple" />
          <div class="stat-label">Ayudas usadas</div>
          <div class="stat-value">{{ lifelinesUsed }} / 3</div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="actions-container">
        <q-btn
          push
          size="lg"
          class="action-btn restart-btn"
          label="Jugar de Nuevo"
          icon="replay"
          @click="restart"
        />
        <q-btn
          push
          size="lg"
          class="action-btn home-btn"
          label="Inicio"
          icon="home"
          @click="goHome"
        />
      </div>

      <!-- Mensaje motivacional -->
      <p class="motivational-text q-mt-lg">
        {{ motivationalMessage }}
      </p>
    </div>

    <!-- Botón música -->
    <div class="absolute-top-right q-ma-md">
      <q-btn
        round
        flat
        :icon="isMuted ? 'volume_off' : 'volume_up'"
        color="white"
        size="md"
        @click="toggleMute"
      >
        <q-tooltip>{{ isMuted ? 'Activar sonido' : 'Silenciar' }}</q-tooltip>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore';
import { useRouter } from 'vue-router';
import { onMounted, computed } from 'vue';
import { useAudio } from '../composables/useAudio';

const store = useGameStore();
const router = useRouter();
const { playSound, toggleMute, isMuted } = useAudio();

const lifelinesUsed = computed(() => {
  let count = 0;
  if (!store.lifelines.phone) count++;
  if (!store.lifelines.audience) count++;
  if (!store.lifelines.stats) count++;
  return count;
});

const motivationalMessage = computed(() => {
  if (store.gameStatus === 'won') {
    return '¡Eres un verdadero campeón! 🎉';
  } else if (store.currentLevelIndex >= 10) {
    return '¡Excelente intento! Estuviste muy cerca.';
  } else if (store.currentLevelIndex >= 5) {
    return '¡Buen trabajo! La próxima vez llegarás más lejos.';
  } else {
    return 'No te rindas, ¡la práctica hace al maestro!';
  }
});

onMounted(() => {
  if (store.gameStatus === 'won') {
    playSound('victory', 0.7);
  } else {
    playSound('defeat', 0.5);
  }
});

const restart = () => {
  playSound('buttonClick', 0.6);
  store.initGame();
  setTimeout(() => {
    router.push('/game');
  }, 300);
};

const goHome = () => {
  playSound('buttonClick', 0.6);
  setTimeout(() => {
    router.push('/');
  }, 300);
};
</script>

<style scoped>
.result-page {
  background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1e 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.result-container {
  position: relative;
  z-index: 1;
  animation: fadeInScale 0.8s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.icon-container {
  position: relative;
  display: inline-block;
}

.icon-victory {
  color: #d4af37;
  animation: victoryBounce 1s ease-out, rotate 2s linear infinite;
  filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.8));
}

@keyframes victoryBounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-30px) rotate(-10deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-15px) rotate(10deg);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.icon-defeat {
  color: #ef5350;
  animation: shake 0.5s ease-out;
  filter: drop-shadow(0 0 20px rgba(239, 83, 80, 0.6));
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

/* Confetti */
.confetti {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 12px;
  background: linear-gradient(135deg, #d4af37, #f4c430);
  top: -20px;
  left: 50%;
  animation: confettiFall 3s ease-out forwards;
  opacity: 0;
}

.confetti-piece:nth-child(odd) {
  background: linear-gradient(135deg, #6b48ff, #8b5cf6);
}

.confetti-piece:nth-child(3n) {
  background: linear-gradient(135deg, #ef5350, #ff7961);
}

@keyframes confettiFall {
  0% {
    opacity: 1;
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(600px) translateX(var(--x-offset, 0)) rotate(720deg);
  }
}

.confetti-piece:nth-child(1) { animation-delay: 0s; --x-offset: -200px; }
.confetti-piece:nth-child(2) { animation-delay: 0.1s; --x-offset: 150px; }
.confetti-piece:nth-child(3) { animation-delay: 0.2s; --x-offset: -100px; }
.confetti-piece:nth-child(4) { animation-delay: 0.3s; --x-offset: 180px; }
.confetti-piece:nth-child(5) { animation-delay: 0.4s; --x-offset: -150px; }
.confetti-piece:nth-child(6) { animation-delay: 0.5s; --x-offset: 120px; }
.confetti-piece:nth-child(7) { animation-delay: 0.6s; --x-offset: -180px; }
.confetti-piece:nth-child(8) { animation-delay: 0.7s; --x-offset: 100px; }

.message-text {
  font-size: 2.5rem;
  animation: fadeInUp 0.8s ease-out 0.3s backwards;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.money-container {
  background: linear-gradient(135deg, rgba(107, 140, 206, 0.15) 0%, rgba(58, 80, 107, 0.15) 100%);
  border: 3px solid #d4af37;
  border-radius: 16px;
  padding: 24px 48px;
  display: inline-block;
  animation: fadeInUp 0.8s ease-out 0.5s backwards, pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(212, 175, 55, 0.7);
  }
}

.money-amount {
  font-size: 3.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 
    0 0 10px rgba(212, 175, 55, 0.8),
    0 0 20px rgba(212, 175, 55, 0.6);
}

.stats-container {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.7s backwards;
}

.stat-item {
  background: linear-gradient(135deg, rgba(107, 140, 206, 0.2) 0%, rgba(58, 80, 107, 0.2) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 20px 28px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 175, 55, 0.6);
  box-shadow: 0 8px 16px rgba(212, 175, 55, 0.3);
}

.stat-label {
  color: #9e9e9e;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.actions-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.9s backwards;
}

.action-btn {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 16px 40px;
  border-radius: 12px;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.restart-btn {
  background: linear-gradient(135deg, #d4af37 0%, #f4c430 100%);
  color: #000;
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.restart-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.6);
}

.home-btn {
  background: linear-gradient(135deg, #6b48ff 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(107, 72, 255, 0.4);
}

.home-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(107, 72, 255, 0.6);
}

.motivational-text {
  color: #9e9e9e;
  font-size: 1.2rem;
  font-style: italic;
  animation: fadeIn 1.2s ease-out 1.1s backwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsividad móvil */
@media (max-width: 768px) {
  .message-text {
    font-size: 2rem;
  }
  
  .money-amount {
    font-size: 2.5rem;
  }
  
  .money-container {
    padding: 20px 32px;
  }
  
  .icon-container :deep(.q-icon) {
    font-size: 80px !important;
  }
  
  .action-btn {
    font-size: 1.1rem;
    padding: 14px 32px;
  }
  
  .stats-container {
    gap: 16px;
  }
  
  .stat-item {
    min-width: 140px;
    padding: 16px 20px;
  }
}

@media (max-width: 480px) {
  .message-text {
    font-size: 1.6rem;
  }
  
  .money-amount {
    font-size: 2rem;
  }
  
  .money-container {
    padding: 16px 24px;
  }
  
  .icon-container :deep(.q-icon) {
    font-size: 60px !important;
  }
  
  .action-btn {
    font-size: 1rem;
    padding: 12px 24px;
  }
  
  .actions-container {
    gap: 12px;
  }
  
  .motivational-text {
    font-size: 1rem;
  }
}
</style>
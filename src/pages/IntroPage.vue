<template>
  <q-page class="flex flex-center column intro-page">
    <div class="intro-container text-center">
      <!-- Logo/Título con animación -->
      <div class="logo-container q-mb-xl">
        <q-icon name="emoji_events" size="120px" color="gold" class="trophy-icon" />
        <h1 class="text-h2 text-weight-bolder text-gold game-title">
          ¿QUIÉN QUIERE SER<br>MILLONARIO?
        </h1>
        <div class="title-underline"></div>
      </div>
      
      <!-- Información del juego -->
      <div class="game-info q-mb-xl">
        <div class="info-card">
          <q-icon name="help_outline" size="md" color="amber" />
          <span>15 Preguntas</span>
        </div>
        <div class="info-card">
          <q-icon name="attach_money" size="md" color="green" />
          <span>$1 Millón</span>
        </div>
        <div class="info-card">
          <q-icon name="psychology" size="md" color="purple" />
          <span>3 Ayudas</span>
        </div>
      </div>

      <!-- Botón de inicio -->
      <q-btn
        push
        size="xl"
        class="start-btn"
        label="JUGAR AHORA"
        icon="play_arrow"
        @click="start"
      />

      <!-- Subtítulo motivacional -->
      <p class="subtitle q-mt-lg text-grey-4">
        ¿Tienes lo que se necesita para ganar el millón?
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
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import { useAudio } from '../composables/useAudio';

const router = useRouter();
const store = useGameStore();
const { playSound, playBackgroundMusic, toggleMute, isMuted } = useAudio();

const start = () => {
  // Iniciar música en la primera interacción del usuario
  playBackgroundMusic();
  store.initGame();
  
  setTimeout(() => {
    router.push('/game');
  }, 300);
};
</script>

<style scoped>
.intro-page {
  background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1e 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.intro-page::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.intro-container {
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

.logo-container {
  animation: slideDown 1s ease-out;
}

.trophy-icon {
  animation: bounce 2s infinite;
  filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.6));
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.game-title {
  font-size: 3.5rem;
  line-height: 1.2;
  text-shadow: 
    0 0 10px rgba(212, 175, 55, 0.8),
    0 0 20px rgba(212, 175, 55, 0.6),
    0 0 30px rgba(212, 175, 55, 0.4);
  letter-spacing: 2px;
  margin-top: 20px;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    text-shadow: 
      0 0 10px rgba(212, 175, 55, 0.8),
      0 0 20px rgba(212, 175, 55, 0.6),
      0 0 30px rgba(212, 175, 55, 0.4);
  }
  50% {
    text-shadow: 
      0 0 20px rgba(212, 175, 55, 1),
      0 0 30px rgba(212, 175, 55, 0.8),
      0 0 40px rgba(212, 175, 55, 0.6);
  }
}

.title-underline {
  width: 200px;
  height: 4px;
  background: linear-gradient(90deg, transparent 0%, #d4af37 50%, transparent 100%);
  margin: 20px auto 0;
  animation: expandWidth 1.5s ease-out;
}

@keyframes expandWidth {
  from {
    width: 0;
  }
  to {
    width: 200px;
  }
}

.game-info {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.3s backwards;
}

.info-card {
  background: linear-gradient(135deg, rgba(107, 140, 206, 0.2) 0%, rgba(58, 80, 107, 0.2) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.info-card:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 175, 55, 0.6);
  box-shadow: 0 8px 16px rgba(212, 175, 55, 0.3);
}

.start-btn {
  background: linear-gradient(135deg, #d4af37 0%, #f4c430 100%);
  color: #000;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 20px 60px;
  border-radius: 50px;
  box-shadow: 
    0 10px 30px rgba(212, 175, 55, 0.5),
    inset 0 -2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: fadeInUp 1s ease-out 0.5s backwards;
  letter-spacing: 2px;
}

.start-btn:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 
    0 15px 40px rgba(212, 175, 55, 0.7),
    inset 0 -2px 10px rgba(0, 0, 0, 0.2);
}

.start-btn:active {
  transform: translateY(-3px) scale(1.02);
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

.subtitle {
  font-size: 1.2rem;
  font-style: italic;
  animation: fadeIn 1.5s ease-out 0.7s backwards;
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
  .game-title {
    font-size: 2.5rem;
  }
  
  .trophy-icon {
    font-size: 80px !important;
  }
  
  .start-btn {
    font-size: 1.3rem;
    padding: 16px 40px;
  }
  
  .info-card {
    font-size: 1rem;
    padding: 12px 18px;
  }
}

@media (max-width: 480px) {
  .game-title {
    font-size: 2rem;
  }
  
  .trophy-icon {
    font-size: 60px !important;
  }
  
  .start-btn {
    font-size: 1.1rem;
    padding: 14px 32px;
  }
  
  .game-info {
    gap: 12px;
  }
  
  .info-card {
    font-size: 0.9rem;
    padding: 10px 16px;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style>
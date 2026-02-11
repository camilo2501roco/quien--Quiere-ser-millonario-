<template>
  <q-page class="bg-millionaire row items-stretch">
    
    <!-- Área principal del juego -->
    <div class="col-12 col-md-9 flex column justify-between q-pa-md relative-position">
      
      <!-- Header con nivel y dinero -->
      <div class="row justify-between items-center q-mb-md header-info">
        <div class="text-gold text-h6 text-weight-bold level-badge">
          <q-icon name="star" size="sm" class="q-mr-xs" />
          Nivel {{ store.currentLevelIndex + 1 }} de 15
        </div>
        <div class="money-display">
          <div class="text-caption text-grey-4">Dinero acumulado</div>
          <div class="text-gold text-h5 text-weight-bold">${{ store.moneyWon }}</div>
        </div>
      </div>

      <!-- Caja de pregunta con efecto -->
      <div class="question-box q-pa-lg q-my-md text-center">
        <h4 class="q-my-none text-white text-weight-bold question-text">
          {{ store.currentQuestion?.question }}
        </h4>
      </div>

      <!-- Opciones de respuesta -->
      <div class="row q-col-gutter-md q-mb-xl">
        <div 
          v-for="(option, index) in store.currentQuestion?.options" 
          :key="index" 
          class="col-12 col-sm-6"
        >
          <q-btn
            class="full-width btn-option q-py-md text-left"
            no-caps
            unelevated
            @click="selectAnswer(index)"
            :disable="answerSelected"
          >
            <div class="full-width row items-center no-wrap">
              <span class="option-letter q-mr-sm">{{ ['A','B','C','D'][index] }}</span>
              <span class="option-text">{{ option }}</span>
            </div>
          </q-btn>
        </div>
      </div>

      <!-- Sección de ayudas con animaciones -->
      <div class="row justify-center q-gutter-md q-mb-md lifelines-section">
        <!-- Llamada a un amigo -->
        <div class="lifeline-container">
          <q-btn 
            round 
            size="lg" 
            class="lifeline-btn"
            :class="{ 'lifeline-used': !store.lifelines.phone }"
            @click="usePhone" 
            :disable="!store.lifelines.phone"
          >
            <q-icon name="phone" size="md" />
            <div class="lifeline-pulse" v-if="store.lifelines.phone"></div>
          </q-btn>
          <div class="lifeline-label">Llamar</div>
        </div>

        <!-- Ayuda del público -->
        <div class="lifeline-container">
          <q-btn 
            round 
            size="lg" 
            class="lifeline-btn"
            :class="{ 'lifeline-used': !store.lifelines.audience }"
            @click="useAudience" 
            :disable="!store.lifelines.audience"
          >
            <q-icon name="groups" size="md" />
            <div class="lifeline-pulse" v-if="store.lifelines.audience"></div>
          </q-btn>
          <div class="lifeline-label">Público</div>
        </div>

        <!-- Estadísticas -->
        <div class="lifeline-container">
          <q-btn 
            round 
            size="lg" 
            class="lifeline-btn"
            :class="{ 'lifeline-used': !store.lifelines.stats }"
            @click="useStats" 
            :disable="!store.lifelines.stats"
          >
            <q-icon name="analytics" size="md" />
            <div class="lifeline-pulse" v-if="store.lifelines.stats"></div>
          </q-btn>
          <div class="lifeline-label">Stats</div>
        </div>
      </div>

      <!-- Botón música -->
      <div class="absolute-top-right q-ma-md">
        <q-btn
          round
          flat
          :icon="isMuted ? 'volume_off' : 'volume_up'"
          color="white"
          @click="toggleMute"
        >
          <q-tooltip>{{ isMuted ? 'Activar sonido' : 'Silenciar' }}</q-tooltip>
        </q-btn>
      </div>

    </div>

    <!-- Escalera de dinero (sidebar) -->
    <div class="col-12 col-md-3 bg-dark-blue q-pa-md money-ladder-container">
      <h6 class="text-white text-center q-mb-md text-weight-bold">Escalera</h6>
      <q-list dark separator dense>
        <q-item 
          v-for="(amount, index) in moneyTreeReversed" 
          :key="index"
          :class="getMoneyClass(14 - index)"
          class="money-item"
        >
          <q-item-section avatar>
            <span class="text-caption">{{ 15 - index }}</span>
          </q-item-section>
          <q-item-section class="text-right text-weight-bold">
            ${{ amount }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialog para ayuda del público con gráfico -->
    <q-dialog v-model="showAudienceDialog">
      <q-card class="bg-gradient-dark text-white audience-dialog" style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-gold text-center">
            <q-icon name="groups" size="md" class="q-mr-sm" />
            Ayuda del Público
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-center q-mb-md text-grey-3">El público ha votado:</div>
          <div class="audience-bars">
            <div 
              v-for="(percentage, idx) in audienceVotes" 
              :key="idx"
              class="audience-bar-container"
            >
              <div class="audience-letter">{{ ['A', 'B', 'C', 'D'][idx] }}</div>
              <div class="audience-bar-wrapper">
                <div 
                  class="audience-bar"
                  :class="{ 'bar-highlight': idx === store.currentQuestion.answer }"
                  :style="{ width: percentage + '%' }"
                >
                  <span class="bar-percentage">{{ percentage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="gold" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog para otras ayudas -->
    <q-dialog v-model="showHelpDialog">
      <q-card class="bg-gradient-dark text-white help-dialog" style="min-width: 300px">
        <q-card-section>
          <div class="text-h6 text-gold text-center">
            <q-icon :name="helpIcon" size="md" class="q-mr-sm" />
            {{ helpTitle }}
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="help-message">{{ helpMessage }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="gold" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useGameStore } from '../stores/gameStore.js';
import { useRouter } from 'vue-router';
import { moneyTree } from '../stores/data/questions.js';
import { useAudio } from '../composables/useAudio.js';

const store = useGameStore();
const router = useRouter();
const { playSound, stopSound, stopAllSounds, playBackgroundMusic, toggleMute, isMuted } = useAudio();

// Invertimos el árbol de dinero para mostrarlo de arriba (millón) a abajo (100)
const moneyTreeReversed = computed(() => [...moneyTree].reverse());

// Estado local para modales de ayuda
const showHelpDialog = ref(false);
const showAudienceDialog = ref(false);
const helpTitle = ref('');
const helpMessage = ref('');
const helpIcon = ref('help');
const answerSelected = ref(false);

// Votos del público
const audienceVotes = ref([0, 0, 0, 0]);

// Detener sonidos cuando se cierran los dialogs
watch(showHelpDialog, (newVal) => {
  if (!newVal) {
    stopSound('lifeline');
  }
});

watch(showAudienceDialog, (newVal) => {
  if (!newVal) {
    stopSound('lifeline');
  }
});

// --- LÓGICA DE JUEGO ---

const selectAnswer = (index) => {
  if (answerSelected.value) return;
  
  answerSelected.value = true;
  
  // Detener cualquier sonido activo antes de la respuesta final
  stopAllSounds();
  
  // Pequeña pausa antes del sonido de botón
  setTimeout(() => {
    playSound('buttonClick', 0.5, false, true);
  }, 100);

  // Pausa dramática
  setTimeout(() => {
    if (index === store.currentQuestion.answer) {
      // RESPUESTA CORRECTA
      playSound('correctAnswer', 0.6, false, true);
      
      if (store.currentLevelIndex === 14) {
        // Último nivel - ir a resultado
        store.progressLevel();
        setTimeout(() => {
          router.push('/result');
        }, 2000);
      } else {
        // Avanzar al siguiente nivel
        setTimeout(() => {
          store.progressLevel();
          answerSelected.value = false;
          // No reproducir sonido aquí, la nueva pregunta aparece automáticamente
        }, 1500);
      }
    } else {
      // RESPUESTA INCORRECTA
      playSound('wrongAnswer', 0.6, false, true);
      
      store.endGame(false);
      setTimeout(() => {
        router.push('/result');
      }, 2500);
    }
  }, 1000);
};

// --- AYUDAS ---

const usePhone = () => {
  store.lifelines.phone = false;
  stopAllSounds();
  playSound('lifeline', 0.4);
  
  const correct = store.currentQuestion.answer;
  const letters = ['A', 'B', 'C', 'D'];
  // El amigo tiene 80% de probabilidad de acertar
  const suggestion = Math.random() > 0.2 ? correct : Math.floor(Math.random() * 4);
  
  helpIcon.value = 'phone';
  helpTitle.value = "Llamada a un amigo";
  helpMessage.value = `Tu amigo dice: "No estoy 100% seguro, pero creo que la respuesta es la ${letters[suggestion]}".`;
  showHelpDialog.value = true;
};

const useAudience = () => {
  store.lifelines.audience = false;
  stopAllSounds();
  playSound('lifeline', 0.4);
  
  const correct = store.currentQuestion.answer;
  
  // Generar votos simulados (la mayoría vota por la correcta)
  const votes = [0, 0, 0, 0];
  
  // La respuesta correcta recibe 50-70% de los votos
  const correctPercentage = 50 + Math.floor(Math.random() * 21);
  votes[correct] = correctPercentage;
  
  // Distribuir el resto entre las otras opciones
  let remaining = 100 - correctPercentage;
  const otherIndices = [0, 1, 2, 3].filter(i => i !== correct);
  
  otherIndices.forEach((idx, i) => {
    if (i === otherIndices.length - 1) {
      votes[idx] = remaining;
    } else {
      const percentage = Math.floor(Math.random() * (remaining + 1));
      votes[idx] = percentage;
      remaining -= percentage;
    }
  });
  
  audienceVotes.value = votes;
  showAudienceDialog.value = true;
};

const useStats = () => {
  store.lifelines.stats = false;
  stopAllSounds();
  playSound('lifeline', 0.4);
  
  const correct = store.currentQuestion.answer;
  const letters = ['A', 'B', 'C', 'D'];
  
  helpIcon.value = 'analytics';
  helpTitle.value = "Estadísticas";
  helpMessage.value = `El análisis de datos indica:\nOpción ${letters[correct]}: 85%\nOtras: 15% repartido.`;
  showHelpDialog.value = true;
};

// --- ESTILOS DE LA ESCALERA ---
const getMoneyClass = (levelIndex) => {
  if (levelIndex === store.currentLevelIndex) {
    return 'bg-orange-9 text-black active-level';
  } else if (levelIndex < store.currentLevelIndex) {
    return 'text-green-5';
  } else {
    return 'text-grey-5';
  }
};
</script>

<style scoped>
/* Header mejorado */
.header-info {
  background: linear-gradient(90deg, rgba(107, 140, 206, 0.2) 0%, transparent 100%);
  padding: 12px;
  border-radius: 8px;
}

.level-badge {
  display: flex;
  align-items: center;
  animation: fadeInLeft 0.5s ease-out;
}

.money-display {
  text-align: right;
  animation: fadeInRight 0.5s ease-out;
}

/* Pregunta mejorada */
.question-box {
  background: linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%);
  border-top: 3px solid #d4af37;
  border-bottom: 3px solid #d4af37;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  animation: slideDown 0.6s ease-out;
}

.question-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

.question-text {
  font-size: 1.3rem;
  line-height: 1.5;
  position: relative;
  z-index: 1;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Opciones de respuesta mejoradas */
.btn-option {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #3a506b;
  border-radius: 8px;
  color: white;
  font-size: 1.1rem;
  padding: 16px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.5s ease-out backwards;
}

.btn-option:nth-child(1) { animation-delay: 0.1s; }
.btn-option:nth-child(2) { animation-delay: 0.2s; }
.btn-option:nth-child(3) { animation-delay: 0.3s; }
.btn-option:nth-child(4) { animation-delay: 0.4s; }

.btn-option:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.02);
  border-color: #d4af37;
  box-shadow: 0 8px 16px rgba(212, 175, 55, 0.4);
  background: linear-gradient(135deg, #2a2a3e 0%, #26314e 100%);
}

.btn-option:active:not(:disabled) {
  transform: translateY(-2px) scale(1.01);
}

.option-letter {
  background: linear-gradient(135deg, #d4af37 0%, #f4c430 100%);
  color: #000;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.option-text {
  flex: 1;
  padding-left: 12px;
}

/* Ayudas (lifelines) mejoradas */
.lifelines-section {
  animation: fadeIn 0.8s ease-out;
  padding: 16px 0;
}

.lifeline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.lifeline-btn {
  background: linear-gradient(135deg, #6b48ff 0%, #8b5cf6 100%);
  color: white;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(107, 72, 255, 0.4);
}

.lifeline-btn:hover:not(:disabled) {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 8px 16px rgba(107, 72, 255, 0.6);
}

.lifeline-btn.lifeline-used {
  background: #333;
  opacity: 0.3;
}

.lifeline-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(107, 72, 255, 0.4);
  animation: pulse-ring 2s infinite;
  pointer-events: none;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.lifeline-label {
  font-size: 0.85rem;
  color: #d4af37;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Escalera de dinero */
.money-ladder-container {
  border-left: 4px solid #d4af37;
  max-height: 100vh;
  overflow-y: auto;
  background: linear-gradient(180deg, #0f1419 0%, #1a1f2e 100%);
}

.money-item {
  transition: all 0.3s ease;
  border-radius: 4px;
  margin: 2px 0;
}

.active-level {
  border: 2px solid #d4af37;
  border-radius: 6px;
  animation: pulse-level 1.5s infinite;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
}

@keyframes pulse-level {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
  }
  50% { 
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.9);
  }
}

/* Dialog ayuda del público */
.bg-gradient-dark {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #d4af37;
}

.audience-dialog {
  animation: zoomIn 0.3s ease-out;
}

.audience-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.audience-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.audience-letter {
  background: linear-gradient(135deg, #d4af37 0%, #f4c430 100%);
  color: #000;
  font-weight: bold;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.audience-bar-wrapper {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  height: 32px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.audience-bar {
  height: 100%;
  background: linear-gradient(90deg, #3a506b 0%, #5a7a9b 100%);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  transition: width 1s ease-out;
  animation: fillBar 1s ease-out;
}

.audience-bar.bar-highlight {
  background: linear-gradient(90deg, #d4af37 0%, #f4c430 100%);
}

.bar-percentage {
  font-weight: bold;
  font-size: 0.9rem;
  color: #000;
}

@keyframes fillBar {
  from { width: 0%; }
}

/* Dialog ayuda general */
.help-dialog {
  animation: zoomIn 0.3s ease-out;
}

.help-message {
  font-size: 1.05rem;
  line-height: 1.6;
  text-align: center;
  white-space: pre-line;
}

/* Animaciones generales */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsividad móvil */
@media (max-width: 768px) {
  .question-text {
    font-size: 1.1rem;
  }
  
  .btn-option {
    font-size: 1rem;
    padding: 12px 16px;
  }
  
  .option-letter {
    min-width: 32px;
    min-height: 32px;
    font-size: 1rem;
  }
  
  .money-ladder-container {
    max-height: 300px;
    border-left: none;
    border-top: 4px solid #d4af37;
  }
  
  .lifeline-btn {
    width: 56px !important;
    height: 56px !important;
  }
  
  .header-info {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .money-display {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .question-text {
    font-size: 1rem;
  }
  
  .btn-option {
    font-size: 0.95rem;
    padding: 10px 14px;
  }
  
  .lifeline-btn {
    width: 52px !important;
    height: 52px !important;
  }
  
  .lifelines-section {
    gap: 8px;
  }
}
</style>
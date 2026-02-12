import { ref } from 'vue'

// Mapeo de sonidos del juego
// NOTA: Solo se usa la música de fondo
const sounds = {
    // Música de fondo - único sonido del juego
    background: '/audio/background.mp3'
}

// Audio instances cache
const audioCache = new Map()
const backgroundMusic = ref(null)
const isMuted = ref(false)
const currentSound = ref(null) // Para trackear el sonido actual

export function useAudio() {
    /**
     * Detiene todos los sonidos activos excepto la música de fondo
     */
    const stopAllSounds = () => {
        audioCache.forEach((audio, key) => {
            if (key !== 'background' && !audio.paused) {
                audio.pause()
                audio.currentTime = 0
            }
        })
        currentSound.value = null
    }

    /**
     * Reproduce un sonido
     * @param {string} soundName - Nombre del sonido de la lista 'sounds'
     * @param {number} volume - Volumen (0.0 a 1.0)
     * @param {boolean} loop - Si debe reproducirse en bucle
     * @param {boolean} stopOthers - Si debe detener otros sonidos antes de reproducir
     */
    const playSound = (soundName, volume = 0.5, loop = false, stopOthers = false) => {
        if (isMuted.value) return

        const soundPath = sounds[soundName]
        if (!soundPath) {
            console.warn(`Sound "${soundName}" not found`)
            return
        }

        // Detener otros sonidos si es necesario
        if (stopOthers) {
            stopAllSounds()
        }

        try {
            let audio = audioCache.get(soundName)

            if (!audio) {
                audio = new Audio(soundPath)
                audioCache.set(soundName, audio)
            }

            audio.volume = volume
            audio.loop = loop
            audio.currentTime = 0

            audio.play().catch(err => {
                console.warn(`Error playing sound "${soundName}":`, err.message)
            })

            if (!loop) {
                currentSound.value = soundName
            }

            return audio
        } catch (err) {
            console.warn(`Error loading sound "${soundName}":`, err.message)
        }
    }

    /**
     * Detiene un sonido específico
     */
    const stopSound = (soundName) => {
        const audio = audioCache.get(soundName)
        if (audio) {
            audio.pause()
            audio.currentTime = 0
            if (currentSound.value === soundName) {
                currentSound.value = null
            }
        }
    }

    /**
     * Reproduce música de fondo
     */
    const playBackgroundMusic = () => {
        if (!backgroundMusic.value && !isMuted.value) {
            backgroundMusic.value = playSound('background', 0.2, true) // Volumen reducido a 0.2
        }
    }

    /**
     * Detiene música de fondo
     */
    const stopBackgroundMusic = () => {
        if (backgroundMusic.value) {
            stopSound('background')
            backgroundMusic.value = null
        }
    }

    /**
     * Alternar silencio
     */
    const toggleMute = () => {
        isMuted.value = !isMuted.value

        if (isMuted.value) {
            stopBackgroundMusic()
            stopAllSounds()
        } else {
            playBackgroundMusic()
        }
    }

    /**
     * Verifica si hay un sonido reproduciéndose
     */
    const isPlaying = (soundName) => {
        const audio = audioCache.get(soundName)
        return audio && !audio.paused
    }

    return {
        playSound,
        stopSound,
        stopAllSounds,
        playBackgroundMusic,
        stopBackgroundMusic,
        toggleMute,
        isPlaying,
        isMuted,
        currentSound
    }
}

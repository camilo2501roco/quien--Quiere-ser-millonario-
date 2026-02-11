# Archivos de Audio del Juego Millonario

Esta carpeta contiene los archivos de audio para el juego. A continuación se listan los archivos necesarios:

## 📜 Lista de Archivos Necesarios

### Música de Fondo
- `background.mp3` - Música de fondo del juego (volumen bajo automáticamente)

### Efectos de Sonido - Principales
- `button-click.mp3` - Sonido al seleccionar una respuesta
- `correct-answer.mp3` - Sonido de respuesta correcta
- `wrong-answer.mp3` - Sonido de respuesta incorrecta

### Efectos de Sonido - Ayudas
- `lifeline.mp3` - Sonido genérico para las tres ayudas (llamada, público y stats)

### Efectos de Sonido - Resultados
- `victory.mp3` - Música épica de victoria (ganar el millón)
- `defeat.mp3` - Música de derrota

---

## 📝 Notas Importantes

- **Total de archivos**: Solo 7 archivos MP3
- **Formato**: Todos deben ser `.mp3`
- **Tamaño**: Idealmente < 500KB cada uno
- **Volumen**: El sistema ajusta automáticamente los volúmenes:
  - Música de fondo: 20% (0.2)
  - Efectos: 40-60% (0.4-0.6)

## 🎵 Recursos Gratuitos

Puedes encontrar efectos de sonido gratuitos en:
- [Freesound.org](https://freesound.org/)
- [Zapsplat.com](https://www.zapsplat.com/)
- [Mixkit.co](https://mixkit.co/free-sound-effects/)

## 🔧 Control Inteligente de Audio

El sistema implementa:
- ✅ Detención automática al cerrar ventanas de ayudas
- ✅ Evita superposición de sonidos
- ✅ Control de música de fondo independiente
- ✅ Botón de silencio en todas las páginas

notebook();

var audio = document.body.appendChild(document.createElement('audio'));

audio.src = 'https://assets.mixkit.co/sfx/download/mixkit-multiple-fireworks-explosions-1689.wav';



md`

${embed(button("play",()=>audio.play()))}

`


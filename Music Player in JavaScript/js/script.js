const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong(); 
});

function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// función de reproducción de música
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

// función de pausa de la música
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// función de música anterior
function prevMusic(){
  musicIndex--; //decrement of musicIndex by 1
  //if musicIndex is less than 1 then musicIndex will be the array length so the last music play
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// próxima función musical
function nextMusic(){
  musicIndex++; //increment of musicIndex by 1
  //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// evento de botón de reproducción o pausa
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
  //if isPlayMusic is true then call pauseMusic else call playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

// evento de botón de música anterior
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

// siguiente evento de botón de música
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// actualizar el ancho de la barra de progreso según la hora actual de la música
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; //  poniéndose a tocar una canción currentTime
  const duration = e.target.duration; //poniéndose a tocar una canción total duration
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", ()=>{
    // actualizar la duración total de la canción
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ // si sec es menor que 10, agregue 0 antes
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // actualizar la hora actual de reproducción de la canción
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ // si sec es menor que 10, agregue 0 antes
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; // obtener el ancho de la barra de progreso
  let clickedOffsetX = e.offsetX; // obteniendo el valor compensado x
  let songDuration = mainAudio.duration; // obtener la duración total de la canción
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); // llamando a la función playMusic
  playingSong();
});

// cambiar bucle, reproducción aleatoria, repetir icono al hacer clic
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; //obtener esta etiqueta innerText
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//código de qué hacer después de que termine la canción
mainAudio.addEventListener("ended", ()=>{
  // lo haremos de acuerdo con los medios del icono si el usuario ha configurado el icono para
  // canción en bucle, luego repetiremos la canción actual y lo haremos en consecuencia
  let getText = repeatBtn.innerText; //obtener esta etiqueta innerText
  switch(getText){
    case "repeat":
      nextMusic(); //llamando a la función nextMusic
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //establecer el tiempo actual de audio en 0
      loadMusic(musicIndex); //llamando a la función loadMusic con argumento, en el argumento hay un índice de la canción actual
      playMusic(); //llamando a la función playMusic
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //generar índice/número aleatorio con rango máximo de longitud de matriz
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); //este ciclo se ejecuta hasta que el siguiente número aleatorio no sea el mismo del índice de música actual
      musicIndex = randIndex; //pasando randomIndex a musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//mostrar la lista de música al hacer clic en el icono de la música
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// crear etiquetas li de acuerdo con la longitud de la matriz para la lista
for (let i = 0; i < allMusic.length; i++) {
  //pasar el nombre de la canción, artista de la matriz
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //insertando la etiqueta li dentro de ul

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ //si sec es menor que 10, agregue 0 antes
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //pasando la duración total de la canción
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //agregando el atributo t-duration con el valor de duración total
  });
}

//reproducir una canción en particular de la lista al hacer clic en la etiqueta li
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //si el índice de la etiqueta li es igual al índice de música, agregue la clase de reproducción en él
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//función particular li click
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //actualizando el índice de la canción actual con el índice li pulsado
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
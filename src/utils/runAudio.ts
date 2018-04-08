let count = 0;
const audio = new Audio();
audio.volume = 0.6;

export function runAudio(){
    const playlist = [
        'audio/back/1.mp3',
        'audio/back/2.mp3',
        'audio/back/3.mp3',
        'audio/back/4.mp3',
    ];
    if(count < playlist.length + 1){
        audio.src = `${playlist[count]}`;
        audio.play();
        audio.addEventListener('ended', ()=>{
            count++;
            runAudio();
        })
    }else{
        count = 0;
    }
}
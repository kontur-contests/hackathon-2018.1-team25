export enum SoundName {
    Pistol = 'pistol', //'audio/weapons/pistol.mp3'
    ZombieShot = 'shot', //попадание по зомби
}

function play(track: string) {
    new Audio(track).play();
}

export function playSound(soundName: SoundName) {
    const path = './audio/';
    switch (soundName) {
        case SoundName.Pistol:
            play(path + 'weapons/pistol.mp3');
            break;
        case SoundName.ZombieShot:
            play(path + `monsters/${Math.floor(Math.random() * 12)}.mp3`);
            break;
    }
}


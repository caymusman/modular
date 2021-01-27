/*
const audioContext = new AudioContext();

let oscOne = audioContext.createOscillator();
oscOne.frequency.setValueAtTime(220, audioContext.currentTime)
oscOne.type = "square";
oscOne.start();

let oscTwo = audioContext.createOscillator();
oscOne.frequency.setValueAtTime(329.63, audioContext.currentTime);
oscTwo.type = "square";
oscTwo.start();

let panner=audioContext.createStereoPanner();
oscOne.connect(panner);
oscTwo.connect(panner);

let gainNode = audioContext.createGain();
panner.connect(gainNode);

gainNode.gain.setValueAtTime(0, audioContext.currentTime);
gainNode.connect(audioContext.destination);


let pan = document.getElementById("pan");
pan.oninput = function() {
    panner.pan.setValueAtTime(pan.value, audioContext.currentTime);
}


let btn = document.getElementById("btn");

function handleToggle(){
    if(btn.textContent == 'Unmute'){
        gainNode.gain.setTargetAtTime(0.5, audioContext.currentTime, 1);
        btn.classList.remove("muted");
        btn.classList.add("playing");
        btn.textContent = "Mute";
    }else{
        console.log("In Else: " + btn.textContent);
        gainNode.gain.setTargetAtTime(0, audioContext.currentTime, .6);
        btn.classList.remove("playing");
        btn.classList.add("muted");
        btn.textContent = "Unmute";
    }
}

btn.addEventListener("click", handleToggle, false);
*/

/////////////////////////////////////////////////////////////

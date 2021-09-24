 const startBtn=document.querySelector("#start-btn");
 const recognition=new  webkitSpeechRecognition();
 recognition.continous=false;
 recognition.lang="en-US";
 recognition.interimResults=false;
 recognition.maxAlternative=1;

 const synth=window.speechSynthesis;

 startBtn.addEventListener("click", () =>{
     recognition.start();
 });

let utter = new SpeechSynthesisUtterance("Hi, How are you?");
utter.onend = () =>{
    recognition.start();
};

 recognition.onresult =(e) => {
   
    const transcript= e.results[e.results.length-1][0].transcript.trim();
   
    if(transcript==="hey")
    {
        recognition.stop();
        utter.text =" Hi, How are you?";
        synth.speak(utter);
    }
    else if(transcript==="How to start")
    {
        recognition.stop();
        utter.text ="First go to the learn section and learn yoga poses";
        synth.speak(utter);
    }
    else
    {
        recognition.stop();
        utter.text =" Welcome to yogGuru";
        synth.speak(utter);        
    }
   
};
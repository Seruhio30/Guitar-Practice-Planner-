import { generateSession } from "./sessionGenerator.js";

const button = document.querySelector('#generate-session');
const output = document.querySelector('.session-container');
//si la session existe aunque recarge aparece iniciada
const saved = localStorage.getItem("lastSession");
if (saved){
    const session = JSON.parse(saved)
        outputSession(session)
}

button.addEventListener("click", () => {
    
    const level = document.querySelector('input[name="level"]:checked').value;
    const focus = document.querySelector('input[name="focus"]:checked').value;
   
    const session = generateSession(level, focus);
    console.log(session);
    //guardar en localstorage
    localStorage.setItem("lastSession", JSON.stringify(session));
    
     outputSession(session)
});


function outputSession(session){

    //aqui genera dinamicamente por name, minutes and details of session created
    const stepsHtml = session.steps
        .map(step => `
            <li> 
            <strong>${step.name}</strong> - ${step.minutes} min<br>
            <span>${step.details}</span>
            </li> `)
            .join("");

    //aqui envia al dom con esa estructura para que reemplace el placeholder
    output.innerHTML = `
            <h4>${session.title}</h4>
            <p><strong>Level:</strong> ${session.level} · <strong>Focus:</strong>
             ${session.focus}</p>

            <ol>
                ${stepsHtml}
            </ol> `;
     
}


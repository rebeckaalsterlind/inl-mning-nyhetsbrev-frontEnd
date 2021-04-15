// besökare på din webbsida kan regsitrera ett nytt konto 
// och då välja att prenumenera eller inte på ett nyhetsbrev. 
// Sedan skall användaren kunna logga in på sitt skapade konto 
// och ändra sin prenumerationsstatus.
// En registrerad användare skall kunna logga in på frontend applikationen 
// och där kunna ändra sin prenumerationsstatus.
// Nya användare får randomiserade nycklar som indentifierar dem.
// Lösenorden som sparas skall vara krypterade.
const header = document.querySelector("header");
const headerAside = document.querySelector("#headerAside");
const root = document.querySelector("#root");

//TEMPLATES
const logInTemp = `
<form>
<input type="text" id="username" name="username" placeholder="Username">
<input type="password" id="pwd" name="pwd" placeholder="Password">
<input type="submit" value="Log in" id="sendLogIn">
</form>`;


//VUE FUNCTIONS
function loggedOut(){
    headerAside.insertAdjacentHTML("beforeend", `
    <div><button id="regBtn">Register</button></div>` + logInTemp
    );
};

function loggedIn() {
    headerAside.innerHTML = ""
    headerAside.insertAdjacentHTML("beforeend", `<button>Logga ut</button>`);
    root.innerHTML = "";
    root.insertAdjacentHTML("beforeend", `<div><h1>logged in</h1></div>`);
};

function register(){
    headerAside.innerHTML = "";
    headerAside.insertAdjacentHTML("beforeend", logInTemp);

    root.innerHTML = "";
    root.insertAdjacentHTML("beforeend", `<div><h1>reg form</h1></div>`);
}

//SET VIEW BASED ON CURRENTUSER IN LS TRUE/FALSE
(!localStorage.getItem("currentUser")) ? loggedOut() : loggedIn();

// REG BUTTON SEND TO REG FORM
document.querySelector("#regBtn").addEventListener("click", () => register());
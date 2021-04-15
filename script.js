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
<div>
<input type="text" id="username" name="username" placeholder="Username">
<input type="password" id="password" name="pwd" placeholder="Password">
<button id="logInBtn">Log in</button>
</div>`;


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

// LOG IN CHECK IF USER EXISTS => SEND ID BACK
document.querySelector("#logInBtn").addEventListener("click", () => {
    let userName = document.querySelector("#username").value;
    let passWord = document.querySelector("#password").value;
    //if(userName != "" || passWord != ""){
        let checkUser = {username: userName, password: passWord};
    console.log(checkUser)
        fetch("http://localhost:3050/users/login", {
            method: "post", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(checkUser)
        })
        .then(res => res.json())
        .then(data => localStorage.setItem('currentUser', JSON.stringify(data)));
        
        document.querySelector("#username").value = ""; 
        document.querySelector("#password").value = ""; 

    // };


});
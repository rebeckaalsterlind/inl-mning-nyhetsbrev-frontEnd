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
const regHeadTemp = `
<div>
    <input type="text" id="username" name="username" placeholder="Username" autocomplete="on">
    <input type="password" id="password" name="password" placeholder="Password" autocomplete="on">
    <input type="submit" value="Log in" id="logInBtn">
</div>`;
const regMainTemp = `<div><h1>form to register</h1></div>`;

const loggedOutHeadTemp = `<div><button id="regBtn">Register</button></div>` + regHeadTemp;
const loggedOutMainTemp = `<div><h1>log in to access your account</h1></div>`;

const loggedInHeadTemp = `<div><button id="logOutBtn">Log out</button></div>`;
const loggedInMainTemp = `<div><h1>Welcome</h1></div>`;


//SET VIEW BASED ON CURRENTUSER IN LS TRUE/FALSE
(!localStorage.getItem("currentUser")) ? loggedOut() : loggedIn();


//VUE FUNCTIONS
function loggedIn() {
    headerAside.innerHTML = ""
    headerAside.insertAdjacentHTML("beforeend", loggedInHeadTemp);
    
    root.innerHTML = "";
    root.insertAdjacentHTML("beforeend", loggedInMainTemp);

    document.querySelector("#logOutBtn").addEventListener("click", function() {
        console.log('click');
        // localStorage.clear();
        localStorage.removeItem('currentUser');
        loggedOut();
    });

};

function loggedOut() {
    headerAside.innerHTML = ""
    headerAside.insertAdjacentHTML("beforeend", loggedOutHeadTemp);
    
    root.innerHTML = "";
    root.insertAdjacentHTML("beforeend", loggedOutMainTemp);

    document.querySelector("#regBtn").addEventListener("click", () => register());
    
    document.querySelector("#logInBtn").addEventListener("click", () => {

        let userName = document.querySelector("#username").value;
        let passWord = document.querySelector("#password").value;
        //if(userName != " " || passWord != " "){
            let checkUser = {username: userName, password: passWord};
            fetch("http://localhost:3050/users/login", {
                method: "post", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkUser)
            })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('currentUser', JSON.stringify(data.id))
                loggedIn();
            });
            
            
        // } else {
        // register();
        // };
    
    });

};

function register() {
    headerAside.innerHTML = ""
    headerAside.insertAdjacentHTML("beforeend", regHeadTemp);
    
    root.innerHTML = "";
    root.insertAdjacentHTML("beforeend", regMainTemp);

};


    
    
    
    
    
    


  

// LOG IN CHECK IF USER EXISTS => SEND ID BACK


// REG BUTTON SEND TO REG FORM


// LOG OUT BUTTON CLEARS LS SEND TO LOG OUT PAGE    



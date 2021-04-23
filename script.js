// och ändra sin prenumerationsstatus.
// En registrerad användare skall kunna logga in på frontend applikationen 
// och där kunna ändra sin prenumerationsstatus.
// Nya användare får randomiserade nycklar som indentifierar dem.
// Lösenorden som sparas skall vara krypterade.

const header = document.querySelector("header");
const headerAside = document.querySelector("#headerAside");
const main = document.querySelector("#main");

document.querySelector("#logo").addEventListener("click", () => setVue());

//////TEMPLATES
//REGISTER
const regHeadTemp = `
<section>
    <input type="text" id="username" class="redBorder" name="username" placeholder="Username" autocomplete="on">
    <input type="password" id="password" class="redBorder" name="password" placeholder="Password" autocomplete="on">
    <input type="submit" value="Log in" id="logInBtn" class="button" />
</section>`;
 const regMainTemp = `
<section class="root" >
    <form id="regForm" name="regForm">
        <h2>Create an account</h2>
        <div>Username <input id="regUN" type="text" name="regUN"></div>
        <div>Firstname <input id="firstname" type="text" name="firstname"></div>
        <div>Lastname <input id="lastname" type="text" name="lastname"></div>
        <div>Email <input id="email" type="email" name="email"></div>
        <div>Password <input id="regPW" type="password" name="regPW"></div>
        <div>Subscribe to newsletter <input id="checkbox" type="checkbox" name="newsletter"></div>
        <div id="centeredBtn"><input type="button" value="Create" id="createAccount" class="button" /></div>
        <div id="error"></div>
    </form>
</section>`;

//LOGGED OUT
const loggedOutHeadTemp = `<div><button id="regBtn" class="button">Register</button></div>` + regHeadTemp;
const loggedOutMainTemp = `<section class="root"><h1 class="main-text">Log in to access your account</h1></div>`;

//LOGGED IN
const loggedInHeadTemp = `<button id="logOutBtn" class="button">Log out</button></div>`;
const loggedInMainTemp = `
<section class="root">
    <aside id="loggedInMenu">
        <ul id="userMenu">
            <li id="userDetails">My details</li>
            <li id="messages">Messages</li>
        </ul>
    </aside> 
    <section id="loggedInMain">
        <h1 class="main-text">My account</h1>
    </section>
    <aside></aside> 
</section`;

///////////////////

setVue();

//SET VIEW BASED ON CURRENTUSER IN LS TRUE/FALSE
function setVue() {
    
    if(!localStorage.getItem("currentUser")) {
        loggedOut()
    } else {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        loggedIn(user.username);  
    }
};



 //////VUE FUNCTIONS

 //VUE
function vue(headTemp, mainTemp) {
    headerAside.innerHTML = ""
    main.innerHTML = "";
    headerAside.insertAdjacentHTML("beforeend", headTemp);
    main.insertAdjacentHTML("beforeend", mainTemp);
};


 // LOGGED IN
function loggedIn(username) {
    headerAside.innerHTML = ""
    headerAside.insertAdjacentHTML("beforeend", `<div>${username} ` + loggedInHeadTemp);

    main.innerHTML = "";
    main.insertAdjacentHTML("beforeend", loggedInMainTemp);

    document.querySelector("#logOutBtn").addEventListener("click", function () {
        localStorage.removeItem('currentUser');
        loggedOut();
    });

    document.querySelector("#userDetails").addEventListener("click", () => {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        const id = {
            id: user._id
        }
        console.log('id', id);
        fetch("http://localhost:3050/users/myAccount", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id)
            })
            .then(res => res.json())
            .then(data => {
                const loggedInMain = document.querySelector("#loggedInMain");

                loggedInMain.innerHTML = "";
                loggedInMain.insertAdjacentHTML("beforeend", `
                <div class="main-wrapper">
                    <p><span class="bold">Username: </span>${data.username}</p>
                    <p><span class="bold">Firstname: </span>${data.firstname}</p>
                    <p><span class="bold">Lastname: </span>${data.lastname}</p>
                    <p><span class="bold">Email: </span>${data.email}</p>
                    <p><span class="bold">Subscribe to newletter: </span>${(data.subscribe) ? "<input id='checkbox' type='checkbox' checked/>" : "<input id='checkbox' type='checkbox'/>"} </p>
                    <button id="changeSub" class="button">Save</button>
                </div>`);

                document.querySelector("#changeSub").addEventListener("click", (data) => {
                    console.log("data", data)
                let user = JSON.parse(localStorage.getItem('currentUser'));
            
                let updateNL;
                (document.querySelector("#checkbox").checked) ? updateNL = {id: user._id, subscribe: true} : updateNL = {id: user._id, subscribe: false};
                console.log('update', updateNL);
            
                    fetch("http://localhost:3050/users/newsletter", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateNL)
                })
                .then(res => res.json())
                .then(data => {
                    loggedInMain.innerHTML = "";
                    let result;
                    (data) ? result = "now" : result = "no longer";
                    loggedInMain.insertAdjacentHTML("beforeend", `<p>You are ${result} subscribing to the newsletter</p>`)
                });
                });
            });
    });


};



//LOGGED OUT
function loggedOut() {
    vue(loggedOutHeadTemp, loggedOutMainTemp);

    document.querySelector("#regBtn").addEventListener("click", () => register());

    document.querySelector("#logInBtn").addEventListener("click", () => runLogIn());

};

//REGISTER
function register() {
    vue(regHeadTemp, regMainTemp);

    document.querySelector("#createAccount").addEventListener("click", (evt) => {
    
        evt.preventDefault();
        let validation = true;
         
        validateForm("regUN");
        validateForm("firstname");
        validateForm("lastname");
        validateForm("email");
        validateForm("regPW");

        if(validation) {
           
            let regUser = {
                    username: document.querySelector("#regUN").value,
                    firstname: document.querySelector("#firstname").value,
                    lastname: document.querySelector("#lastname").value,
                    email: document.querySelector("#email").value,
                    password: document.querySelector("#regPW").value,
                    subscribe: document.querySelector("#checkbox").checked
                };
            
                

            fetch("http://localhost:3050/users/createAccount", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                 },
                body: JSON.stringify(regUser)
             })
             .then(res => res.json())
             .then(data => {
                if(data == "Email" || data == "Username") {
                    console.log("email")
                    document.querySelector("#error").innerHTML = `<p>${data} is unavailable</p>`;
                }else {
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    loggedIn(data.username);  
                }
                
            });  

        }; 
    });

    document.querySelector("#logInBtn").addEventListener("click", () => runLogIn());

 };


 //FEATURES FUNCTIONS
function runLogIn() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

    if (username != "" || password != "") {

        let checkUser = {
            username: username,
            password: password
        };

        fetch("http://localhost:3050/users/login", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkUser)
            })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('currentUser', JSON.stringify(data))
                loggedIn(data.username);
            });


    } else {
        redBorder("#password");
        redBorder("#username");
        
    };
}


function redBorder(selector) {
    document.querySelector(selector).style.border = "1px solid red";
} 

function validateForm(target) {
    let inputValue = document.forms["regForm"][target].value;
    if (inputValue == "") {
        validation = false;
        redBorder(`#${target}`);
        console.log(validation)
    } 
}






const header = document.querySelector("header");
const headerAside = document.querySelector("#headerAside");
const main = document.querySelector("#main");

document.querySelector("#logo").addEventListener("click", () => setVue());

//TEMPLATES =>

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
const loggedOutMainTemp = `<section class="root"><h1 class="main-text" id="loggedOutMain">Log in to access your account</h1></div>`;

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







//SET VUE BASED ON LOCALSTORAGE ON RELOAD/ENTER OF SITE
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







//VUE FUNCTIONS =>

 //VUE TEMPLATE
function vue(headTemp, mainTemp) {
    headerAside.innerHTML = ""
    main.innerHTML = "";
    headerAside.insertAdjacentHTML("beforeend", headTemp);
    main.insertAdjacentHTML("beforeend", mainTemp);
};




//LOGGED OUT
function loggedOut() {
    vue(loggedOutHeadTemp, loggedOutMainTemp);
    document.querySelector("#regBtn").addEventListener("click", () => register());
    document.querySelector("#logInBtn").addEventListener("click", () => runLogIn());
};

//CHECK IF USER IS REGISTERED
function runLogIn() {

    noBorder("#password");
    noBorder("#username");

    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

    if (username == "" || password == "") {
        if (username == "") {
            redBorder("#username");
        } if(password == ""){
            redBorder("#password");
        };
    } else {

        let checkUser = {
            username: username,
            password: password
        };

        fetch("https://newsletter-with-mongo.herokuapp.com/users/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(checkUser)
        })
        .then(res => res.json())
        .then(data => {

            if(data == "Invalid") {
                document.querySelector(".root").innerHTML = `<p class="red">${data} username or password</p>`;
            }else if(data.username != undefined) {
                localStorage.setItem('currentUser', JSON.stringify(data));
                loggedIn(data.username);    
            };

        });
    };
};
      

    



 // IF USER IS LOGGED IN
function loggedIn(username) {
    headerAside.innerHTML = ""
    headerAside.insertAdjacentHTML("beforeend", `<div id="printedName">${username} ` + loggedInHeadTemp);

    main.innerHTML = "";
    main.insertAdjacentHTML("beforeend", loggedInMainTemp);

    //CLICK LOG OUT BTN => CLEARS LOCALSTORAGE
    document.querySelector("#logOutBtn").addEventListener("click", function () {
        localStorage.removeItem('currentUser');
        setVue();
    });

    //CLICK USERDETAILS => SENDS ID TO SERVER
    document.querySelector("#userDetails").addEventListener("click", () => {
       console.log('id', id);
        let user = JSON.parse(localStorage.getItem('currentUser'));
        const id = {
            id: user.id
        }
        
        fetch("https://newsletter-with-mongo.herokuapp.com/users/myAccount", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(id)
        })
        .then(res => res.json())
        .then(data => {
            //PRINT DATA
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
            
            //CHANGE SUBSCRIPTION PREFERENCES
            document.querySelector("#changeSub").addEventListener("click", (data) => {

                let user = JSON.parse(localStorage.getItem('currentUser'));
            
                let updateNL;
                (document.querySelector("#checkbox").checked) ? updateNL = {id: user._id, subscribe: true} : updateNL = {id: user._id, subscribe: false};
        
                fetch("https://newsletter-with-mongo.herokuapp.com/users/newsletter", {
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
                    loggedInMain.insertAdjacentHTML("beforeend", `<p>You are ${result} subscribing to the newsletter</p>`);
                });
            });
        });
    });
};


//REGISTER NEW ACCOUNT
function register() {
    vue(regHeadTemp, regMainTemp);

    document.querySelector("#createAccount").addEventListener("click", (evt) => {
    
        evt.preventDefault();
        let validation = true;
        //CHECK IF ALL FIELDS ARE FILLED 
        validateForm("regUN");
        validateForm("firstname");
        validateForm("lastname");
        validateForm("email");
        validateForm("regPW");
        
        //IF SO => SEND VALUES TO SERVER
        if(validation) {
           
            let regUser = {
                username: document.querySelector("#regUN").value,
                firstname: document.querySelector("#firstname").value,
                lastname: document.querySelector("#lastname").value,
                email: document.querySelector("#email").value,
                password: document.querySelector("#regPW").value,
                subscribe: document.querySelector("#checkbox").checked
            };
              
            fetch("https://newsletter-with-mongo.herokuapp.com/users/createAccount", {
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
                };
            });  
        }; 
    });

    document.querySelector("#logInBtn").addEventListener("click", () => runLogIn());

};




//FEATURES FUNCTIONS



//GIVE INPUT FIELD RED BORDER WHEN ERROR
function redBorder(selector) {
    document.querySelector(selector).style.border = "1px solid red";
}; 

//CLEAR RED BORDER
function noBorder(selector) {
    document.querySelector(selector).style.border = "none";
};

//CHECK IF INPUT FIELDS ARE EMPTY
function validateForm(target) {
    let inputValue = document.forms["regForm"][target].value;
    if (inputValue == "") {
        validation = false;
        redBorder(`#${target}`);
    }; 
};




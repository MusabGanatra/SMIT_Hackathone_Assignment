const email = document.getElementById("email");
const password = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const message = document.getElementById("message");


// Register User
registerBtn.addEventListener("click", async () => {

    if(email.value === "" || password.value === ""){
        message.innerText = "Please enter email and password";
        return;
    }

    const { data, error } =
    await supabaseClient.auth.signUp({
        email: email.value,
        password: password.value
    });

    if(error){
        message.innerText = error.message;
        return;
    }

    message.style.color = "green";
    message.innerText = "Registration Successful";

});


// Login User
loginBtn.addEventListener("click", async () => {

    if(email.value === "" || password.value === ""){
        message.innerText = "Please enter email and password";
        return;
    }

    const { data, error } =
    await supabaseClient.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });

    if(error){
        message.style.color = "red";
        message.innerText = error.message;
        return;
    }

    message.style.color = "green";
    message.innerText = "Login Successful";

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);

});


// Check Existing Session
async function checkSession(){

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if(session){
        window.location.href = "dashboard.html";
    }
}

checkSession();
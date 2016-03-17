function show() {
    var bg = document.getElementById('background');
    var lb = document.getElementById('login-box');
    bg.style.display = 'block';
    lb.style.display = 'block';
}
function hide() {
    var bg = document.getElementById('background');
    var lb = document.getElementById('login-box');
    bg.style.display = 'none';
    lb.style.display = 'none';
}
function register(){
    var register = document.getElementById('register');
    var login = document.getElementById('login');
    var registerLink = document.getElementById('register-link');
    var loginLink = document.getElementById('login-link');
    register.style.display = 'block';
    registerLink.className = 'login-active';
    login.style.display = 'none';
    loginLink.className = '';
}
function login(){
    var register = document.getElementById('register');
    var login = document.getElementById('login');
    var registerLink = document.getElementById('register-link');
    var loginLink = document.getElementById('login-link');
    login.style.display = '';
    loginLink.className = 'login-active';
    register.style.display = 'none';
    registerLink.className = '';
}
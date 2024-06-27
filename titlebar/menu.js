let titlebar = null;
let batteryMonitor = null;

function menuInit(){
    const elmnt = document.getElementById("titlebar");
    const file = elmnt.getAttribute("datasrc")

    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = async function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                elmnt.innerHTML = this.responseText;

                titlebar = document.getElementById("titlebar");
                titlebar.addEventListener("click", openMenu);

                batteryMonitor = document.getElementById("batteryChart");

                batteryMonitor.setAttribute("width", "190");
                batteryMonitor.setAttribute("height", "50");
                batteryMonitor.setAttribute("background", "#202020");
            }
            if (this.status === 404) {
                elmnt.innerHTML = "Page not found.";
            }
        }
    }

    xhttp.open("GET", file, true);
    xhttp.send();
}

function _findMenuButton(caption){
    const menu = document.getElementById("titlebar");

    let buttons = document.getElementsByTagName("BUTTON");

    for(let i = 0; i <= buttons.length; i++){
        if(buttons[i].innerHTML === caption) return buttons[i];
    }
}

function openMenu(evt){
    console.log(evt);

    closeMenu();


    if(!evt.target.dataset.hasOwnProperty("sub")) return;

    const attr = evt.target.dataset.sub;
    console.log(attr);

    if(attr && attr.startsWith("#")) {
        document.getElementById("menuCatcher").style.display = "block";

        if(evt.target.className.indexOf("hidden") < 0) evt.target.className = "tb-menu selected";

        const submenu = document.getElementById(attr.substring(1));
        submenu.className = " tb-submenu shown";

        let x = (evt.target.offsetLeft + 3);
        let y = (evt.target.offsetHeight -3);

        console.log(x, y);

        submenu.style.left = x + "px";
        submenu.style.top = y + "px";

        evt.preventDefault();
        evt.stopPropagation();

        window.addEventListener("click", closeMenu);
    }
}

function closeMenu(){
    console.log("closeMenu");

    let subs = document.getElementsByClassName("tb-submenu");

    for(let i = 0; i < subs.length; i++){
        subs[i].className = "tb-submenu";
    }

    subs = titlebar.getElementsByTagName("button");

    for(let i = 0; i < subs.length; i++){
        if(subs[i].className.indexOf("hidden") < 0) subs[i].className = "tb-menu";
    }

    document.getElementById("menuCatcher").style.display = "none";
    window.removeEventListener("click", closeMenu);
}

function showModule(mod){
    const container = document.getElementById("mainFrame");

    container.src = "modules/" + mod + "/sub.html";
}

window.addEventListener("load", menuInit);


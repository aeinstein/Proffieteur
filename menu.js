let titlebar = null;

function menuInit(){
    titlebar = document.getElementById("titlebar");
    titlebar.addEventListener("click", openMenu);
}

function openMenu(evt){
    console.log(evt);

    closeMenu();

    const attr = evt.target.dataset.sub;
    console.log(attr);

    document.getElementById("menuCatcher").style.display = "block";

    if(attr.startsWith("#")) {
        evt.target.className = "tb-menu selected";

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

    } else {
        window[attr]();
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
        subs[i].className = "tb-menu";
    }

    document.getElementById("menuCatcher").style.display = "none";
    window.removeEventListener("click", closeMenu);
}

function openFile(){
    console.log("openFile");
}

function showModule(mod){
    switch(mod){
        case "bladeconfig":
            document.getElementById("mainFrame").src = "src/modules/bladeconfig/blades.html";
            break;
    }
}

window.addEventListener("load", menuInit);
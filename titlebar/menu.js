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

function saveLocalStorage(){
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        data[k] = localStorage.getItem(k);
    }

    const textToSave = JSON.stringify(data);
    const textToSaveAsBlob = new Blob([textToSave], {
        type: "text/plain"
    });
    const textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

    const downloadLink = document.createElement("a");
    downloadLink.download = "proffie.pcfg";
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = ()=>{
        document.body.removeChild(event.target);
    };
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function loadLocalStorage(){
    let readFile = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target.result;
            localStorage.clear();
            console.log("storage cleared");
            const data = JSON.parse(contents);

            for (const key in data) {
                localStorage.setItem(key, data[key]);
            }
        }
        reader.readAsText(file)
    }

    const fileInput = document.createElement("input")
    fileInput.type='file';
    fileInput.accept = '.pcfg';
    fileInput.style.display='none';
    fileInput.onchange=readFile;

    document.body.appendChild(fileInput)
    clickElem(fileInput)
}

function clickElem(elem) {
    const eventMouse = document.createEvent("MouseEvents");
    eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    elem.dispatchEvent(eventMouse)
}

window.addEventListener("load", menuInit);


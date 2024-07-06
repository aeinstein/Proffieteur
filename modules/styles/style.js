let styles;

function refreshStyleEditor(){
    const style = document.getElementById("style").value;

    let style_code = styles[style];

    document.getElementById("editor").src = "style_editor.html?S=" + encodeURI(style_code);
}

function deleteStyle(){
    const style = document.getElementById("style").value;

    delete styles[style];

    localStorage.setItem("STYLES", JSON.stringify(styles));
    init();
}

function newStyle(){
    showTemplate("tmpNewStyle");
}

function saveNewStyle(){
    let name = document.getElementById("StyleName").value;
    const box = document.getElementById("style");

    const option = document.createElement("OPTION");
    option.value = name;
    option.text = name;

    box.appendChild(option);
    box.value = name;

    styles[name] = "";

    localStorage.setItem("STYLES", JSON.stringify(styles));
    refreshStyleEditor();
    hideTemplate();
}

function init(){
    styles =  JSON.parse(localStorage.getItem("STYLES"));

    let content = "";

    for(const item in styles){
        content += "<option id='" + item + "'>" + item;
    }

    document.getElementById("style").innerHTML = content;
    refreshStyleEditor();
}

window.addEventListener("load", init);

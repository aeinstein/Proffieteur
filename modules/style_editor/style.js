

function refreshStyleEditor(){
    const style = document.getElementById("style").value;

    let style_code = styles[style];

    document.getElementById("editor").src = "style_editor.html?S=" + encodeURI(style_code);
}

function init(){
    styles =  JSON.parse(localStorage.getItem("STYLES"));




    let content = "";

    for(const item in styles){
        content += "<option id='" + item + "'>" + item;
    }

    document.getElementById("style").innerHTML = content;
}

window.addEventListener("load", init);


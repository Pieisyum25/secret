const $ = id => document.getElementById(id);
const salt = "060602";


function loadListContent(){
    fetch("https://pieisyum25.github.io/secret/content.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        $("list-header").value = data["title"];
        data["list"].forEach(item => {
            const listItem = document.createElement("li");
            listItem.value = item;
            listItem.classList.add("list-item");
            $("list-content").appendChild(listItem);
        });
    })
}

function validateLogin(e){
    e.preventDefault();
    
    const username = $("username").value;
    const password = $("password").value;
    
    const hash = (password + salt).split('').reduce((prevHash, currVal) => (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
    console.log(hash);

    if (username == "u"){

        // Decrypt codes:
        const header = $("list-header");
        const content = $("list-content");
        header.value = decryptCode(header.value, password);
        content.children.forEach(item => {
            item.value = decryptCode(item.value);
        });
        
        // Display list:
        $("login").hidden = true;
        $("list").hidden = false;
    }
}

function decryptCode(code, passcode){
    let result = "";
    const passLen = passcode.length;
    const charCodes = code.split(",");
    
    for(let i = 0  ; i < charCodes.length ; i++) {
        const passOffset = i % passLen ;
        const calAscii = (charCodes[i] - passcode.charCodeAt(passOffset));
        result += String.fromCharCode(calAscii);
    }
    return result;
}

import crypto from 'crypto';


const $ = id => document.getElementById(id);

function loadListContent(){
    fetch("content.json")
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
    
    hash = crypto.createHash('sha2').update(password).digest('hex');
    console.log(hash); 

    if (username == "u" && hash == "lol"){

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
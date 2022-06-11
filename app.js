
const $ = id => document.getElementById(id);
const salt = "060602";
let days = 666;
let placeholder = "...";

function loadListContent(){
    // Calculate days:
    const prev = new Date("05/30/2020");
    const curr = new Date();
    days = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));

    // Process json:
    fetch("https://pieisyum25.github.io/secret/content.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        $("list-header").innerHTML = data["title"];
        const content = $("list-content");
        const list = data["list"];
        for (let i = 0; i < list.length; i++){
            if (i >= days) break;
            const listItem = document.createElement("li");
            listItem.innerHTML = list[i];
            listItem.classList.add("list-item");
            content.appendChild(listItem);
        }
        placeholder = data["placeholder"];
    })
}

function validateLogin(e){
    e.preventDefault();
    
    const username = $("username").value;
    const password = $("password").value;

    // console.log(createHash(username));
    // console.log(createHash(password));

    if (createHash(username) == 843062404 &&  createHash(password) == 162751532){

        // Decrypt codes:
        const header = $("list-header");
        const content = $("list-content");
        header.innerHTML = decryptCode(header.innerHTML, password);
        for (let i = 0; i < content.children.length; i++){
            const item = content.children[i];
            item.innerHTML = decryptCode(item.innerHTML, password);
        }

        // Apply number of days to data:
        header.innerHTML = header.innerHTML.replace("%d", days.toString());
        const missingItems = days - content.children.length;
        const defaultText = decryptCode(placeholder, password);
        for (let i = 0; i < missingItems; i++){
            const item = document.createElement("li");
            item.innerHTML = defaultText;
            item.classList.add("list-item");
            content.appendChild(item);
        }
        
        // Display list:
        $("login").hidden = true;
        $("list").hidden = false;

    } else {
        $("login-error").textContent = "Username or Password is incorrect."
    }
}

function createHash(text){
    return (text + salt).split('').reduce((prevHash, currVal) => (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

function decryptCode(code, passcode){
    let result = "";
    const passLen = passcode.length;
    const charCodes = code.split(",");
    
    for(let i = 0; i < charCodes.length; i++) {
        const passOffset = i % passLen ;
        const calAscii = (charCodes[i] - passcode.charCodeAt(passOffset));
        result += String.fromCharCode(calAscii);
    }
    return result;
}
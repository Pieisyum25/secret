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

    if (username == "u" && hash == 238574984){

        // Decrypt codes:
        const header = $("list-header");
        const content = $("list-content");
        header.value = decryptCode(header.value, password);
        content.childNodes.forEach(item => {
            item.value = decryptCode(item.value);
        });

        // Calculate days:
        const prev = new Date("06/30/2020");
        const curr = new Date.now();
        const days = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));

        // Apply number of days to data:
        header.value = header.value.replace("%d", str(days));
        const missingItems = days - content.children.length;
        for (let i = 0; i < missingItems; i++){
            const item = document.createElement("li");
            item.value = "..."
            item.classList.add("list-item");
            content.appendChild(listItem);
        }
        
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
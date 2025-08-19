// popup.js
document.getElementById("generate").addEventListener("click", function() {
    const length = document.getElementById("length").value;
    const includeUppercase = document.getElementById("uppercase").checked;
    const includeLowercase = document.getElementById("lowercase").checked;
    const includeNumbers = document.getElementById("numbers").checked;
    const includeSpecial = document.getElementById("special").checked;


    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSpecial) {
        alert("Please check at least one option");
        return;
    }

    const password = generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecial);
    document.getElementById("password").value = password;
    //document.getElementById("strength").textContent = evaluateStrength(password);
    
    updateStrength(password);
    saveToHistory(password);
});

function updateStrength(password) {
    const strengthDisplay = document.getElementById("strength");
    strengthDisplay.textContent = evaluateStrength(password);
    strengthDisplay.className = "";
    
    if (password.length < 6) {
        strengthDisplay.classList.add("weak");
    } else if (password.length < 12) {
        strengthDisplay.classList.add("medium");
    } else {
        strengthDisplay.classList.add("strong");
    }
}


function evaluateStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;

    if (strength <= 2) return "Weak";
    if (strength === 3) return "Medium";
    return "Strong";
}

function generatePassword(length, uppercase, lowercase, numbers, special) {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (special) chars += "!@#$%^&*()_+{}[]<>?";
    
    if (chars.length === 0) return "Select at least one option";
    
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (password) {
        document.getElementById("copy").style.display = "block";
    } else {
        document.getElementById("copy").style.display = "none";
    }
    return password;
}

function saveToHistory(password) {
    const timestamp = new Date().toLocaleString();
    chrome.storage.local.get({history: []}, function(data) {
        let history = data.history;
        history.unshift({ password, timestamp });
        // if (history.length > 10) history.pop();
        chrome.storage.local.set({history: history}, function() {
            loadHistory();
        });
    });
}

function loadHistory() {
    chrome.storage.local.get({history: []}, function(data) {
        const historyList = document.getElementById("history");
       // const noHistoryMessage = document.getElementById("no-history-message");
        historyList.innerHTML = "";
        data.history.forEach((entry, index) => {
            let li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            let div = document.createElement("div");
            div.innerHTML = `<small>${entry.password}</small><br><small>${entry.timestamp}</small>`;

            let deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-danger btn-sm";
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", function() {
                removeFromHistory(index);
            });

            li.appendChild(div);
            li.appendChild(deleteBtn);
            historyList.appendChild(li);
        });
    });
}

function removeFromHistory(index) {
    chrome.storage.local.get({history: []}, function(data) {
        let history = data.history;
        history.splice(index, 1);
        chrome.storage.local.set({history: history}, function() {
            loadHistory();
        });
    });
}
document.getElementById("copy").addEventListener("click", function() {
    const passwordField = document.getElementById("password");
    const copyMessage = document.getElementById("copy-message");
    
    passwordField.select();
    document.execCommand("copy");
    
    copyMessage.style.display = "block";
    setTimeout(() => {
        copyMessage.style.display = "none";
    }, 2000);
});




// const settingsBtn = document.getElementById("open-settings");
//         const toggleDarkSetting = document.getElementById("toggleDarkModeSetting");

//         settingsBtn.addEventListener("click", () => {
//             const isDark = document.body.classList.contains("dark-mode");
//             toggleDarkSetting.checked = isDark;
//             const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
//             settingsModal.show();
//         });

//         toggleDarkSetting.addEventListener("change", () => {
//             document.body.classList.toggle("dark-mode", toggleDarkSetting.checked);
//         });

//         document.getElementById("feedbackButton").addEventListener("click", () => {
//             window.open("https://chromewebstore.google.com/detail/secure-password-generator/jhjoppnlilameejonbddndmhganpbmeg/reviews", "_blank");
//         });



document.addEventListener("DOMContentLoaded", loadHistory);
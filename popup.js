document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle-feature');
    const textarea = document.getElementById('plain-text-translate-input');
    const output = document.getElementById('moose-code-output');

    // Load the toggle state from storage
    chrome.storage.sync.get(['featureEnabled'], (result) => {
        toggle.checked = result.featureEnabled || false; // Default to false if not set
    });

    // Save the toggle state when the checkbox is changed
    toggle.addEventListener('change', () => {
        chrome.storage.sync.set({ featureEnabled: toggle.checked }, () => {
            console.log('Feature enabled:', toggle.checked);
            
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        });
    });

    textarea.addEventListener('input', function() {
        //console.log(textarea.value);
        const translated = textToMoose(textarea.value);
        output.innerText = translated;
    });
});

// Define the Moose Code dictionary.
const MOOSE_CODE_DICT = {
    'A': '*stomp*"MUUUAAAH"', 'B': '"MUUUAAAH"*stomp**stomp**stomp*',
    'C': '"MUUUAAAH"*stomp*"MUUUAAAH"*stomp*', 'D': '"MUUUAAAH"*stomp**stomp*',
    'E': '*stomp*', 'F': '*stomp**stomp*"MUUUAAAH"*stomp*',
    'G': '"MUUUAAAH""MUUUAAAH"*stomp*', 'H': '*stomp**stomp**stomp**stomp*',
    'I': '*stomp**stomp*', 'J': '*stomp*"MUUUAAAH""MUUUAAAH""MUUUAAAH"',
    'K': '"MUUUAAAH"*stomp*"MUUUAAAH"', 'L': '*stomp*"MUUUAAAH"*stomp**stomp*',
    'M': '"MUUUAAAH""MUUUAAAH"', 'N': '"MUUUAAAH"*stomp*',
    'O': '"MUUUAAAH""MUUUAAAH""MUUUAAAH"', 'P': '*stomp*"MUUUAAAH""MUUUAAAH"*stomp*',
    'Q': '"MUUUAAAH""MUUUAAAH"*stomp*"MUUUAAAH"', 'R': '*stomp*"MUUUAAAH"*stomp*',
    'S': '*stomp**stomp**stomp*', 'T': '"MUUUAAAH"', 'U': '*stomp**stomp*"MUUUAAAH"',
    'V': '*stomp**stomp**stomp*"MUUUAAAH"', 'W': '*stomp*"MUUUAAAH""MUUUAAAH"',
    'X': '"MUUUAAAH"*stomp**stomp*"MUUUAAAH"', 
    'Y': '"MUUUAAAH"*stomp*"MUUUAAAH""MUUUAAAH"', 'Z': '"MUUUAAAH""MUUUAAAH"*stomp**stomp*',
    '1': '*stomp*"MUUUAAAH""MUUUAAAH""MUUUAAAH""MUUUAAAH"',
    '2': '*stomp**stomp*"MUUUAAAH""MUUUAAAH""MUUUAAAH"',
    '3': '*stomp**stomp**stomp*"MUUUAAAH""MUUUAAAH"',
    '4': '*stomp**stomp**stomp**stomp*"MUUUAAAH"',
    '5': '*stomp**stomp**stomp**stomp**stomp*', 
    '6': '"MUUUAAAH"*stomp**stomp**stomp* *stomp*', 
    '7': '"MUUUAAAH""MUUUAAAH"*stomp**stomp**stomp*',
    '8': '"MUUUAAAH""MUUUAAAH""MUUUAAAH"*stomp**stomp*',
    '9': '"MUUUAAAH""MUUUAAAH""MUUUAAAH""MUUUAAAH"*stomp*',
    '0': '"MUUUAAAH""MUUUAAAH""MUUUAAAH""MUUUAAAH""MUUUAAAH"',
    ' ': '/'
};

// Function to convert text to Moose code.
function textToMoose(text) {
    // Convert the input text to uppercase to match the dictionary keys.
    text = text.toUpperCase();
    // Convert each letter to its Moose code equivalent.
    let mooseCode = text.split('').map(char => MOOSE_CODE_DICT[char] || '').join(' ');
    return mooseCode;
}

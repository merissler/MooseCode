// Set up the observer for the entire document
const observer = new MutationObserver(handleElementChange);

window.onload = function () {
	translateAllText();
	// Start observing the document with the following options
	observer.observe(document.body, {
		childList: true, // Detect additions/removals of child elements
		subtree: true    // Observe changes in all descendant elements as well
	});
}

// Function to run whenever an element is added or modified
function handleElementChange(mutationList) {
    translateAllText();
}

let lastTranslateTime = null;

function translateAllText()
{
    if (Date.now() - lastTranslateTime > 1000)
    {
        lastTranslateTime = Date.now();

        chrome.storage.sync.get(['featureEnabled'], (result) => {
            const featureEnabled = result.featureEnabled || false; // Default to false if not set
            if (featureEnabled) {
                // Feature is enabled, perform your functionality here
                console.log('Feature is enabled. Executing feature functionality...');
                let condition = (text) => text.includes('*stomp*') || text.includes('"MUUUAAAH"');
                let replacementFunction = (text) => translateMooseCode(text);
                replaceAllText(condition, replacementFunction);
            }
        });	
    }
}

function replaceAllText(condition, replacementFunction) {
    // Function to recursively traverse the DOM
    function traverse(node) {
        // If it's a text node
        if (node.nodeType === Node.TEXT_NODE) {
            // Check if the text content meets the condition
            if (condition(node.textContent)) {
                // Create a new element with the HTML code
                const newHtml = replacementFunction(node.textContent);
                const wrapper = document.createElement('span'); // You can change 'span' to any HTML element you want
                wrapper.innerHTML = newHtml; // Set the HTML content

                // Replace the text node with the new HTML element
                node.parentNode.replaceChild(wrapper, node);
            }
        } else {
            // Traverse the child nodes (if any)
            node.childNodes.forEach(traverse);
        }
    }

    // Start traversal from the document body
    traverse(document.body);
}

// Define the Moose Code dictionary
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
    'X': '"MUUUAAAH"*stomp**stomp*"MUUUAAAH"', 'Y': '"MUUUAAAH"*stomp*"MUUUAAAH""MUUUAAAH"',
    'Z': '"MUUUAAAH""MUUUAAAH"*stomp**stomp*',
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

// Create a reverse dictionary for decoding
const MOOSE_TO_TEXT_DICT = Object.fromEntries(Object.entries(MOOSE_CODE_DICT).map(([key, value]) => [value, key]));

// Function to translate Moose code to human-readable text
function translateMooseCode(mooseCode)
{
    let result = "";
    let tokens = splitMooseCode(mooseCode);
    console.log(tokens);
    tokens.forEach((t) =>
    {
        if (t.startsWith('*stomp*') || t.startsWith('"MUUUAAAH"'))
        {
            const words = t.split('/');
            let decodedMessage = [];

            words.forEach(word => {
                const letters = word.split(' ');
                const decodedWord = letters.map(letter => MOOSE_TO_TEXT_DICT[letter] || '').join('');
                decodedMessage.push(decodedWord);
            });

            let translated = decodedMessage.join(' ');
            result +=
            `<p style="background-color: #000 !important; padding: 0.5em 0.8em 0.5em 0.8em !important; border-radius: 5px !important;">
                <span style="color: #0f0 !important; font-family: monospace !important; font-size: 120% !important;">
                    ${translated}
                </span>    
                <span style="color: #ffffff88 !important; font-family: sans-serif !important; font-size: 80% !important;">
                    (Moose Code)
                </span>
            </p>`;
        }
        else {
            result += t;
        }
    });
    
    return result;
}

function splitMooseCode(input) {
    const result = [];
    let section = "";
    let mooseSection = null;

    let tokens = input.split(" ");
    tokens.forEach((t) => {
        if (t.trim().length > 0) // not whitespace
        {
            let t2 = t.replace('"MUUAAAH"', '"MUUUAAAH"');

            let mooseToken = t2.trim().startsWith('*stomp*') || t2.trim().startsWith('"MUUUAAAH"') || t2.trim().startsWith("/");
            if (mooseSection === null)
            {
                mooseSection = mooseToken;
            }
            else if (mooseToken !== mooseSection)
            {
                result.push(section.trim());
                section = "";
                mooseSection = mooseToken;
            }
            section += t2 + " ";
        }
    });
    result.push(section.trim());
    return result;
}

// Counter functionality
let counter = 0;

function incrementCounter() {
    try {
        if (counter < 999) {
            counter++;
            updateCounter();
        }
    } catch (error) {
        handleError(error, 'counterValue');
    }
}

function decrementCounter() {
    try {
        if (counter > -999) {
            counter--;
            updateCounter();
        }
    } catch (error) {
        handleError(error, 'counterValue');
    }
}

function updateCounter() {
    document.getElementById('counterValue').textContent = counter;
}

// Personalized message functionality
function showPersonalizedMessage() {
    try {
        const nameInput = document.getElementById('nameInput');
        const message = document.getElementById('message');
        
        // Add loading state
        message.textContent = 'Generating message...';
        message.style.background = '#f5f5f5';
        message.style.color = '#666';
        
        const name = nameInput.value.trim();
        
        // Simulate async operation
        setTimeout(() => {
            if (name === '') {
                message.textContent = 'Please enter your name!';
                message.style.background = '#ffebee';
                message.style.color = '#c62828';
                nameInput.focus();
            } else {
                const greetings = [
                    'Hello',
                    'Hi',
                    'Welcome',
                    'Great to see you',
                    'Nice to meet you'
                ];
                const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
                message.textContent = `${randomGreeting}, ${name}! 👋`;
                message.style.background = '#e8f0fe';
                message.style.color = '#1a73e8';
            }
        }, 500);
    } catch (error) {
        handleError(error, 'message');
    }
}

// Color changer functionality
let colorTimeout;
function changeColor(color) {
    try {
        clearTimeout(colorTimeout);
        const colors = {
            red: ['#dc3545', '#fff'],
            blue: ['#007bff', '#fff'],
            green: ['#28a745', '#fff']
        };
        
        document.body.style.background = colors[color][0];
        colorTimeout = setTimeout(() => {
            document.body.style.background = '#f0f2f5';
        }, 500);
    } catch (error) {
        console.error('Error changing color:', error);
    }
}

// Accessibility improvements
document.querySelectorAll('.btn').forEach(button => {
    button.setAttribute('role', 'button');
    if (!button.hasAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent.trim());
    }
});

// Error handling
function handleError(error, elementId) {
    console.error('Error:', error);
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = 'An error occurred. Please try again.';
        element.style.background = '#ffebee';
        element.style.color = '#c62828';
    }
}

// Add keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && document.activeElement.id === 'nameInput') {
        showPersonalizedMessage();
    }
});

// Add input validation
const nameInput = document.getElementById('nameInput');
nameInput.addEventListener('input', (event) => {
    const value = event.target.value;
    if (value.length > 30) {
        event.target.value = value.slice(0, 30);
    }
});


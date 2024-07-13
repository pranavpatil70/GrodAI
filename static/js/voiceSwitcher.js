document.addEventListener('DOMContentLoaded', function() {
    // Sample voice IDs and languages for demonstration
    const voiceIds = ['Joanna', 'Matthew', 'Salli', 'Kevin'];
    const languages = [
        { code: 'en-US', name: 'English (US)' },
        { code: 'en-GB', name: 'English (British)' },
        { code: 'es-ES', name: 'Spanish (European)' },
        // Add more languages as needed
    ];

    // Populate voice ID dropdown
    const voiceIdSelect = document.getElementById('voiceId');
    voiceIds.forEach(voiceId => {
        const option = document.createElement('option');
        option.value = voiceId;
        option.textContent = voiceId;
        voiceIdSelect.appendChild(option);
    });

    // Populate language dropdown
    const languageSelect = document.getElementById('language');
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.textContent = language.name;
        languageSelect.appendChild(option);
    });

    // Handle form submission
    const form = document.getElementById('voiceForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting normally
        const selectedVoiceId = voiceIdSelect.value;
        const selectedLanguage = languageSelect.value;
        console.log(`Selected Voice ID: ${selectedVoiceId}`);
        console.log(`Selected Language: ${selectedLanguage}`);
        // Here you can add the logic to use the selected voice ID and language
        // For example, making an API call to AWS Polly with the selected options
    });
});

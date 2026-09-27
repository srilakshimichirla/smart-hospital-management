(() => {
    const form = document.querySelector('#signup-form');
    const message = document.querySelector('#signup-message');
    const submit = document.querySelector('#signup-submit');

    function showMessage(text, isSuccess = false) {
        message.hidden = false;
        message.classList.toggle('success', isSuccess);
        message.textContent = text;
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const values = new FormData(form);
        const username = String(values.get('username')).trim();
        const password = String(values.get('password'));
        const confirmation = String(values.get('confirmPassword'));
        if (password !== confirmation) {
            showMessage('Those passwords do not match. Please check and try again.');
            document.querySelector('#confirm-password').focus();
            return;
        }

        submit.disabled = true;
        submit.textContent = 'Creating account...';
        message.hidden = true;
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role: 'USER' })
            });
            if (!response.ok) {
                const detail = await response.text();
                throw new Error(detail || 'Account creation failed. Please try another username.');
            }

            const loginResponse = await fetch('/login', {
                method: 'POST',
                credentials: 'same-origin',
                redirect: 'follow',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username, password })
            });
            if (loginResponse.redirected && new URL(loginResponse.url).pathname === '/dashboard') {
                window.location.assign('/dashboard');
                return;
            }
            window.location.assign('/login?registered=true');
        } catch (error) {
            showMessage(error.message || 'Unable to create your account. Please try again.');
            submit.disabled = false;
            submit.innerHTML = 'Create account <span aria-hidden="true">&#8594;</span>';
        }
    });
})();
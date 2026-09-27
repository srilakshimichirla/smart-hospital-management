<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#123d36">
    <title>Create account | Carepoint</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/portal.css">
    <script src="/js/signup.js" defer></script>
</head>
<body class="login-page">
<section class="login-intro">
    <a class="brand login-brand" href="/login" aria-label="Carepoint">
        <span class="brand-mark" aria-hidden="true">+</span>
        <span>carepoint<span class="brand-period">.</span><small>HOSPITAL WORKSPACE</small></span>
    </a>
    <div class="login-copy">
        <span class="eyebrow">A BETTER WAY TO WORK TOGETHER</span>
        <h1>Make room for better care.</h1>
        <p>Create your care team account and bring patient details, appointments, and clinical records into one organized workspace.</p>
    </div>
    <div class="login-foot">Secure access for your hospital care team.</div>
</section>
<main class="login-side">
    <section class="login-box">
        <span class="eyebrow" style="color:var(--green)">GET STARTED</span>
        <h2>Create your account</h2>
        <p>Set up your sign-in for the hospital workspace.</p>
        <nav class="auth-switch" aria-label="Account access">
            <a href="/login">Sign in</a>
            <a class="selected" href="/signup" aria-current="page">Create account</a>
        </nav>
        <form id="signup-form">
            <div class="form-group">
                <label for="username">Username</label>
                <input class="form-control" id="username" name="username" type="text" autocomplete="username" minlength="3" maxlength="50" placeholder="Choose a username" required autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input class="form-control" id="password" name="password" type="password" autocomplete="new-password" minlength="8" placeholder="At least 8 characters" required>
            </div>
            <div class="form-group">
                <label for="confirm-password">Confirm password</label>
                <input class="form-control" id="confirm-password" name="confirmPassword" type="password" autocomplete="new-password" minlength="8" placeholder="Enter your password again" required>
            </div>
            <button class="button button-primary" id="signup-submit" type="submit">Create account <span aria-hidden="true">&#8594;</span></button>
        </form>
        <div class="form-hint">Your account will be created with standard care-team access.</div>
        <div class="login-message" id="signup-message" role="alert" hidden></div>
    </section>
</main>
</body>
</html>
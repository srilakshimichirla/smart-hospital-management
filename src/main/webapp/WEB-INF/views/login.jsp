<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#123d36">
    <title>Sign in | Carepoint</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/portal.css">
</head>
<body class="login-page">
<section class="login-intro">
    <a class="brand login-brand" href="/login" aria-label="Carepoint">
        <span class="brand-mark" aria-hidden="true">+</span>
        <span>carepoint<span class="brand-period">.</span><small>HOSPITAL WORKSPACE</small></span>
    </a>
    <div class="login-copy">
        <span class="eyebrow">SMART HOSPITAL MANAGEMENT</span>
        <h1>Better care,<br>beautifully coordinated.</h1>
        <p>One calm place for your care team to coordinate visits, patient details, and clinical records.</p>
    </div>
    <div class="login-foot">A clearer view of care, every day.</div>
</section>
<main class="login-side">
    <section class="login-box">
        <span class="eyebrow" style="color:var(--green)">WELCOME BACK</span>
        <h2>Sign in to your workspace</h2>
        <p>Use your hospital account to continue.</p>
        <nav class="auth-switch" aria-label="Account access">
            <a class="selected" href="/login" aria-current="page">Sign in</a>
            <a href="/signup">Create account</a>
        </nav>
        <form action="/login" method="post">
            <div class="form-group">
                <label for="username">Username</label>
                <input class="form-control" id="username" type="text" name="username" autocomplete="username" placeholder="Your username" required autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input class="form-control" id="password" type="password" name="password" autocomplete="current-password" placeholder="Your password" required>
            </div>
            <button class="button button-primary" type="submit">Sign in <span aria-hidden="true">&#8594;</span></button>
        </form>
        <%
            if (request.getParameter("error") != null) {
        %>
        <div class="login-message" role="alert">The username or password did not match. Try again.</div>
        <%
            }
            if (request.getParameter("logout") != null) {
        %>
        <div class="login-message success" role="status">You have been signed out.</div>
        <%
            }
            if (request.getParameter("registered") != null) {
        %>
        <div class="login-message success" role="status">Your account is ready. Sign in to open your workspace.</div>
        <%
            }
        %>
    </section>
</main>
</body>
</html>
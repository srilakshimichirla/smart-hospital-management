<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#123d36">
    <title>Carepoint | Hospital workspace</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/portal.css">
    <script src="/js/portal.js" defer></script>
</head>
<body class="workspace-page">
<aside class="sidebar" id="sidebar">
    <a class="brand" href="/dashboard" aria-label="Carepoint home">
        <span class="brand-mark" aria-hidden="true">+</span>
        <span>carepoint<span class="brand-period">.</span><small>HOSPITAL WORKSPACE</small></span>
    </a>
    <div class="nav-label">WORKSPACE</div>
    <nav class="menu" aria-label="Main navigation">
        <button class="nav-link active" type="button" data-view="overview"><span class="nav-icon">01</span>Overview</button>
        <button class="nav-link" type="button" data-view="patients"><span class="nav-icon">02</span>Patients</button>
        <button class="nav-link" type="button" data-view="doctors"><span class="nav-icon">03</span>Doctors</button>
        <button class="nav-link" type="button" data-view="appointments"><span class="nav-icon">04</span>Appointments</button>
        <button class="nav-link" type="button" data-view="records"><span class="nav-icon">05</span>Medical records</button>
    </nav>
    <div class="sidebar-bottom">
        <div class="sidebar-note"><span class="online-dot"></span><span>Clinic systems online</span></div>
        <form action="/logout" method="post">
            <button class="logout-button" type="submit"><span aria-hidden="true">&#8594;</span> Logout</button>
        </form>
    </div>
</aside>

<main class="main">
    <header class="topbar">
        <button class="mobile-menu" id="mobile-menu" type="button" aria-label="Open navigation" aria-expanded="false">&#9776;</button>
        <div class="breadcrumb"><span>Carepoint</span><span class="crumb-divider">/</span><strong id="breadcrumb-current">Overview</strong></div>
        <div class="topbar-right">
            <span class="today-label" id="today-label"></span>
            <span class="profile-avatar" aria-hidden="true">CP</span>
            <span class="profile-name">Care team</span>
        </div>
    </header>
    <div class="content" id="page-content" aria-live="polite">
        <div class="loading-state"><span class="loader"></span>Loading hospital data</div>
    </div>
</main>

<dialog class="form-dialog" id="entity-dialog" aria-labelledby="dialog-title">
    <form id="entity-form" method="dialog">
        <div class="dialog-heading">
            <div><span class="eyebrow" id="dialog-eyebrow">WORKSPACE</span><h2 id="dialog-title">Add record</h2></div>
            <button class="icon-button" id="close-dialog" type="button" aria-label="Close dialog">&#215;</button>
        </div>
        <div class="form-grid" id="dialog-fields"></div>
        <div class="dialog-actions">
            <button class="button button-quiet" id="cancel-dialog" type="button">Cancel</button>
            <button class="button button-primary" id="save-record" type="submit">Save record</button>
        </div>
    </form>
</dialog>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
</body>
</html>
export function initNav() {
    $(() => {
        const $navPlaceholder = $('#nav-placeholder');
        if (!$navPlaceholder.length) return;

        const navHtml = `
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="index.html">Cardnado</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link btn btn-primary text-white" id="nav-add" href="add-card.html">Add card</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link btn btn-success text-white" id="nav-support" href="support.html">Support & Info</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;

        $navPlaceholder.html(navHtml);
    });
}

initNav();
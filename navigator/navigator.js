const Sections = {};
const DefaultOptions = {
    out_time: 0,
    in_time: 0,
    hang_multiplier: 1
}

// Ensure options
if (!(typeof NavigatorOptions === 'undefined')) {
    for (let key of Object.keys(DefaultOptions)) {
        if (NavigatorOptions[key] === undefined) NavigatorOptions[key] = DefaultOptions[key];
    }
}

// Insert visibility style
const style = document.createElement('style');
document.head.append(style);
style.innerHTML = `section:not(.focused){display: none}`;

// Register sections
for (const section of [...document.querySelectorAll('section[name]')]) {
    Sections[section.getAttribute('name')] = section;
}

// Register handlers
for (const button of [...document.querySelectorAll('button[to]')]) {
    button.addEventListener('click', () => NavigateToSection(button.getAttribute('to')));
}

// Link buttons
for (const button of [...document.querySelectorAll('button[href]')]) {
    button.addEventListener('click', () => window.location.href = button.getAttribute('href'));
}

/**
 * @param {string} section Section name
 * @param {boolean} instant Force an instant transition
 */
function NavigateToSection(section, instant) {

    const Options = { ...((typeof NavigatorOptions === 'undefined') ? DefaultOptions : NavigatorOptions) };
    if (instant) {
        Options['in_time'] = 0;
        Options['out_time'] = 0;
        Options['hang_multiplier'] = 0;
    }

    if (!Sections[section]) throw new Error(`Unregistered section '${section}'`);
    section = Sections[section];

    const current = document.querySelector('section.focused');
    if (current) {
        if (current === section) return;

        current.classList.remove('in');
        current.classList.add('out');
        setTimeout(() => current.classList.remove('focused', 'out'), Options.out_time);
    }

    setTimeout(() => section.classList.add('focused', 'in'), Options.out_time * Options.hang_multiplier);

}

// Focus main if exists
if (Sections['main']) NavigateToSection('main', true);
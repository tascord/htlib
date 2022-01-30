let transition = false;
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
async function NavigateToSection(section, instant) {

    if (transition && !instant) return;
    transition = true;

    const Options = { ...((typeof NavigatorOptions === 'undefined') ? DefaultOptions : NavigatorOptions) };
    if (instant) {
        Options['in_time'] = 0;
        Options['out_time'] = 0;
        Options['hang_multiplier'] = 0;
    }

    const prev_overflow = document.body.style.overflowY;
    const prev_transition = document.body.style.transition;
    const prev_max_height = document.body.style.maxHeight;

    if (!instant && window.scrollY > 0) {

        window.scroll({ top: 0, behavior: "smooth" });
        document.body.style.overflowY = 'hidden';

        await new Promise(resolve => {
            let height = document.body.getBoundingClientRect().height;
            let i = setInterval(() => {

                document.body.style.transition = `max-height ${Options['out_time']}s ease-in-out`;
                document.body.style.maxHeight = --height + 'px';

                if (window.scrollY > 0) return;
                console.log('resolved');
                clearInterval(i);
                resolve();

            }, 50)
        })

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

    setTimeout(() => {
        
        section.classList.add('focused', 'in');
        transition = false;
        
        document.body.style.overflowY = prev_overflow;
        document.body.style.transition = prev_transition;
        document.body.style.maxHeight = prev_max_height;

    }, Options.out_time * Options.hang_multiplier);

}

// Focus main if exists
if (Sections['main']) NavigateToSection('main', true);
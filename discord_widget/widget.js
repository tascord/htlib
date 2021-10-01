for (const widget of [...document.querySelectorAll('discord[guild]')]) {

    fetch(`https://discord.com/api/guilds/${widget.getAttribute('guild')}/widget.json`)
        .then((response) => {

            let style = document.createElement('link');
            document.head.appendChild(style);

            style.rel = 'stylesheet';
            style.href = 'style.css';

            if (!response.ok) throw new Error("Unable to reach Discord.");
            response.json()
                .then((data) => {

                    const discord_logo = document.createElement('img');
                    const server_title = document.createElement('h2');
                    const server_count = document.createElement('span');
                    const members_icon = document.createElement('img');

                    widget.appendChild(discord_logo);
                    widget.appendChild(server_title);
                    widget.appendChild(server_count);

                    server_title.innerText = data.name;
                    server_count.innerText = data.presence_count;

                    server_count.prepend(members_icon);

                    members_icon.src = 'user.svg';
                    discord_logo.src = 'widget_logo.svg';

                    widget.addEventListener('click', () => {
                        let invite = (widget.hasAttribute('invite') ? ('https://discord.gg/' + widget.getAttribute('invite')) : data.instant_invite);
                        if(!invite) return console.warn(`Server '${widget.getAttribute('guild')}' has no invite linked.`);
                        window.open(invite, `Join ${data.name}!`, 'menubar=no,resizable=no,scrollbars=no,status=no,location=no,height=600,width=500')
                    })


                })
        })
}
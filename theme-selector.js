function get_system_theme(win = null) {
    /*
        Function for getting the system color scheme
    */

    if (win == null) {
        win = window
    }

    theme = "dark";
    if (win.matchMedia("(prefers-color-scheme: light)").matches) {
        theme = "light";
    }

    return theme;
}

function toggle_saved_theme() {
    /*
        Function for toggling between the two themes saved to local storage
        Returns:
            Value stored in local storage
    */

    // Gets Current Value
    if (localStorage.getItem("theme")) {
        theme = localStorage.getItem("theme");
    }
    else {
        theme = get_system_theme();
    }

    // Sets the stored value as the opposite
    if (theme === "light") {
        localStorage.setItem("theme", "dark");
    }
    else {
        localStorage.setItem("theme", "light");
    }

    return localStorage.getItem("theme");
}

function refresh_theme(doc = null) {
    console.log('switching', doc)

    if (doc == null) {
        doc = document
    }

    let theme = localStorage.getItem("theme") || get_system_theme()

    doc.documentElement.classList.remove('light')
    doc.documentElement.classList.remove('dark')
    doc.documentElement.classList.add(theme)
    doc.documentElement.style.colorScheme = theme

    let iframes = doc.getElementsByTagName('iframe')
    for (let iframe of iframes) {
        console.log('iframe', iframe)
        console.log('iframe document', iframe.contentDocument)
        refresh_theme(iframe.contentDocument)
    }
}

function toggle_theme(doc = null) {
    /*
        Toggles the current theme used
    */

    if (doc == null) {
        doc = document
    }

   stored_theme = toggle_saved_theme();

    console.log('stored_theme', stored_theme)

    refresh_theme(doc);
}

function remove_theme() {
    /*
        Function for removing theme from local storage
    */
    if (localStorage.getItem("theme")) {
        if (get_system_theme() != localStorage.getItem("theme")) {
            refresh_theme();
        }
        localStorage.removeItem("theme");
    }
}

window.matchMedia('(prefers-color-scheme: dark)')
    /*
        This makes it such that if a user changes the theme on their
        browser and they have a preferred theme, the page maintains its prefered theme. 
    */
    .addEventListener("change", event => {
        if (get_system_theme() != localStorage.getItem("theme")) {
            toggle_theme(); // Switches Theme every time the prefered color gets updated
        }
    }
)

let themeSwitcher = document.getElementById('theme-selector')

refresh_theme()

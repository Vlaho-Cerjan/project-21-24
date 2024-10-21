export const LayoutStrings = {
    en: {
        projectTitle: "Project Content Management System",
        fontSize: "Font Size",
        setMode: "Set Mode",
        setLanguage: "Set Language",
        setFontSize: "Set Font Size",
        allPlaylists: "All Playlists",
    },
    es: {
        projectTitle: "Sistema de Gestión de Contenido de Project",
        fontSize: "Tamaño de Fuente",
        setMode: "Establecer Modo",
        setLanguage: "Establecer Idioma",
        setFontSize: "Establecer Tamaño de Fuente",
        allPlaylists: "Todas las Listas",
    }
}

/*

Featured Carousel

The Featured Carousel is a single container at the top of the page with up to 20 items. Each item must include:

Background image (780px x 560px JPG @ 90%)
Logo (384px x 96px transparent PNG)
Title (Max 64 chars)
Description (Max 128 chars)
Playlist ID (UUID)
Order (int) (The horizontal order of the item)

The Featured Carousel items can be created, edited, re-ordered and deleted.

Content Row Container

A Content Row is one of many containers on the page, underneath the Featured Carousel. A Content Row can be created, edited, re-ordered and deleted. The Content Row includes:

Title (Max 64 chars)
Order (int) (The vertical order of the row on the page)
Data (array) (The playlist items)

Content Row Data

The above Content Row Container contains and array of playlist items. Each item can be created, edited, re-ordered and deleted. Each item contains:

Background image (410px x 230px JPG @ 90%)
Title (Taken from the actual playlist, but can be overridden)
Type (String) (e.g. music, viral, sport. Taken from the actual playlist, but can be overridden)
Playlist ID (UUID)
Order (int) (The horizontal order of the item)

*/
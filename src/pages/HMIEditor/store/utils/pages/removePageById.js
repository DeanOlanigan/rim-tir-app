export function removePageById(pages, id) {
    const newPages = { ...pages };
    delete newPages[id];
    return newPages;
}

export const findActiveMenuKey = (menus, activePath) => {
    for (let index = 0; index < menus.length; index++) {
        const { id, path, children } = menus[index];
        if (path === activePath) {
            return id;
        } else if (children?.length) {
            const activeMenuKey = findActiveMenuKey(children, activePath);
            if (activeMenuKey) {
                return activeMenuKey;
            }
        }
    }
};

export const findMenu = (menus, primaryKey) => {
    for (let index = 0; index < menus.length; index++) {
        const { id, children } = menus[index];
        if (primaryKey === id) {
            return menus[index];
        } else if (children?.length) {
            const menu = findMenu(children, primaryKey);
            if (menu) {
                return menu;
            }
        }
    }
};

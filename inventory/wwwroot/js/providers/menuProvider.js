const BASE_URL = '/Menu';

const MENUS = {
    getAll: async () => {
        const res = await fetch(`${BASE_URL}/GetMenus`);
        let data;
        if (res.ok) {
            data = await res.json();
        }
        return { status: res.ok, data };
    },
    loadView: async (menu) => {
        const res = await fetch(`${BASE_URL}/MenuRender?menu=${menu}`);
        return res;
    }
}

export default MENUS;
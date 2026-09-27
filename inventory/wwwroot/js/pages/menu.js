import MENU from '../providers/menuProvider.js';
import Catalog from './catalog.js';
class Menus {
    constructor() {
        console.log('Menus initialized');
        this.menus = null;
        this.init();
    }

    async init() {
        await this.getMenus();
        this.formatMenus();
        this.events();
    }

    formatMenus() {
        let html = this.menus.sort((m1, m2) => m1.order - m2.order).map(m => {
            if (this.menus.some(pm => pm.menuParentId == m.menuId)) {
                return `
                <div class="menu-group">
                    <button type="button" class="menu-toggle w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.03)]" aria-expanded="false">
                        <span class="flex items-center gap-3"><i class="fas ${m.icon} w-4"></i><span>${m.name}</span></span>
                        <i class="fas fa-chevron-right transform transition-transform duration-150"></i>
                    </button>
                    <ul class="submenu mt-1 ml-8 space-y-1 overflow-hidden max-h-0 transition-[max-height] duration-200" style="list-style:none;padding-left:0;">
                        ${this.menus.filter(sm => sm.menuParentId == m.menuId).sort((sm1,sm2) => sm1.order - sm2.order).map(sm => `
                        <li>
                            <a href="#" data-filename="${sm.url}" class="menu-item flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.03)]">${sm.name}</a>
                        </li>
                    `).join('')
                    }
                    </ul>
                </div>
                `;
            } else if (m.menuParentId == 0) {
                return `
                    <a href="#" data-filename="${m.url}" class="menu-item flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.03)]">
                        <i class="fas ${m.icon} w-4"></i>
                        <span>${m.name}</span>
                    </a>
                `;
            } else {
                return '';
            }
        }).join('');
        $('.nav-menus').html(html);
    }

    events() {
        $(document).ready(async () => {
            console.log('Inicialización');
            let menuCurrent = localStorage.getItem('menu');
            if (!Boolean(menuCurrent)) localStorage.setItem('menu', 'dashboard');
            await this.view(localStorage.getItem('menu'));

            $('.nav-menus').on('click', '.menu-item', async (e) => {
                let file = $(e.currentTarget).attr('data-filename');
                const menu = file.split('/')[1].split('.')[0];
                localStorage.setItem('menu', menu);
                await this.view(menu);
            }); 
        });
    }

    async getMenus() {
        try {
            const { status, data } = await MENU.getAll();
            if (status) {
                this.menus = data;
            }
        } catch (e) {
            console.error(e);
        }
    }

    async view(menu) {
        try {
            const res = await MENU.loadView(menu);
            if (!res.ok) {
                console.error('Menu view load failed', res.status);
                return;
            }

            const html = await res.text();
            
            $('.nameMenu').text(
                menu == 'brands' ? 'Marcas' :
                    menu == 'models' ? 'Modelos' :
                        menu == 'suppliers' ? 'Proveedores' :
                            menu == 'categories' ? 'Categorias' :
                                menu == 'configuration' ? 'Configuración' :
                                    menu == 'dashboard' ? 'Dashboard' :
                                        menu == 'consumables' ? 'Consumibles' : 
                                            menu == 'typeEquipment' ? 'Tipo de equipos' : 'Productos'
            );

            $('.main-content').html(html);

            // initialize shared catalog singleton (reads data-menu from injected partial)
            await Catalog.init();

            // load page module and initialize it
            let page = await import(`/js/pages/${menu}.js`);
            const PageClass = page.default;
            const p = new PageClass();
            if (typeof p.init === 'function') await p.init();
        } catch (e) {
            console.error(e);
        }
    }
}

new Menus();
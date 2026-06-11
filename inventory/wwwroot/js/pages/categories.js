import Catalog from './catalog.js';

class Category {
    constructor() {
        console.log('Categories initialized');
        this.catalog = Catalog;
        this.data = null;
        this.category = null;
    }

    async init() {
        this.data = this.catalog.data || [];
        this.html();
        this.events();
    }

    html() {
        const html = this.data.map(c => `
            <tr>
                <th>
                    <label>
                        <input type="checkbox" class="checkbox" />
                    </label>
                </th>
                <td>
                    <div class="flex items-center gap-3">
                        <div>${c.vNameCategory}</div>
                    </div>
                </td>
                <td>
                    <div>
                        ${c.bActive ?
                            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>`:
                            `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            `
                        }
                    </div>
                </td>
                <th>
                    <button class="btn btn-ghost btn-xs btnEdit" data-info='{ "id": ${c.iCategoryId}, "name": "${c.vNameCategory}", "active": ${c.bActive} }' onclick="mdlChange.showModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                    <button class="btn btn-ghost btn-xs btnActive" data-active= '{ "id": ${c.iCategoryId}, "name": "${c.vNameCategory}", "active": ${c.bActive} }' onclick="mdlActive.showModal()">
                        ${c.bActive ?
                            `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            `:
                            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            `
                        }
                    </button>
                </th>
            </tr>
        `
        ).join('');

        $('.catalog-data').html(html);
    }

    events() {
        $('.btnAdd').click(() => {
            this.category = null;
            $('.frm-name').val('');
            $('.mdl-title').text(Boolean(this.category?.id) ? 'Editar' : 'Agregar' + ' categoría');
        });

        $(document).on('click', '.btnEdit', (e) => {
            const info = $(e.currentTarget).data('info');
            this.category = { ...info };
            $('.frm-name').val(this.category.name);
            $('.mdl-title').text('Editar categoría');
        });

        $(document).on('click', '.btnActive', async (e) => {
            const info = $(e.currentTarget).data('active');
            this.category = { ...info };
            $('.mdl-title-active').text(this.category.active ? 'Desactivar' : 'Activar' + ' categoría');
            $('.question-active').text(`
               ¿Desea ${this.category.active ? 'desactivar' : 'activar'} esta categoría? 
            `);
        });

        $('.btnSaveChange').click(async () => {
            const name = $('.frm-name').val();
            let res = false;

            if (Boolean(this.category?.id)) {
                res = await this.catalog.putCatalog(this.catalog.code, this.category.id, name, 0);
            } else {
                res = await this.catalog.postCatalog(this.catalog.code, name, 0);
            }

            if (res) {
                $('#mdlChange')[0].close();
                await this.catalog.getData(this.catalog.code);
                this.data = this.catalog.data;
                this.html();
            }
        });

        $('.btnSaveActive').click(async () => {
            const res = await this.catalog.activeData(this.catalog.code, this.category.id, !this.category.active);
            if (res) {
                $('#mdlActive')[0].close();
                await this.catalog.getData(this.catalog.code);
                this.data = this.catalog.data;
                this.html();
            }
        });

        $('.filter-catalog').click((e) => {
            const status = $(e.currentTarget).data('status');
            if (status != 'all') {
                this.data = [...this.catalog.data.filter(d => d.bActive == (status == 'active' ? true : false))]
            } else {
                this.data = [...this.catalog.data];
            }
            this.html();
        });
    }
}

export default Category;
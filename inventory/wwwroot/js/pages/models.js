import Catalog from './catalog.js';
import CATALOG from '../providers/catalogProvider.js';
import NOTIFICATIONS from '../utils/notifications.js';

class Model {
    constructor() {
        console.log('Models initialized');
        this.catalog = Catalog;
        this.data = null;
        this.model = null;
    }

    async init() {
        this.data = this.catalog.data || [];
        await this.getBrands();
        this.html();
        this.events();
    }

    html() {
        const html = this.data.map(b => `
            <tr>
                <th>
                    <label>
                        <input type="checkbox" class="checkbox" />
                    </label>
                </th>
                <td>
                    <div class="flex items-center gap-3">
                        <div>${b.vNameModel}</div>
                    </div>
                </td>
                <td>
                    <div class="flex items-center gap-3">
                        <div>${b.vNameBrand}</div>
                    </div>
                </td>
                <td>
                    <div>
                        ${b.bActive ?
                            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>`:
                            `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            `
                        }
                    </div>
                </td>
                <th>
                    <button class="btn btn-ghost btn-xs btnEdit" data-info='{ "id": ${b.iModelId}, "name": "${b.vNameModel}", "brandId": ${b.iBrandId}, "active": ${b.bActive} }' onclick="mdlChange.showModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                    <button class="btn btn-ghost btn-xs btnActive" data-active= '{ "id": ${b.iModelId}, "name": "${b.vNameModel}", "active": ${b.bActive} }' onclick="mdlActive.showModal()">
                        ${b.bActive ?
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
        
        const listBrands = this.brands?.map(b => {
            return `<option value="${b.iBrandId}">${b.vNameBrand}</option>`
        }).join('');
        
        $('.catalog-data').html(html);
        $('.list-brands').html(listBrands);
    }

    events() {
        //Método keyup del input buscador
        $('.search-catalog').keyup((e) => {
            const word = $('.search-catalog').val();
            this.data = [...this.catalog.data.filter(c => (c.vNameModel.includes(word) || c.vNameBrand.includes(word)))];
            this.html();
        });

        $('.btnAdd').click(() => {
            this.model = null;
            $('.frm-name').val('');
            $('.mdl-title').text(Boolean(this.model?.id) ? 'Editar' : 'Agregar' + ' modelo');
        });

        $(document).on('click', '.btnEdit', (e) => {
            const info = $(e.currentTarget).data('info');
            this.model = { ...info };
            $('.frm-name').val(this.model.name);
            $('.list-brands').val(this.model.brandId);
            $('.mdl-title').text('Editar modelo');
        });

        $(document).on('click', '.btnActive', async (e) => {
            const info = $(e.currentTarget).data('active');
            this.model = { ...info };
            $('.mdl-title-active').text(this.model.active ? 'Desactivar' : 'Activar' + ' modelo');
            $('.question-active').text(`
               ¿Desea ${this.model.active ? 'desactivar' : 'activar'} este modelo? 
            `);
        });

        $('.btnSaveChange').click(async () => {
            const name = $('.frm-name').val();
            const brandId = $('.list-brands').val();
            let res = false;

            // validate form
            if (!name || String(name).trim() === '') {
                NOTIFICATIONS.toast('warning', 'Debe llenar el formulario');
                return;
            }
            if (!brandId) {
                NOTIFICATIONS.toast('warning', 'Seleccione una marca');
                return;
            }

            if (Boolean(this.model?.id)) {
                res = await this.catalog.putCatalog(this.catalog.code, this.model.id, name, brandId);
            } else {
                res = await this.catalog.postCatalog(this.catalog.code, name, brandId);
            }

            if (res) {
                $('#mdlChange')[0].close();
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

        $('.btnSaveActive').click(async () => {
            const res = await this.catalog.activeData(this.catalog.code, this.model.id, !this.model.active);
            if (res) {
                $('#mdlActive')[0].close();
                await this.catalog.getData(this.catalog.code);
                this.data = this.catalog.data;
                this.html();
            }
        });
    }

    async getBrands() {
        try {
            const res = await CATALOG.getCatalog('brands');
            if (res.status) {
                this.brands = [...res.data];
            }
        } catch (e) {
            console.error(e);
        }
    }
}

export default Model;
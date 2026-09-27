import Catalog from './catalog.js';
import NOTIFICATIONS from '../utils/notifications.js';

class Supplier {
    constructor() {
        console.log('Suppliers initialized');
        this.catalog = Catalog;
        this.data = null;
        this.supplier = null;
        this.ids = [];
        this.active = null;
    }

    async init() {
        this.data = this.catalog.data || [];
        this.html();
        this.events();
    }

    html() {
        const html = this.data.map(s => `
            <tr>
                <th>
                    <label>
                        <input type="checkbox" class="supplierIds" data-select='{ "id": ${s.iSupplierId}, "active": ${s.bActive} }' />
                    </label>
                </th>
                <td>
                    <div class="flex items-center gap-3">
                        <div>${s.vName}</div>
                    </div>
                </td>
                <td>
                    <div>
                        ${s.bActive ?
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
                    <button class="btn btn-ghost btn-xs btnEdit" data-info='{ "id": ${s.iSupplierId}, "name": "${s.vName}", "active": ${s.bActive} }' onclick="mdlChange.showModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                    <button class="btn btn-ghost btn-xs btnActive" data-active= '{ "id": ${s.iSupplierId}, "name": "${s.vName}", "active": ${s.bActive} }' onclick="mdlActive.showModal()">
                        ${s.bActive ?
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
        //Método keyup del input buscador
        $('.search-catalog').keyup((e) => {
            const word = $('.search-catalog').val();
            this.data = [...this.catalog.data.filter(c => c.vName.includes(word))];
            this.html();
        });

        $('.btnAdd').click(() => {
            this.supplier = null;
            $('.frm-name').val('');
            $('.mdl-title').text(Boolean(this.supplier?.id) ? 'Editar' : 'Agregar' + ' proveedor');
        });

        $(document).on('click', '.btnEdit', (e) => {
            const info = $(e.currentTarget).data('info');
            this.supplier = { ...info };
            $('.frm-name').val(this.supplier.name);
            $('.mdl-title').text('Editar proveedor');
        });

        //Método clic para activar múltiples registros
        $(document)
            .off('click', '.btnSelectActivate,.btnSelectDeactivate')
            .on('click', '.btnSelectActivate,.btnSelectDeactivate', (e) => {
            let classElement = $(e.currentTarget).attr('class');
            this.active = classElement.includes('btnSelectActivate') ? true : false;
            let selected = [];

            $('.supplierIds:checked').each((i, el) => {
                const raw = $(el).attr('data-select');
                if (!raw) return;
                const info = JSON.parse(raw);
                if (info) selected.push(info);
            });
            console.log(selected);
            if (selected.length === 0) {
                NOTIFICATIONS.toast('warning', 'Seleccione al menos un proveedor');
                return;
            }

            if (selected.some(s => s.active == this.active)) {
                $('.mdl-title-message').text('Activar o desactivar registros');
                $('.message-description').text(`
                    Para activar registros, solo seleccione registros inactivos y para
                    desactivar registros, solo seleccione registros activos.
                `);
                $('#mdlMessage')[0].show();
                return;
            }

            this.ids = [...selected.map(s => s.id)];

            $('.mdl-title-active').text(classElement.includes('btnSelectActivate') ? 'Activar proveedores' : 'Desactivar proveedores');
            $('.question-active').text(`¿Desea ${classElement.includes('btnSelectActivate') ? 'activar' : 'desactivar'} esto(s) proveedor(s)?`);
            $('#mdlActive')[0].show();
        });

        $(document).on('click', '.btnActive', async (e) => {
            const info = $(e.currentTarget).data('active');
            this.supplier = { ...info };
            $('.mdl-title-active').text(this.supplier.active ? 'Desactivar' : 'Activar' + ' proveedor');
            $('.question-active').text(`
               ¿Desea ${this.supplier.active ? 'desactivar' : 'activar'} este proveedor? 
            `);
        });

        $('.btnSaveChange').click(async () => {
            const name = $('.frm-name').val();
            let res = false;
            
            if (!Boolean(name)) {
                NOTIFICATIONS.toast('warning', 'Debe llenar el formulario');
                return;
            };
            
            if (Boolean(this.supplier?.id)) {
                res = await this.catalog.putCatalog(this.catalog.code, this.supplier.id, name, 0);
            } else {
                res = await this.catalog.postCatalog(this.catalog.code, name, 0);
            }

            if (res) {
                $('#mdlChange')[0].close();
                await this.catalog.getData(this.catalog.code);
                this.data = this.catalog.data;
                this.ids = [];
                this.html();
            } else {
                NOTIFICATIONS.toast('warning', 'Este nombre de proveedor ya existe');
            }
        });

        //Método clic del botón Aceptar para activar o desactivar registros
        $('.btnSaveActive').click(async () => {
            const res = await this.catalog.activeData(
                this.catalog.code,
                this.ids.length == 0 ? this.supplier?.id.toString() : this.ids.join(','),
                this.ids.length == 0 ? !this.supplier?.active : this.active
            );
            if (res) {
                $('#mdlActive')[0].close();
                await this.catalog.getData(this.catalog.code);
                this.data = [...this.catalog.data];
                this.ids = [];
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

export default Supplier;

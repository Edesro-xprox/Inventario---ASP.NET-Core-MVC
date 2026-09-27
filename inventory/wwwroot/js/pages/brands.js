import Catalog from './catalog.js';
import NOTIFICATIONS from '../utils/notifications.js';

class Brand {
    constructor() {
        console.log('Brand initialized');
        this.catalog = Catalog;
        this.data = null; //arreglo de objetos de la data general
        this.brand = null; //objeto de un solo registro
        this.ids = []; //arreglo de id de los registros
        this.active = null //estado activo o inactivo de la data en general
    }

    async init() {
        this.data = [...this.catalog.data.filter(c => c.bActive)] || [];
        this.html(); //metodo para generar el html
        this.events(); //metodo de eventos
    }

    html() {
        const html = this.data?.map(b => `
            <tr>
                <th>
                    <label>
                        <input type="checkbox" class="brandIds" data-select='{ "id": ${b.iBrandId}, "active": ${b.bActive} }' />
                    </label>
                </th>
                <td>
                    <div class="flex items-center gap-3">
                        <div>${b.vName}</div>
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
                    <button class="btn btn-ghost btn-xs btnEdit" data-info='{ "id": ${b.iBrandId}, "name": "${b.vName}", "active": ${b.bActive} }', onclick="mdlChange.showModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0F1724" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                    <button class="btn btn-ghost btn-xs btnActive" data-active= '{ "id": ${b.iBrandId}, "name": "${b.vName}", "active": ${b.bActive} }' onclick="mdlActive.showModal()">
                        ${b.bActive ?
                            `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0F1724" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            `:
                            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0F1724" class="size-6">
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

        //Método clic del botón Agregar con ícono +
        $('.btnAdd').click(() => {
            this.brand = null;
            $('.frm-name').val('');
            $('.mdl-title').text(this.brand?.id ? 'Editar ' : 'Agregar ' + 'marca');
        });

        //Delegación del evento click para la edición de regsitros
        $(document).on('click','.btnEdit', (e) => {
            const info = $(e.currentTarget).data('info');
            this.brand = {...info}
            $('.frm-name').val(this.brand.name);
            $('.mdl-title').text('Editar marca');
        });

        //Delegación del evento click para activar o desactivar registros
        $(document).on('click', '.btnActive', async (e) => {
            const info = $(e.currentTarget).data('active');
            this.brand = { ...info };
            console.log(this.brand);
            $('.mdl-title-active').text(this.brand.active ? 'Desactivar' : 'Activar' + ' marca');
            $('.question-active').text(`
               ¿Desea ${this.brand.active ? 'desactivar' : 'activar'} esta marca? 
            `);
        });

        //Método clic para activar múltiples registros
        $(document)
            .off('click', '.btnSelectActivate,.btnSelectDeactivate')
            .on('click', '.btnSelectActivate,.btnSelectDeactivate', (e) => {
            let classElement = $(e.currentTarget).attr('class');
            this.active = classElement.includes('btnSelectActivate') ? true : false;
            let selected = [];

            $('.brandIds:checked').each((i, el) => {
                const raw = $(el).attr('data-select');
                if (!raw) return;
                const info = JSON.parse(raw);
                if (info) selected.push(info);
            });
            console.log(selected);
            if (selected.length === 0) {
                NOTIFICATIONS.toast('warning', 'Seleccione al menos una marca');
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

            $('.mdl-title-active').text(classElement.includes('btnSelectActivate') ? 'Activar marcas' : 'Desactivar marcas');
            $('.question-active').text(`¿Desea ${classElement.includes('btnSelectActivate') ? 'activar' : 'desactivar'} esta(s) marca(s)?`);
            $('#mdlActive')[0].show();
        });

        //Método clic del botón Guardar cambios de los registros
        $('.btnSaveChange').click(async () => {
            const name = $('.frm-name').val();
            // validate form
            if (!name || String(name).trim() === '') {
                NOTIFICATIONS.toast('warning', 'Debe llenar el formulario');
                return;
            }

            let res = false;
            
            if (Boolean(this.brand?.id)) {
                res = await this.catalog.putCatalog(this.catalog.code, this.brand.id, name, 0);
            } else {
                res = await this.catalog.postCatalog(this.catalog.code, name, 0);
            }
            
            if (res) {
                $('#mdlChange')[0].close();
                await this.catalog.getData(this.catalog.code);
                this.data = [...this.catalog.data];
                this.ids = null;
                this.html();
            } else {
                NOTIFICATIONS.toast('warning', 'Este nombre de marca ya existe');
            }
        });

        //Método clic del botón Aceptar para activar o desactivar registros
        $('.btnSaveActive').click(async () => {
            const res = await this.catalog.activeData(
                this.catalog.code,
                this.ids?.length == 0 ? this.brand?.id.toString() : this.ids.join(','),
                this.ids?.length == 0 ? !this.brand?.active : this.active
            );
            if (res) {
                $('#mdlActive')[0].close();
                await this.catalog.getData(this.catalog.code);
                this.data = [...this.catalog.data];
                this.ids = [];
                this.html();
            }
        });

        //Método clic para el input de buscador
        $('.filter-catalog').click((e) => {
            const status = $(e.currentTarget).data('status');
            console.log(status);
            if (status != 'all') {
                this.data = [...this.catalog.data.filter(d => d.bActive == (status == 'active' ? true : false))]
            } else {
                this.data = [...this.catalog.data];
            }
            this.html();
        });
    }
}

export default Brand;
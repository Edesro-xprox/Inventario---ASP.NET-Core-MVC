import Catalog from './catalog.js';
import NOTIFICATIONS from '../utils/notifications.js';
class TypeEquipment {
    constructor() {
        console.log('TypeEquipment initialized');
        this.catalog = Catalog;
        this.data = null;
        this.typeEquipment = null;
        this.ids = []; //arreglo de id de los registros
        this.active = null //estado activo o inactivo de la data en general
        this.init();
    }

    init() {
        this.data = [...this.catalog.data.filter(c => c.bActive)] || [];
        this.html();
        this.events();
    }

    html() {
        const html = this.data?.map(t => `
            <tr>
                <th>
                    <label>
                        <input type="checkbox" class="typeEquipmentIds" data-select='{ "id": ${t.iTypeEquipmentId}, "active": ${t.bActive} }' />
                    </label>
                </th>
                <td>
                    <div class="flex items-center gap-3">
                        <div>${t.vName}</div>
                    </div>
                </td>
                <td>
                    <div class="flex items-center gap-3">
                        <div>${t.vPrefix}</div>
                    </div>
                </td>
                <td>
                    <div class="flex items-center gap-3">
                        <div>${t.bPrefixEdit ? 'SI' : 'NO'}</div>
                    </div>
                </td>
                <td>
                    <div class="flex items-center gap-3">
                        <div>${t.iStockMin}</div>
                    </div>
                </td>
                <td>
                    <div class="flex items-center gap-3">
                        <div>${t.iStockMax}</div>
                    </div>
                </td>
                <td>
                    <div>
                        ${t.bActive ?
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
                    <button class="btn btn-ghost btn-xs btnEdit" data-info='{ "id": ${t.iTypeEquipmentId}, "name": "${t.vNameTypeEquipment}", "prefix": "${t.vPrefix}", "prefixEdit": ${t.bPrefixEdit}, "stockMin":${t.iStockMin}, "stockMax": ${t.iStockMax}, "active": ${t.bActive} }', onclick="mdlChange.showModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0F1724" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                    <button class="btn btn-ghost btn-xs btnActive" data-active= '{ "id": ${t.iTypeEquipmentId}, "name": "${t.vNameTypeEquipment}", "active": ${t.bActive} }' onclick="mdlActive.showModal()">
                        ${t.bActive ?
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
        `);

        $('.catalog-data').html(html);
    }

    events() {
        //Método keyup del input buscador
        $('.search-catalog').keyup((e) => {
            const word = $('.search-catalog').val();
            this.data = [...this.catalog.data.filter(c => c.vName.includes(word))];
            this.html();
        });

        $('.btnAddEquipment').click((e) => {
            $('.frm-name').val('');
            $('.frm-typeEquipment-prefix').val('');
            $('.frm-typeEquipment-editPrefix').val(null);
            $('.frm-typeEquipment-stockMin').val(null);
            $('.frm-typeEquipment-stockMax').val(null);
            $('.mdl-title').text(Boolean(this.typeEquipment?.id) ? 'Editar' : 'Agregar' + ' tipo de equipo');
        });

        $(document).on('click', '.btnEdit', (e) => {
            const info = $(e.currentTarget).data('info');
            this.typeEquipment = { ...info }
            $('.frm-name').val(this.typeEquipment.name);
            $('.frm-typeEquipment-prefix').val(this.typeEquipment.prefix);
            $('.frm-typeEquipment-editPrefix').val(this.typeEquipment.prefixEdit);
            $('.frm-typeEquipment-stockMin').val(this.typeEquipment.stockMin);
            $('.frm-typeEquipment-stockMax').val(this.typeEquipment.stockMax);
            $('.mdl-title').text('Editar tipo de equipo');
        });

        //Delegación del evento click para activar o desactivar registros
        $(document).on('click', '.btnActive', async (e) => {
            const info = $(e.currentTarget).data('active');
            this.typeEquipment = { ...info };
            console.log(this.typeEquipment);
            $('.mdl-title-active').text(this.typeEquipment.active ? 'Desactivar' : 'Activar' + ' tipo de equipo');
            $('.question-active').text(`
               ¿Desea ${this.typeEquipment.active ? 'desactivar' : 'activar'} este tipo de equipo? 
            `);
        });

        $('.btnSaveChange').off('click.typeEquipment').on('click.typeEquipment', async () => {
            const name = $('.frm-name').val();
            const prefix = $('.frm-typeEquipment-prefix').val();
            const editPrefix = $('.frm-typeEquipment-editPrefix').is(':checked');
            const stockMin = $('.frm-typeEquipment-stockMin').val() || 0;
            const stockMax = $('.frm-typeEquipment-stockMax').val() || 0;
            let res = false;

            if (!Boolean(name) || !Boolean(prefix)) {
                NOTIFICATIONS.toast('warning', 'Debe llenar necesariamente el campo nombre y prefijo');
                return;
            };
            console.log(name, prefix, editPrefix, stockMin, stockMax);
            if (Boolean(this.typeEquipment?.id)) {
                res = await this.catalog.putTypeEquipment(this.typeEquipment.id, name, prefix, editPrefix, stockMin, stockMax);
            } else {
                res = await this.catalog.postTypeEquipment(name, prefix, editPrefix, stockMin, stockMax);
            }

            if (res) {
                $('#mdlChange')[0].close();
                await this.catalog.getData(this.catalog.code);
                this.data = this.catalog.data;
                this.ids = [];
                this.typeEquipment = null;
                this.html();
            }
        });

        //Método clic para activar múltiples registros
        $(document)
            .off('click', '.btnSelectActivate,.btnSelectDeactivate')
            .on('click', '.btnSelectActivate,.btnSelectDeactivate', (e) => {
                let classElement = $(e.currentTarget).attr('class');
                this.active = classElement.includes('btnSelectActivate') ? true : false;
                let selected = [];

                $('.typeEquipmentIds:checked').each((i, el) => {
                    const raw = $(el).attr('data-select');
                    if (!raw) return;
                    const info = JSON.parse(raw);
                    if (info) selected.push(info);
                });
                console.log(selected);
                if (selected.length === 0) {
                    NOTIFICATIONS.toast('warning', 'Seleccione al menos un tipo de equipo');
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

                $('.mdl-title-active').text(classElement.includes('btnSelectActivate') ? 'Activar tipo de equipo' : 'Desactivar tipo de equipo');
                $('.question-active').text(`¿Desea ${classElement.includes('btnSelectActivate') ? 'activar' : 'desactivar'} esto(s) tipo(s) de equipo(s)?`);
                $('#mdlActive')[0].show();
            });

        //Método clic del botón Aceptar para activar o desactivar registros
        $('.btnSaveActive').off('click.equipmentActive').on('click.equipmentActive', async () => {
            const res = await this.catalog.activeData(
                this.catalog.code,
                this.ids?.length == 0 ? this.typeEquipment?.id.toString() : this.ids.join(','),
                this.ids?.length == 0 ? !this.typeEquipment?.active : this.active
            );
            if (res) {
                $('#mdlActive')[0].close();
                await this.catalog.getData(this.catalog.code);
                this.data = [...this.catalog.data];
                this.ids = [];
                this.typeEquipment = null;
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

export default TypeEquipment;
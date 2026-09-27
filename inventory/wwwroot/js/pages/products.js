import NOTIFICATIONS from '../utils/notifications.js';
import PRODUCT from '../providers/productProvider.js';

class Products {
    constructor() {
        console.log('Products initialized');
        this.data = [];
        this.product = null;
        this.ids = [];
        this.active = null;

        this.init();
    }

    async init() {
        await this.loadProducts();
        this.html();
        this.events();
    }

    async loadProducts() {
        try {
            const res = await PRODUCT.getProduct();
            if (res.status) {
                this.data = [...res.data];
            }
        } catch (error) {
            console.error(error);
        }
    }

    html() {
        const html = this.data.map(p => `
            <tr>
              <td>${p.vCodeProduct}</td>
              <td>${p.vTypeEquipmentName}</td>
              <td>${p.vBrandName}</td>
              <td>${p.vModelName}</td>
              <td>${p.vSupplierName}</td>
              <td>${p.vStateProduct}</td>
              <td>${p.vStateSituation}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline btnEdit" data-info='{"id": ${p.id}, "code": "${p.code}", "type": "${p.type}", "brand": "${p.brand}", "model": "${p.model}", "supplier": "${p.supplier}", "status": "${p.status}", "situation": "${p.situation}", "bActive": ${p.bActive} }' onclick="void(0)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0F1724" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button class="btn btn-sm btn-outline btnActive" data-active='{"id": ${p.id}, "code": "${p.code}", "active": ${p.bActive}}' onclick="void(0)">
                    ${p.bActive ?
                        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0F1724" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>`:
                        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0F1724" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>`
                        }
                  </button>
                </div>
              </td>
            </tr>
        `).join('');

        $('#products-tbody').html(html);
    }

    htmlFrm(title) {
        const html = `
            <div class="card p-4 bg-base-100 shadow"><h3 class="text-lg font-semibold mb-2">${title}</h3><p>Formulario pendiente de implementación.</p></div>
        `;
        $('#product-form-container').html(html);
    }

    events() {
        // // Buscador
        // this.$search.off('input.products').on('input.products', () => {
        //     const q = (this.$search.val() || '').toString().toLowerCase();
        //     if (!q) {
        //         this.data = [...this.originalData];
        //     } else {
        //         this.data = this.originalData.filter(p => {
        //             return [p.code, p.type, p.brand, p.model, p.supplier, p.status, p.situation]
        //                 .some(v => (v || '').toString().toLowerCase().includes(q));
        //         });
        //     }
        //     this.renderTable();
        // });

        // // Agregar
        $('#btn-add').off('click.products').on('click.products', () => {
            this.product = null;
            $('#product-grid').toggleClass('hidden');
            $('#product-form-container').toggleClass('hidden');
            let title = this.product?.id ? 'Editar producto' : 'Nuevo producto';
            this.htmlFrm(title);
        });

        // // Delegación: Editar / Activar
        // $(document).off('click.products', '.btnEdit, .btnActive').on('click.products', '.btnEdit, .btnActive', (e) => {
        //     const $el = $(e.currentTarget);
        //     if ($el.hasClass('btnEdit')) {
        //         const info = $el.data('info');
        //         // data-info viene como objeto parseado por jQuery si es JSON válido
        //         this.product = typeof info === 'string' ? JSON.parse(info) : info;
        //         this.showForm(this.product.id);
        //         return;
        //     }

        //     if ($el.hasClass('btnActive')) {
        //         const info = $el.data('active');
        //         this.product = typeof info === 'string' ? JSON.parse(info) : info;
        //         // Se mantiene el texto y comportamiento actual: mostrar confirmación o modal (placeholder)
        //         $('.mdl-title-active').text(this.product.active ? 'Desactivar' : 'Activar' + ' producto');
        //         $('.question-active').text(`¿Desea ${this.product.active ? 'desactivar' : 'activar'} este producto?`);
        //         $('#mdlActive')[0] && $('#mdlActive')[0].show && $('#mdlActive')[0].show();
        //     }
        // });
    }

    // toggleActive(id) {
    //     const p = this.originalData.find(x => x.id === id);
    //     if (!p) return;
    //     p.bActive = !p.bActive;
    //     // actualizar vista filtrada
    //     const q = (this.$search.val() || '').toString().toLowerCase();
    //     if (!q) this.data = [...this.originalData];
    //     else this.$search.trigger('input.products');
    //     this.renderTable();
    // }
}

export default Products;
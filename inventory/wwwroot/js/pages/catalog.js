import CATALOG from '../providers/catalogProvider.js';
import NOTIFICATIONS from '../utils/notifications.js';

class Catalog {
    constructor() {
        this.code = null;
        this.data = null;
    }

    // initialize catalog using the current DOM data-menu element
    async init() {
        this.code = $('[data-menu]').data('menu');
        this.data = null;
        await this.getData(this.code);
        this.events();
    }

    async getData(code) {
        try {
            if (!code) return;
            const res = await CATALOG.getCatalog(code);
            if (res.status) {
                this.data = [...res.data];
                console.log('Catalog data loaded for', code, this.data);
            }
        } catch (error) {
            console.error('Error fetching catalog data:', error);
        }
    }

    async postCatalog(code, name, brandId) {
        try {
            const res = await CATALOG.insertCatalog(code, name, brandId);
            if (res.status) {
                console.log('Petición insert con éxito');
                return res.status;
            }
        } catch (error) {
            console.error('Error fetching catalog data:', error);
        }
    }

    async putCatalog(code, id, name, brandId) {
        try {
            if (!code) return;
            const res = await CATALOG.updateCatalog(code, id, name, brandId);
            if (res.status) {
                console.log('Petición update con éxito');
                return res.status;
            }
        } catch (error) {
            console.error('Error fetching catalog data:', error);
        }
    }

    async activeData(code, ids, active) {
        try {
            const res = await CATALOG.activeCatalog(code, ids, active);
            if (res.status) {
                console.log('Petición patch con éxito');
                return res.status;
            }
        } catch (error) {
            console.error('Error fetching catalog data:', error);
        }
    }

    events() {
        
    }
}

// export a singleton instance so other modules can share the same data reference
const catalogInstance = new Catalog();
export default catalogInstance;
export { Catalog };

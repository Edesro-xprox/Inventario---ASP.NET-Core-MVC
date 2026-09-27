const BASE_URL = '/Catalog';

const CATALOG = {
    getCatalog: async (code) => {
        const res = await fetch(`${BASE_URL}/GetCatalog?code=${code}`);
        let data;
        if (res.ok) {
            data = await res.json();
        }
        return { status: res.ok, data };
    },

    insertCatalog: async (code, name, brandId) => {
        const data = { code, name, brandId }
        
        const res = await fetch(`${BASE_URL}/PostCatalog`, {
            method: "POST", // 1. Método HTTP
            headers: {
                "Content-Type": "application/json" // 2. Cabecera crucial
            },
            body: JSON.stringify(data) // 3. El cuerpo convertido a string
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }
                return response.json(); // Convierte la respuesta del servidor a JS
            })
            .then(data => {
                console.log("Éxito:", data);
                return data;
            })
            .catch(error => {
                console.error("Hubo un problema:", error);
            });

        return res;
    },

    updateCatalog: async (code, id, name, brandId) => {
        const data = { code, id, name, brandId }
        const res = await fetch(`${BASE_URL}/PutCatalog`, {
            method: "PUT", // 1. Método HTTP
            headers: {
                "Content-Type": "application/json" // 2. Cabecera crucial
            },
            body: JSON.stringify(data) // 3. El cuerpo convertido a string
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }
                return response.json(); // Convierte la respuesta del servidor a JS
            })
            .then(data => {
                console.log("Éxito:", data);
                return data;
            })
            .catch(error => {
                console.error("Hubo un problema:", error);
            });
        return res;
    },

    activeCatalog: async (code, ids, active) => {
        const data = { code, ids, active }
        const res = await fetch(`${BASE_URL}/PatchCatalog`, {
            method: "PUT", // 1. Método HTTP
            headers: {
                "Content-Type": "application/json" // 2. Cabecera crucial
            },
            body: JSON.stringify(data) // 3. El cuerpo convertido a string
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }
                return response.json(); // Convierte la respuesta del servidor a JS
            })
            .then(data => {
                console.log("Éxito:", data);
                return data;
            })
            .catch(error => {
                console.error("Hubo un problema:", error);
            });
        return res;
    },

    insertTypeEquipment: async (name, prefix, editPrefix, stockMin, stockMax) => {
        const data = { name, prefix, editPrefix, stockMin, stockMax }

        const res = await fetch(`${BASE_URL}/PostTypeEquipment`, {
            method: "POST", // 1. Método HTTP
            headers: {
                "Content-Type": "application/json" // 2. Cabecera crucial
            },
            body: JSON.stringify(data) // 3. El cuerpo convertido a string
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }
                return response.json(); // Convierte la respuesta del servidor a JS
            })
            .then(data => {
                console.log("Éxito:", data);
                return data;
            })
            .catch(error => {
                console.error("Hubo un problema:", error);
            });

        return res;
    },

    updateTypeEquipment: async (id, name, prefix, editPrefix, stockMin, stockMax) => {
        const data = { id, name, prefix, editPrefix, stockMin, stockMax }

        const res = await fetch(`${BASE_URL}/PutTypeEquipment`, {
            method: "PUT", // 1. Método HTTP
            headers: {
                "Content-Type": "application/json" // 2. Cabecera crucial
            },
            body: JSON.stringify(data) // 3. El cuerpo convertido a string
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }
                return response.json(); // Convierte la respuesta del servidor a JS
            })
            .then(data => {
                console.log("Éxito:", data);
                return data;
            })
            .catch(error => {
                console.error("Hubo un problema:", error);
            });

        return res;
    }
}

export default CATALOG;
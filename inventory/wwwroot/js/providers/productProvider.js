const BASE_URL = '/Product';

const PRODUCT = {
    getProduct: async () => {
        const res = await fetch(`${BASE_URL}/GetProduct`);
        let data;
        if (res.ok) {
            data = await res.json();
        }
        return { status: res.ok, data };
    },

    insertProduct: async (modelId, brandId, supplierId, cost, code, description, stateId) => {
        const data = { modelId, brandId, supplierId, cost, code, description, stateId }
        
        const res = await fetch(`${BASE_URL}/PostProduct`, {
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

    updateProduct: async (id, modelId, brandId, supplierId, cost, code, description, stateId) => {
        const data = { id, modelId, brandId, supplierId, cost, code, description, stateId }
        const res = await fetch(`${BASE_URL}/PutProduct`, {
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

    activeProduct: async (ids, active) => {
        const data = { ids, active }
        const res = await fetch(`${BASE_URL}/PatchProduct`, {
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
}

export default PRODUCT;
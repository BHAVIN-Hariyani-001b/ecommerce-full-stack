import api from "../../middleware";

export const getAttributes = async () => {
    const response = await api.get("/attributes");
    return response.data;
}

export const createAttribute = async (attribute) => {
    const response = await api.post("/attributes", attribute);
    return response.data;
}

export const updateAttribute = async (id, attribute) => {
    const response = await api.put(`/attributes/${id}`, attribute);
    return response.data;
}

export const deleteAttribute = async (id) => {
    const response = await api.delete(`/attributes/${id}`);
    return response.data;
}

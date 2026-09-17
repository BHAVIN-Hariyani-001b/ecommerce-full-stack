import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createGst,
    deleteGst,
    getGst,
    getGstOne,
    updateGst,
} from "../../middleware/gst";

export const getGstOneAPI = createAsyncThunk(
    "gst/getGstOneAPI",
    async (gstId, { rejectWithValue }) => {
        try {
            const response = await getGstOne(gstId);
            return response;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch GST",
            );
        }
    },
);

export const getGstAPI = createAsyncThunk(
    "gst/getGstAPI",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getGst();
            return response;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch GST records",
            );
        }
    },
);

export const createGstAPI = createAsyncThunk(
    "gst/createGstAPI",
    async ({ gst_rate }, { rejectWithValue }) => {
        try {
            const response = await createGst({ gst_rate });
            return response;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to create GST",
            );
        }
    },
);

export const updateGstAPI = createAsyncThunk(
    "gst/updateGstAPI",
    async ({ gst_id, gst_rate, is_active }, { rejectWithValue }) => {
        try {
            const response = await updateGst({ gst_id, gst_rate, is_active });
            return response;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to update GST",
            );
        }
    },
);

export const deleteGstAPI = createAsyncThunk(
    "gst/deleteGstAPI",
    async (gstId, { rejectWithValue }) => {
        try {
            const response = await deleteGst(gstId);
            return response;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to delete GST",
            );
        }
    },
);
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createAttribute,
  deleteAttribute,
  getAttributes,
  updateAttribute,
} from "../../middleware/attributes";

export const fetchAttributesAPI = createAsyncThunk(
  "attributes/fetchAttributes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAttributes();
      return response;
    } catch {
      return rejectWithValue("Failed to fetch attributes");
    }
  },
);

export const createAttributeAPI = createAsyncThunk(
  "attributes/createAttribute",
  async (attribute, { rejectWithValue }) => {
    try {
      const response = await createAttribute(attribute);
      return response;
    } catch {
      return rejectWithValue("Failed to create attribute");
    }
  },
);

export const updateAttributeAPI = createAsyncThunk(
  "attributes/updateAttribute",
  async (attribute, { rejectWithValue }) => {
    try {
      const response = await updateAttribute(attribute);
      return response;
    } catch {
      return rejectWithValue("Failed to update attribute");
    }
  },
);

export const deleteAttributeAPI = createAsyncThunk(
  "attributes/deleteAttribute",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteAttribute(id);
      return response;
    } catch {
      return rejectWithValue("Failed to delete attribute");
    }
  },
);

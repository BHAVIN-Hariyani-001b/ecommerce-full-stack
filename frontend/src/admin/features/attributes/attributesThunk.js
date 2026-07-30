import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createAttribute,
  deleteAttribute,
  getAttributes,
  updateAttribute,
} from "../../middleware/attributes";

export const fetchAttributesAPI = createAsyncThunk(
  "attributes/fetchAttributesAPI",
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
  "attributes/createAttributeAPI",
  async (attribute, { rejectWithValue }) => {
    try {
      const { AName, AExm, ADesc } = attribute;
      const response = await createAttribute({
        name: AName,
        value: AExm,
        desc: ADesc,
      });
      return response;
    } catch {
      return rejectWithValue("Failed to create attribute");
    }
  },
);

export const updateAttributeAPI = createAsyncThunk(
  "attributes/updateAttributeAPI",
  async ({ id, attribute }, { rejectWithValue }) => {
    try {
      console.log(id,attribute)
      const response = await updateAttribute({ id, attribute });
      return response;
    } catch {
      return rejectWithValue("Failed to update attribute");
    }
  },
);

export const deleteAttributeAPI = createAsyncThunk(
  "attributes/deleteAttributeAPI",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAttribute(id);
      return id;
    } catch {
      return rejectWithValue("Failed to delete attribute");
    }
  },
);

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";

function DataTable({ rows, columns, getRowId }) {
  return (
    <Paper sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        getRowHeight={() => 60}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <div className="flex h-full items-center justify-center text-gray-500">
              No users found
            </div>
          ),
        }}
      />
    </Paper>
  );
}

export default DataTable;

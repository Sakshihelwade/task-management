import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationOutlined({ currentPage, totalPages, onPageChange }) {
  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPages}
        page={currentPage}
        variant="outlined"
        color="primary"
        onChange={onPageChange}
      />
    </Stack>
  );
}

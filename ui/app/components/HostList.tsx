import React, { useState } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { TitleBar } from '@dynatrace/strato-components-preview/layouts';
import { DataTable, convertToColumns } from '@dynatrace/strato-components-preview/tables';
import { useDqlQuery } from '@dynatrace-sdk/react-hooks';
import { GET_ALL_HOSTS } from '../queries';
import { Paragraph } from '@dynatrace/strato-components';

export const HostList = () => {
  const result = useDqlQuery({
    body: {
      query: GET_ALL_HOSTS,
    },
  });
  return (
    (<Flex width="100%" flexDirection="column" justifyContent="left" gap={2}>
      {result.data && (
        <DataTable selectableRows data={result.data.records} columns={convertToColumns(result.data.types)} fullWidth>
        </DataTable>
      )}
    </Flex>)
  );
};
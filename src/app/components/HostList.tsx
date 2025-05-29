import React, { useState } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { TitleBar } from '@dynatrace/strato-components-preview/layouts';
import {
  convertToColumnsV2,
} from '@dynatrace/strato-components-preview/conversion-utilities';
import {
  DataTableV2,
} from '@dynatrace/strato-components-preview/tables';
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
    <Flex width="100%" flexDirection="column" justifyContent="left" gap={2}>
      {result.data && (
        <DataTableV2 selectableRows data={result.data.records} columns={convertToColumnsV2(result.data.types)} fullWidth>
        </DataTableV2>
      )}
    </Flex>
  );
};
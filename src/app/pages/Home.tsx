import React, { useState } from "react";

import { useCurrentTheme } from "@dynatrace/strato-components/core";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import { TitleBar } from '@dynatrace/strato-components-preview/layouts';
import {
  Heading,
  Paragraph,
  Strong,
} from "@dynatrace/strato-components/typography";
import {
  DataTableV2,
} from '@dynatrace/strato-components-preview/tables';
import { HostList } from "../components/HostList";
import { useDqlQuery } from '@dynatrace-sdk/react-hooks';
import { GET_ALL_HOSTS } from '../queries';
import { documentsClient } from "@dynatrace-sdk/client-document";
import { convertToColumnsV2 } from "@dynatrace/strato-components-preview/conversion-utilities";

export const Home = () => {
  const result = useDqlQuery({
    body: {
      query: GET_ALL_HOSTS,
    },
  });

  const saveHostList = async () => {
    const newDoc = selectedRows;
    const newDocBlob = new Blob([JSON.stringify(newDoc, null, 2)], {
      type: 'application/json',
    });
    const data = await documentsClient.createDocument({
      body: { 
        name: "sampleDoc1", 
        type: "managedHostList", 
        content: newDocBlob  },
      });
    console.log("created doc")
    console.log(data)
  }

  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>();
  
  const rowSelectionChangedListener = (
      selectedRows: Record<string, boolean>
      ) => {
      console.log('selected rows:', selectedRows)
      setSelectedRows(selectedRows)
  }

  const theme = useCurrentTheme();
  return (
    <Flex flexDirection="column" alignItems="normal" padding={2}>
      <Heading>Host Business Hours</Heading>
      <Flex gap={8} paddingTop={12} flexFlow="wrap">
        <Paragraph>Select the hosts you want to define business hours for</Paragraph>
        {result.data && (
          <DataTableV2 selectableRows onRowSelectionChange={rowSelectionChangedListener} data={result.data.records} columns={convertToColumnsV2(result.data.types)} fullWidth>
          </DataTableV2>
        )}
      </Flex>
      <Button color="primary" variant="emphasized" onClick={saveHostList}>Create new managed host list</Button>
    </Flex>
  );
};
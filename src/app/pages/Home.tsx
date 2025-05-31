import React, { useEffect, useState } from "react";

import { useCurrentTheme } from "@dynatrace/strato-components/core";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import { TextInput, DateTimePicker, SelectV2 } from '@dynatrace/strato-components-preview/forms';
import { TitleBar } from '@dynatrace/strato-components-preview/layouts';
import { Heading, List, Paragraph, Strong, Text } from "@dynatrace/strato-components/typography";
import { DataTableV2 } from '@dynatrace/strato-components-preview/tables';
import { HostList } from "../components/HostList";
import { useDqlQuery, useListDocuments, useDownloadDocument, useCreateDocument } from '@dynatrace-sdk/react-hooks';
import { GET_ALL_HOSTS } from '../queries';
import { documentsClient } from "@dynatrace-sdk/client-document";
import { convertToColumnsV2 } from "@dynatrace/strato-components-preview/conversion-utilities";
import { BlockList } from "net";

export const Home = () => {
  //const [managedListContent, setManagedListContent  ] = useState<Record<string, boolean>>();
  const result = useDqlQuery({
    body: {
      query: GET_ALL_HOSTS,
    },
  });

  const { data:docList, refetch:docListRefetch } = useListDocuments({
    filter: `type contains 'managedHostList'`,
  });

 /*const { data:docContent, refetch:docContentRefetch } = useDownloadDocument({
    id: "1",
  });

  useEffect(() => {
    if (docContent) {
      docContent.get('json').then((managedListContent) => {
        setManagedListContent(managedListContent);
      });
    }
  }, [docContent]);
*/
  const { execute } = useCreateDocument();
  const createDoc = () => {
    execute({
      body: {
        name: "Sample Doc 1",
        type: "managedHostList",
        content: new Blob([JSON.stringify(selectedRows)], {
          type: 'application/sjon'
        })
      }
    })
    console.log("created doc")
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
          <Flex gap={8} paddingTop={12} flexFlow="wrap">
            <Text>Select time and frequency</Text>
            <Text>Disable between</Text>
            <DateTimePicker type="time" precision="minutes"></DateTimePicker> - <DateTimePicker type="time" precision="minutes"></DateTimePicker>
            <Text>On a schedule of</Text>
          </Flex>
        <SelectV2>
        <SelectV2.Content>
          <SelectV2.Option value="daily">Daily</SelectV2.Option>
          <SelectV2.Option value="weekly">Weekly</SelectV2.Option>
        </SelectV2.Content>
      </SelectV2>
      <Paragraph>Managed lists</Paragraph>
        {docList && (
          <List>
            {docList.documents.map((doc) => (
              <Text key={doc.id}>{doc.name}</Text>
            ))}
          </List>
        )}
      </Flex>
      <Button color="primary" variant="emphasized" onClick={createDoc}>Create new managed host list</Button>
    </Flex>
  );
};
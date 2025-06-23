import React, { useEffect, useState } from "react";

import { useCurrentTheme } from "@dynatrace/strato-components/core";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import { TextInput, DateTimePicker, SelectV2, FormField, FormFieldMessages, Label } from '@dynatrace/strato-components-preview/forms';
import { TitleBar } from '@dynatrace/strato-components-preview/layouts';
import { Heading, List, Paragraph, Strong, Text } from "@dynatrace/strato-components/typography";
import { DataTableV2 } from '@dynatrace/strato-components-preview/tables';
import { HostList } from "../components/HostList";
import { useDqlQuery, useListDocuments, useDownloadDocument, useCreateDocument } from '@dynatrace-sdk/react-hooks';
import { GET_ALL_HOSTS } from '../queries';
import { documentsClient } from "@dynatrace-sdk/client-document";
import { convertToColumnsV2 } from "@dynatrace/strato-components-preview/conversion-utilities";
import { BlockList } from "net";
import { TimeValue } from "@dynatrace/strato-components-preview/core";

const CreateListForm = ({hosts, rowChangeListener, createDoc}) => {
  return (
    <>
      <Paragraph>Select the hosts you want to define business hours for</Paragraph>
      {hosts.data && (
          <DataTableV2 selectableRows onRowSelectionChange={rowChangeListener} data={hosts.data.records} columns={convertToColumnsV2(hosts.data.types)} fullWidth>
          </DataTableV2>
        )}
      <form action={createDoc} onSubmit={createDoc}>
        <Flex gap={8} paddingTop={12} flexFlow="wrap">
          <Text>Select time and frequency</Text>
          <Text>Disable between</Text>
            <FormField>
              <DateTimePicker type="time" precision="minutes"></DateTimePicker> - <DateTimePicker type="time" precision="minutes"></DateTimePicker>
            </FormField>
          <Text>On a schedule of</Text>
        </Flex>
        <SelectV2>
          <SelectV2.Content>
            <SelectV2.Option value="daily">Daily</SelectV2.Option>
            <SelectV2.Option value="weekly">Weekly</SelectV2.Option>
          </SelectV2.Content>
        </SelectV2>
        <Button color="primary" variant="emphasized" type="submit">Create new managed host list</Button>
      </form>
    </>
  )
}

export const Home = () => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>();
  const [schedule, setSchedule] = useState();

  const result = useDqlQuery({
    body: {
      query: GET_ALL_HOSTS,
    },
  });

  const { data:docList } = useListDocuments({
    filter: `type contains 'managedHostList'`,
  });

  const { execute } = useCreateDocument();
  const createDoc = (event) => {
    console.log('CREATE', event, selectedRows)
    const contentToCreate = convertToScheduleInfo([], { "startTime": event.target[0].value, "endTime": event.target[1].value, "cadence": "Weekly"})
    execute({
      body: {
        name: `Sample Doc ${Math.floor(Math.random() * 10000)}`,
        type: "managedHostList",
        content: new Blob([JSON.stringify(contentToCreate)], {
          type: 'application/json'
        })
      }
    }).then(() => { console.log("YAH") })
  }

  interface ScheduleInfo {
    hosts: [],
    startTime: Date,
    endTime: Date,
    cadence: string
  }

  const convertToScheduleInfo = (hosts, schedule) => {
    const objectOut = {
      "hosts": [0],
      "startTime": new Date(schedule.startTime).getHours(),
      "endTime": new Date(schedule.endTime).getHours(),
      "cadence": schedule.cadence
    }
    console.log(objectOut)
    return objectOut
  }
  
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
      <CreateListForm hosts={result} rowChangeListener={rowSelectionChangedListener} createDoc={createDoc}/>
      <Flex gap={8} paddingTop={12} flexFlow="wrap">
      <Paragraph>Managed lists</Paragraph>
        {docList && (
          <List>
            {docList.documents.map((doc) => (
              <Text key={doc.id}>{doc.id} {doc.name}</Text>
            ))}
          </List>
        )}
      </Flex>
      
    </Flex>
  );
  }
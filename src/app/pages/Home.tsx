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
      <form onSubmit={createDoc}>
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
        <Text>Host list name</Text>
        <FormField>
          <TextInput placeholder="Host list name"></TextInput>
        </FormField>
        <Button color="primary" variant="emphasized" type="submit">Create new managed host list</Button>
      </form>
    </>
  )
}

export const Home = () => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>();
  const [schedule, setSchedule] = useState();

  /*const result = useDqlQuery({
    body: {
      query: GET_ALL_HOSTS,
    },
  });

  setTimeout(() => { console.log(result!.data?.records)}, 5000)*/
  
  //mocked data
  const result = {
    "data": {
        "records": [
            {
                "entity.name": "Sample Host",
                "id": "HOST-16FAEdddddF99D13"
            },
            {
                "entity.name": "Host of Sample",
                "id": "HOST-16FAeeeeeBF99D13"
            },
            {
                "entity.name": "1 Host that is Sampled",
                "id": "HOST-16FAcccccBF99D13"
            }
        ],
        "types": [
            {
                "indexRange": [
                    0,
                    0
                ],
                "mappings": {
                    "entity.name": {
                        "type": "string"
                    },
                    "id": {
                        "type": "string"
                    }
                }
            }
        ],
        "metadata": {
            "grail": {
                "canonicalQuery": "fetch dt.entity.host, from:-30d",
                "timezone": "Z",
                "query": "fetch dt.entity.host, from:-30d",
                "scannedRecords": 1,
                "dqlVersion": "V1_0",
                "scannedBytes": 0,
                "scannedDataPoints": 0,
                "analysisTimeframe": {
                    "start": "2025-07-20T08:38:39.913Z",
                    "end": "2025-08-19T08:38:39.913Z"
                },
                "locale": "und",
                "executionTimeMilliseconds": 35,
                "notifications": [],
                "queryId": "3c99f8f3-6e29-4162-a893-814ff865f81d",
                "sampled": false
            }
        }
    },
    "isError": false,
    "isLoading": false,
    "isSuccess": true,
    "status": "success"
  }

  const { data:docList } = useListDocuments({
    filter: `type contains 'managedHostList'`,
  });

  const { execute } = useCreateDocument();
  const createDoc = (event) => {
    let selectedIndices = Object.keys(selectedRows!).map(index => parseInt(index))
    const contentToCreate = convertToScheduleInfo(selectedIndices.map(index => result.data.records[index]), { "startTime": event.target[0].value, "endTime": event.target[1].value, "cadence": "Weekly"})
    execute({
      body: {
        name: event.target[4].value,
        type: "managedHostList",
        content: new Blob([JSON.stringify(contentToCreate)], {
          type: 'application/json'
        })
      }
    })
  }

  interface Host {
    name: string,
    id: string
  }

  interface HostList {
    hosts: Array<Host>,
    schedule: {
      startTime: Number,
      endTime: Number,
      cadence: string
    }
  }

  const convertToScheduleInfo = (hosts, schedule) => {
    const objectOut:HostList = {
      "hosts": hosts,
      "schedule": {
        "startTime": new Date(schedule.startTime).getHours(),
        "endTime": new Date(schedule.endTime).getHours(),
        "cadence": schedule.cadence
      }
    }
    return objectOut
  }
  
  const rowSelectionChangedListener = (selectedRows: Record<string, boolean>) => {
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
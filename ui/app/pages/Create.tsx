import React, { useState } from "react"
import { GET_ALL_HOSTS } from '../queries';
import { DataTable, convertToColumns } from '@dynatrace/strato-components-preview/tables';
import { Button, Flex, Heading, List, Paragraph, Text } from "@dynatrace/strato-components";
import type { QueryResult } from '@dynatrace-sdk/client-query';
import { FormField, DateTimePicker, Select, TextInput } from "@dynatrace/strato-components-preview";
import { useCreateDocument } from "@dynatrace-sdk/react-hooks";

interface Host {
    id: string,
    name: string,
    settingsObjectId: string
  }

interface HostList {
  hosts: Array<Host>,
  schedule: {
    startTime: Number,
    endTime: Number,
    cadence: string
  }
}

const result: QueryResult = {
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
        },
        {
            "entity.name": "Host that be sampleth",
            "id": "HOST-16FAffffffBF99D13"
        },
        {
            "entity.name": "Host sampleado",
            "id": "HOST-16FAzzzzzBF99D13"
        }
    ],
    "types": [
        {
            "indexRange": [0,0],
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
    "metadata": {}
  }
/*
const CreateBusinessHours = () => {
    const { execute } = useCreateDocument()
      const createDoc = (event) => {
        let selectedIndices = Object.keys(selectedRows!).map(index => parseInt(index))
        const contentToCreate = createHostList(selectedIndices.map(index => hosts[index]), { "startTime": event.target[0].value, "endTime": event.target[1].value, "cadence": "Weekly"})
        //let objectIds = getObjs(contentToCreate.hosts)
    
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
}
*/
const BusinessHoursForm = ({ setIsCreating }) => {
    return (<>
        <form onSubmit={() => setIsCreating(true)}>
          <Flex gap={8} paddingTop={12} flexFlow="wrap">
            <Text>Select time and frequency</Text>
            <Text>Disable between</Text>
              <FormField>
                <DateTimePicker type="time" precision="minutes"></DateTimePicker> - <DateTimePicker type="time" precision="minutes"></DateTimePicker>
              </FormField>
            <Text>On a schedule of</Text>
          </Flex>
          <Select>
            <Select.Content>
              <Select.Option value="daily">Daily</Select.Option>
              <Select.Option value="weekly">Weekly</Select.Option>
            </Select.Content>
          </Select>
          <Text>Host list name</Text>
          <FormField>
            <TextInput placeholder="Host list name"></TextInput>
          </FormField>
          <Button color="primary" variant="emphasized" type="submit">Create new managed host list</Button>
        </form>
      </>)
}


const HostList = ({ rowSelectionListener }) => {
    return(
        <Flex flexDirection="column" alignItems="normal" padding={2}>
            {result && (
                <DataTable selectableRows onRowSelectionChange={rowSelectionListener} data={result.records} columns={convertToColumns(result.types)} fullWidth></DataTable>
            )}
        </Flex>
    )
}

export const Create = () => {
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>();
    const [isCreating, setIsCreating] = useState(false)

    return(
        <>
            <Heading>Select hosts and their business schedule</Heading>
            <HostList rowSelectionListener={setSelectedRows}></HostList>
            <BusinessHoursForm setIsCreating={setIsCreating}></BusinessHoursForm>
            {isCreating && (
                <h1>Creando...</h1>
            )}
        </>
    )
}
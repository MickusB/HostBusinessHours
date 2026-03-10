import React, { useEffect, useState } from "react"
import { Controller, useForm } from 'react-hook-form';
import { GET_ALL_HOSTS } from '../queries';
import { DataTable, convertToColumns } from '@dynatrace/strato-components-preview/tables';
import type { TimeValue } from '@dynatrace/strato-components-preview/core';
import { Button, Flex, Heading, List, Paragraph, Text } from "@dynatrace/strato-components";
import type { QueryResult } from '@dynatrace-sdk/client-query';
import { FormField, DateTimePicker, Select, TextInput, DateTimePickerProps } from "@dynatrace/strato-components-preview";
import { useCreateDocument, useSettingsObjectsV2 } from "@dynatrace-sdk/react-hooks";

interface Host {
    id: string,
    name: string,
    settingsObjectId?: string
  }

interface BusinessHours {
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

const BusinessHoursWorkflow = () => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>();
  const [isCreating, setIsCreating] = useState(false)
  const [hostListData, setHostListData] = useState()

  return (
    <>
      <HostList rowSelectionListener={setSelectedRows}></HostList>
      <BusinessHoursForm onSubmit={(data) => {
        setHostListData(data)
        setIsCreating(true)
      }}>
      </BusinessHoursForm>
        {isCreating && (
            <CreateBusinessHours selectedRows={selectedRows} hostListData={hostListData}></CreateBusinessHours>
        )}
    </>
  )
}

const CreateBusinessHours = ({ selectedRows, hostListData }) => {

    //const settingsObjects = useSettingsObjectsV2({ scope:  })

    const convertHostData = (hostsToConvert) => {
        let hosts: Array<Host>
        // Keys of selectedRows are stored as strings, so need to convert
        const selectedIndices = Object.keys(selectedRows).map(index => parseInt(index))
        const rawHostData = selectedIndices.map(index => result.records[index])
    }
    
    const convertScheduleData = (schedule) => {
      
    }
    
    const convertToBusinessHours = () => {

    }

    const { execute } = useCreateDocument()
    /*  
    const createDoc = (event) => {
        let selectedIndices = Object.keys(selectedRows!).map(index => parseInt(index))
        //const contentToCreate = createHostList(selectedIndices.map(index => hosts[index]), { "startTime": event.target[0].value, "endTime": event.target[1].value, "cadence": "Weekly"})
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
*/
    return (
        <>

        </>
    )
}

const BusinessHoursForm = ({ onSubmit }) => {
  const [startTime, setStartTime] = useState<DateTimePickerProps['value']>(() => new Date().toISOString());
  const [endTime, setEndTime] = useState<DateTimePickerProps['value']>(() => new Date().toISOString());
  const [cadence, setCadence] = useState<"daily" | "weekly">()
  const [name, setName] = useState("")

  const handleSubmit = (event) => { 
    event.preventDefault()
    onSubmit({ startTime, endTime, cadence, name })
  }

  return (<>
      <form onSubmit={(event) => handleSubmit(event)}>
        <Flex gap={8} paddingTop={12} flexFlow="wrap">
          <Text>Select time and frequency</Text>
          <Text>Disable between</Text>
            <FormField>
              <DateTimePicker type="time" precision="minutes" value={startTime} onChange={(time) => setStartTime(time!["value"])}></DateTimePicker> - <DateTimePicker type="time" precision="minutes" value={endTime} onChange={(time) => setEndTime(time!["value"])}></DateTimePicker>
            </FormField>
          <Text>On a schedule of</Text>
        </Flex>
        <Select name="cadence-select" value={cadence} onChange={setCadence}>
          <Select.Content>
            <Select.Option value="daily">Daily</Select.Option>
            <Select.Option value="weekly">Weekly</Select.Option>
          </Select.Content>
        </Select>
        <Text>Host list name</Text>
        <FormField>
          <TextInput placeholder="Host list name" value={name} onChange={(text) => setName(text)}></TextInput>
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

    return(<>
        <Heading>Select hosts and their business schedule</Heading>
        <BusinessHoursWorkflow></BusinessHoursWorkflow>
    </>)
}
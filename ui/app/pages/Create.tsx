import React, { useEffect, useState } from "react"
import { Controller, useForm } from 'react-hook-form';
import { GET_ALL_HOSTS } from '../queries';
import { DataTable, convertToColumns } from '@dynatrace/strato-components-preview/tables';
import type { TimeValue } from '@dynatrace/strato-components-preview/core';
import { Button, Flex, Heading, List, Paragraph, Text } from "@dynatrace/strato-components";
import type { QueryResult, ResultRecord } from '@dynatrace-sdk/client-query';
import { FormField, DateTimePicker, Select, TextInput, DateTimePickerProps } from "@dynatrace/strato-components-preview";
import { useCreateDocument } from "@dynatrace-sdk/react-hooks";
import DocumentService from "../services/DocumentService"

// Type here is functionally the same as a result record, just with one extra property.
type Host = ResultRecord & {
  id: string
  "entity.name": string
  settingsObjectId?: string
}

type BusinessHours = {
  hosts: Array<Host>
  schedule: {
    startTime: Number
    endTime: Number
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
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
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
  //mocked sample response from get settings API
  const settingsObjects = {
    "items": [
        {
          "objectId": "vu9U3hXa3q0AAAAAAAAAdidWlsdGluOmhvc3QubW9uaXRvcmluZwAESE9TVAAQMTZGQUVFOEU3QkY5OUQxMwAkNTJiZWNlNzItMDJiOC0zOWE1LWI0NzctM2MxOWNiZDEzZjk1vu9U3hXa3q0",
          "scope": "HOST-16FAeeeeeBF99D13"
          //matches host 1
        }, {
          "objectId": "vu9U3hXa3q0BBBBBBBBBdidWlsdGluOmhvc3QubW9uaXRvcmluZwAESE9TVAAQMTZGQUVFOEU3QkY5OUQxMwAkNTJiZWNlNzItMDJiOC0zOWE1LWI0NzctM2MxOWNiZDEzZjk1vu9U3hXa3q0",
          "scope": "HOST-16FAcccccBF99D13"
          //matches host 2
        }, {
          "objectId": "vu9U3hXa3q0CCCCCCCCCdidWlsdGluOmhvc3QubW9uaXRvcmluZwAESE9TVAAQMTZGQUVFOEU3QkY5OUQxMwAkNTJiZWNlNzItMDJiOC0zOWE1LWI0NzctM2MxOWNiZDEzZjk1vu9U3hXa3q0",
          "scope": "HOST-16FAzzzzzBF99D13"
          //matches host 4
        }
    ],
    "totalCount": 3,
    "pageSize": 100
  }
  // Map each object ID to its scope
  const settingsMapping = new Map(settingsObjects.items.map(setting => [setting.scope, setting.objectId]))

  // Keys of selectedRows are stored as strings, so need to convert
  const selectedIndices = Object.keys(selectedRows).map(index => parseInt(index))

  // Results are stored in ResultRecord object. Settings object ID needs to be added to this record, so intersectional host
  // type is used here to map ResultRecord to Host
  let hosts = selectedIndices.map(index => { return result.records[index] as Host})

  // Formats host names to correct format for "scope" parameter of getSettings later
  const hostNames = hosts.map(host => { return host["entity.name"] }).join(", ")

  // Overwrite hosts with a copy of itself but with the corresponding object ID added to each host
  hosts = hosts.map(host => ({
      ...host,
      settingsObjectId: settingsMapping.get(host.id)
    })
  )

  const contentToCreate: BusinessHours = {
    hosts: hosts,
    schedule: {
      startTime: hostListData.startTime,
      endTime: hostListData.endTime,
      cadence: hostListData.cadence
    }
  }

  // Use this to get live data
  //const settingsObjects = DocumentService.getSettings({ schemaIds: "builtin:host.monitoring", fields: "objectId,scope", scope: hostNames}).then(object => console.log(object))

  const { execute } = useCreateDocument()

  useEffect(() => {
    execute({
      body: {
        name: hostListData.name,
        type: "managedHostList",
        content: new Blob([JSON.stringify(contentToCreate)], {
          type: 'application/json'
        })
      }
    })
  }, [])
    
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
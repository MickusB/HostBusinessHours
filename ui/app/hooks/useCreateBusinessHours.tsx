import { useEffect, useState } from "react"
import { useCreateDocument } from "@dynatrace-sdk/react-hooks";
import APIService from "../services/APIService"
import type { ResultRecord } from '@dynatrace-sdk/client-query';
import workflowTemplate from "../../assets/workflow/template.json"

type Host = ResultRecord & {
    id: string
    "entity.name": string
    settingsObjectId?: string
}

type BusinessHours = {
    hosts: Array<Host>
    schedule: {
        start: number
        end: number
        cadence: string
    },
    workflowId?: string
    status?: "Healthy" | "Unhealthy" | "Disabled"
}

export const useCreateBusinessHours = ({ selectedRows, hostListData, result }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const { execute } = useCreateDocument()

    const selectedIndices = Object.keys(selectedRows).map(index => parseInt(index))
    let hosts = selectedIndices.map(index => { return result.data.records[index] as Host })
    const hostNames = hosts.map(host => { return host["entity.name"] }).join(", ")

    const createBusinessHours = async () => {
        try {
            // Results are stored in ResultRecord object. Settings object ID needs to be added to this record, so intersectional host
            // type is used here to map ResultRecord to Host

            // Formats host names to correct format for "scope" parameter of getSettings later

            // Use this to get live data
            console.log(hostNames)
            const settingsObjects = await APIService.getSettings({ schemaIds: "builtin:host.monitoring", fields: "objectId,scope", scope: hostNames })
            console.log(settingsObjects)
            // Map each object ID to its scope
            const settingsMapping = new Map(settingsObjects.items.map(setting => [setting.scope, setting.objectId]))

            // Overwrite hosts with a copy of itself but with the corresponding object ID added to each host
            hosts = hosts.map(host => ({
                ...host,
                settingsObjectId: settingsMapping.get(host.id)
            })
            )

            const contentToCreate: BusinessHours = {
                hosts: hosts,
                schedule: {
                    start: hostListData.startTime,
                    end: hostListData.endTime,
                    cadence: hostListData.cadence
                }
            }

            const objectIds = settingsObjects.items.map(item => item.objectId)

            execute({
                body: {
                    name: hostListData.name,
                    type: "managedHostList",
                    content: new Blob([JSON.stringify(contentToCreate)], {
                        type: 'application/json'
                    })
                }
            })

            let workflowToCreate = workflowTemplate
            workflowToCreate.input = { "schedule": contentToCreate.schedule, "objectIds": objectIds }
            workflowToCreate.title = hostListData.name
            APIService.createWorkflow(workflowToCreate)
        } catch (e) {
            setError(e as Error)
        } finally {
            setIsLoading(false)
        }
    }

    return { createBusinessHours, isLoading, error }
}
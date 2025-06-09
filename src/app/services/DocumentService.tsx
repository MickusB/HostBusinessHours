import { ObjectsList, settingsObjectsClient } from "@dynatrace-sdk/client-classic-environment-v2";

const getSettings = async () => await settingsObjectsClient.getSettingsObjects({scopes: "environment"}).then(objects => {
        console.log("hello 2")
        return objects
      })

export default {
    getSettings: getSettings
}
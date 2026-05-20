import { settingsObjectsClient } from "@dynatrace-sdk/client-classic-environment-v2";
import { workflowsClient } from "@dynatrace-sdk/client-automation";

const getSettings = async (config) => await settingsObjectsClient.getSettingsObjects(config)

const updateSettingsByObject = async (config) => await settingsObjectsClient.putSettingsObjectByObjectId(config)

const createWorkflow = async (config) => await workflowsClient.createWorkflow({
    body: config 
  },
);

export default {
    getSettings: getSettings,
    updateSettingsByObject: updateSettingsByObject,
    createWorkflow: createWorkflow
}
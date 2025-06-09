import { ObjectsList, settingsObjectsClient } from "@dynatrace-sdk/client-classic-environment-v2";

const getSettings = async (config) => await settingsObjectsClient.getSettingsObjects(config)

const updateSettingsByObject = async (config) => await settingsObjectsClient.putSettingsObjectByObjectId(config)

export default {
    getSettings: getSettings,
    updateSettingsByObject: updateSettingsByObject
}
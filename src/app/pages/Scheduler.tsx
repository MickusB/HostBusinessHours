import React, { useEffect, useState } from "react";

import { useCurrentTheme } from "@dynatrace/strato-components/core";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { ObjectsList } from "@dynatrace-sdk/client-classic-environment-v2";
import DocumentService from '../services/DocumentService'

export const Scheduler = () => {

  const [settingsObjs, setSettingsObjs] = useState<ObjectsList>();

  const getObjs = () => {
    DocumentService.getSettings({schemaIds: "builtin:host.monitoring"}).then(objects => {
      setSettingsObjs(objects)
    })
  }

  const updateObj = () => {
    console.log(settingsObjs?.items[0].objectId)
    DocumentService.updateSettingsByObject({
      objectId: settingsObjs?.items[0].objectId, 
      body: { 
        schemaVersion: "1.4",
        value: { enabled: true }}
      }
    )
  }

  const theme = useCurrentTheme();
  return (
    <Flex flexDirection="column" alignItems="normal" padding={2}>
      <Heading>Disable hosts</Heading>
        {settingsObjs && (
          <Text>
            {settingsObjs.items.map((obj) => (
              <Text>obj ID {obj.objectId}</Text>
            ))}
          </Text>
        )}
        <Button onClick={getObjs}>Get objects</Button>
        <Button onClick={updateObj}>Update objects</Button>
    </Flex>
  );
}
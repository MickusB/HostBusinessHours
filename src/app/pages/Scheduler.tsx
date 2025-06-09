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
import { ObjectsList, settingsObjectsClient } from "@dynatrace-sdk/client-classic-environment-v2";
import DocumentService from '../services/DocumentService'

export default async function () {
  const data = await settingsObjectsClient.getSettingsObjects();
}

export const Scheduler = () => {

  const [settingsObjs, setSettingsObjs] = useState<ObjectsList>();

  const getObjs = () => {
    let x = DocumentService.getSettings().then(objects => {
      console.log(objects)
      setSettingsObjs(objects)
    })
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
        <Button onClick={getObjs}>Button text</Button>
    </Flex>
  );
}
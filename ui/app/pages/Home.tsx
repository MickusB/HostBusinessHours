import React, { useEffect, useState } from "react";

import { useCurrentTheme } from "@dynatrace/strato-components/core";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import { Heading, List, Paragraph, Strong, Text } from "@dynatrace/strato-components/typography";
import { DataTable, convertToColumns } from '@dynatrace/strato-components-preview/tables';
import { useListDocuments } from '@dynatrace-sdk/react-hooks';

export const Home = () => {
  const { data:managedHostLists } = useListDocuments({
    filter: `type contains 'managedHostList'`,
  })

  const theme = useCurrentTheme();
  return (
    <Flex flexDirection="column" alignItems="normal" padding={2}>
      <Heading>Business Hours</Heading>
      <Flex gap={8} paddingTop={12} flexFlow="wrap">
        {managedHostLists && (
          <List>
            {managedHostLists.documents.map((doc) => (
              <Text key={doc.id}>{doc.id} {doc.name}</Text>
            ))}
          </List>
        )}
      </Flex>
    </Flex>
  );
}
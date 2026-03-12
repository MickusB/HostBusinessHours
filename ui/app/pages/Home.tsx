import React, { useEffect, useState, useMemo } from "react";

import { useCurrentTheme } from "@dynatrace/strato-components/core";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, List, Paragraph, Strong, Text } from "@dynatrace/strato-components/typography";
import { DataTable, DataTableColumnDef, convertToColumns } from '@dynatrace/strato-components-preview/tables';
import { useListDocuments } from '@dynatrace-sdk/react-hooks';
import { DocumentList } from "@dynatrace-sdk/client-document";

  type BusinessHoursListRow = 
  NonNullable<DocumentList>["documents"][number];

export const Home = () => {
  const { data:businessHoursLists } = useListDocuments({
    filter: `type contains 'managedHostList'`,
  })

  const columns = useMemo<DataTableColumnDef<BusinessHoursListRow>[]>(() => [
    { id: "id", accessor: "id", header: "ID" },
    { id: "name", accessor: "name", header: "Name" },
  ], [businessHoursLists]);

  const theme = useCurrentTheme();
  return (
    <Flex flexDirection="column" alignItems="normal" padding={2}>
      <Heading>Business Hours Lists</Heading>
      <Flex gap={8} paddingTop={12} flexFlow="wrap">
        {businessHoursLists && 
          <DataTable data={businessHoursLists.documents} columns={columns}/>
        }
      </Flex>
    </Flex>
  );
}
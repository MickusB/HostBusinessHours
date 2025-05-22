import React from "react";

import { useCurrentTheme } from "@dynatrace/strato-components/core";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import {
  Heading,
  Paragraph,
  Strong,
} from "@dynatrace/strato-components/typography";
import { HostList } from "../components/HostList";

export const Home = () => {
  const theme = useCurrentTheme();
  return (
    <Flex flexDirection="column" alignItems="normal" padding={2}>
      <Heading>Host Business Hours</Heading>
      <Flex gap={8} paddingTop={12} flexFlow="wrap">
        <HostList></HostList>
      </Flex>
      <Button color="primary" variant="emphasized">Create new managed host list</Button>
    </Flex>
  );
};

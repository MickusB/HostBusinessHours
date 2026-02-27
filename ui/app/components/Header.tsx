import React from "react";
import { Link } from "react-router-dom";
import { Button } from '@dynatrace/strato-components/buttons';
import { PlusIcon } from '@dynatrace/strato-icons';
import { AppHeader } from "@dynatrace/strato-components-preview/layouts";

export const Header = () => {
  return (
    <AppHeader>
      <AppHeader.NavItems>
        <AppHeader.AppNavLink as={Link} to="/" />
        <AppHeader.NavItem as={Link} to="/create">
          <Button color="neutral" variant="emphasized"><Button.Prefix><PlusIcon></PlusIcon></Button.Prefix>New host list</Button>
        </AppHeader.NavItem>
        <AppHeader.NavItem as={Link} to="/scheduler">
          Scheduler
        </AppHeader.NavItem>
      </AppHeader.NavItems>
    </AppHeader>
  );
};

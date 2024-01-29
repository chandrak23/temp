import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Drawer, DrawerContent, DrawerSelectEvent } from "@progress/kendo-react-layout";
// import { Button } from "@progress/kendo-react-buttons";
// import { menuIcon } from "@progress/kendo-svg-icons";
import "./style.scss";

const items = [
  { text: "Register Data Source", selected: true, route: "/" },
  { text: "Register Data Set", route: "/form" },
  { text: "Configure Data Quality Check", route: "#" },
  { text: "Schedule", route: "#" },
  { text: "Governance", route: "#" },
];
const DrawerContainer = (props: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [expanded, setExpanded] = React.useState<boolean>(true);

  //   const handleClick = () => {
  //     setExpanded(!expanded);
  //   };

  const onSelect = (e: DrawerSelectEvent) => {
    navigate(e?.itemTarget?.props?.route);
  };

  const setSelectedItem = (pathName: string) => {
    let currentPath: any = items.find((item) => item.route === pathName);
    if (currentPath.text) {
      return currentPath.text;
    }
  };

  const selected = setSelectedItem(location?.pathname);

  return (
    <div>
      {/* <div className="custom-toolbar">
        <Button svgIcon={menuIcon} fillMode="flat" onClick={handleClick} />
        <span className="title">Navigational drawer</span>
      </div> */}
      <Drawer
        expanded={expanded}
        position={"start"}
        mode={"push"}
        width={250}
        items={items.map((item) => ({ ...item, selected: item.text === selected }))}
        onSelect={onSelect}
      >
        <DrawerContent className="drawer-content">{props.children}</DrawerContent>
      </Drawer>
    </div>
  );
};

export default DrawerContainer;

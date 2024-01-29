import * as React from "react";

export interface INoMatchProps {}

export default function NoMatch(props: INoMatchProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Page Not found
    </div>
  );
}

import Roact from "@rbxts/roact";

interface Props {
  closedText?: string;
  openText?: string;
  enabled: boolean;
  onClick: () => void;
}

export const ToggleHoarcekatButton = (props: Props) => {
  return (
    <textbutton
      Event={{
        MouseButton1Click: () => props.onClick(),
      }}
      Text={props.enabled ? props.closedText ?? "Close" : props.openText ?? "Open"}
      Position={UDim2.fromOffset(10, 10)}
      Size={UDim2.fromOffset(50, 50)}
    />
  );
};

import Roact from "@rbxts/roact";
import Theme from "interface/definitions/theme";
import { mapBindableProp } from "interface/utils/mapBindableProp";
import { MathUtil } from "shared/utils/math";
import { ValueOrBinding } from "types/roact";
import { GameCornerConstraint } from "../constraint/corner/default";
import { EqualPadding } from "../constraint/padding/equal";
import { TransparencyContext } from "../context/transparency";
import { RoundedShadow } from "../effect/shadow/rounded";

export interface CardProps extends Roact.PropsWithChildren {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  ref?: Roact.Ref<Frame>;
  padding?: UDim;
  position?: ValueOrBinding<UDim2>;
  shadowRadius?: number;
  size?: ValueOrBinding<UDim2>;
  transparency?: ValueOrBinding<number>;
  visible?: ValueOrBinding<boolean>;
  useShadow?: boolean;
  zIndex?: ValueOrBinding<number>;
}

/** Game's default card component */
export const Card = Roact.forwardRef<CardProps, Frame>((props, ref) => {
  const shadow_radius = props.shadowRadius ?? Theme.SizeCardShadow;
  const use_shadow = props.useShadow ?? true;
  return (
    <frame
      AnchorPoint={props.anchorPoint}
      BackgroundTransparency={1}
      Position={props.position}
      Ref={props.ref}
      Size={props.size}
      Visible={props.visible}
      ZIndex={props.zIndex}
    >
      <RoundedShadow
        Key="Shadow"
        anchorPoint={new Vector2(0.5, 0.5)}
        position={UDim2.fromScale(0.5, 0.5)}
        radius={0.04}
        size={mapBindableProp(props.size ?? new UDim2(), size => {
          return new UDim2(size.X.Scale, size.X.Offset + shadow_radius, size.Y.Scale, size.Y.Offset + shadow_radius);
        })}
        transparency={
          use_shadow
            ? mapBindableProp(props.transparency ?? 0, alpha => {
                return MathUtil.lerp(0.4, 1, alpha * 2);
              })
            : 1
        }
        zIndex={1}
      />
      <frame
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={props.color ?? Theme.ColorCard}
        BorderSizePixel={0}
        Key="Container"
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromScale(1, 1)}
        ZIndex={2}
      >
        <EqualPadding Key="Padding" scale={props.padding ?? new UDim(0, Theme.PaddingCard)} />
        <GameCornerConstraint Key="Constraint" />
        <TransparencyContext.Provider value={props.transparency ?? 0}>
          {props[Roact.Children]}
        </TransparencyContext.Provider>
      </frame>
    </frame>
  );
});

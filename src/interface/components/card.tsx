import Roact from "@rbxts/roact";
import Theme from "interface/definitions/theme";
import { mapBindableProp } from "interface/utils/mapBindableProp";
import { MathUtil } from "shared/utils/math";
import { ValueOrBinding } from "types/roact";
import { GameCornerConstraint } from "./constraints/corner";
import { EqualPadding } from "./constraints/padding/equal";
import { TransparencyContext } from "./context/transparency";
import { Shadow } from "./gfx/shadow";

interface Props extends Roact.PropsWithChildren {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  ref?: Roact.Ref<Frame>;
  padding?: UDim;
  position?: ValueOrBinding<UDim2>;
  shadowRadius?: number;
  size?: ValueOrBinding<UDim2>;
  visible?: ValueOrBinding<boolean>;
  useShadow?: boolean;
  transparency?: ValueOrBinding<number>;
}

function adjustCardShadow(shadowRadius: number, size: UDim2) {
  return new UDim2(size.X.Scale, size.X.Offset + shadowRadius, size.Y.Scale, size.Y.Offset + shadowRadius);
}

export const Card = Roact.forwardRef<Props, Frame>((props, ref) => {
  const shadow_radius = props.shadowRadius ?? Theme.CardShadowSize;
  const use_shadow = props.useShadow ?? true;
  return (
    <Shadow
      anchorPoint={props.anchorPoint}
      position={props.position}
      radius={0.04}
      size={mapBindableProp(props.size ?? new UDim2(), size => {
        return adjustCardShadow(shadow_radius, size ?? new UDim2());
      })}
      transparency={
        use_shadow
          ? mapBindableProp(props.transparency ?? 0, alpha => {
              return MathUtil.lerp(0.4, 1, alpha * 2);
            })
          : 1
      }
      visible={props.visible}
    >
      <frame
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={props.color ?? Theme.ColorWhite}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.5, 0.5)}
        Ref={ref}
        Size={
          new UDim2(1, -(props.shadowRadius ?? Theme.CardShadowSize), 1, -(props.shadowRadius ?? Theme.CardShadowSize))
        }
        Transparency={props.transparency}
      >
        <EqualPadding scale={props.padding ?? new UDim(0, Theme.CardPadding)} />
        <GameCornerConstraint />
        <TransparencyContext.Provider value={props.transparency ?? 0}>
          {props[Roact.Children]}
        </TransparencyContext.Provider>
      </frame>
    </Shadow>
  );
});

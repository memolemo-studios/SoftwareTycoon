import Color from "@rbxts/color";
import { RobloxUtil } from "shared/utils/roblox";

/**
 * These are colors provided by Google (2014 Material Design color palettes)
 *
 * Source: https://material.io/design/color/the-color-system.html
 */
export namespace MaterialColors {
  // red
  export const Red50 = Color.fromHex("#FFEBEE");
  export const Red100 = Color.fromHex("#FFCDD2");
  export const Red200 = Color.fromHex("#EF9A9A");
  export const Red300 = Color.fromHex("#E57373");
  export const Red400 = Color.fromHex("#EF5350");
  export const Red500 = Color.fromHex("#F44336");
  export const Red600 = Color.fromHex("#E53935");
  export const Red700 = Color.fromHex("#D32F2F");
  export const Red800 = Color.fromHex("#C62828");
  export const Red900 = Color.fromHex("#B71C1C");

  // pink
  export const Pink50 = Color.fromHex("#FCE4EC");
  export const Pink100 = Color.fromHex("#F8BBD0");
  export const Pink200 = Color.fromHex("#F48FB1");
  export const Pink300 = Color.fromHex("#F06292");
  export const Pink400 = Color.fromHex("#EC407A");
  export const Pink500 = Color.fromHex("#E91E63");
  export const Pink600 = Color.fromHex("#D81B60");
  export const Pink700 = Color.fromHex("#C2185B");
  export const Pink800 = Color.fromHex("#AD1457");
  export const Pink900 = Color.fromHex("#880E4F");

  // purple
  export const Purple50 = Color.fromHex("#F3E5F5");
  export const Purple100 = Color.fromHex("#E1BEE7");
  export const Purple200 = Color.fromHex("#CE93D8");
  export const Purple300 = Color.fromHex("#BA68C8");
  export const Purple400 = Color.fromHex("#AB47BC");
  export const Purple500 = Color.fromHex("#9C27B0");
  export const Purple600 = Color.fromHex("#8E24AA");
  export const Purple700 = Color.fromHex("#7B1FA2");
  export const Purple800 = Color.fromHex("#6A1B9A");
  export const Purple900 = Color.fromHex("#4A148C");

  // blue
  export const Blue50 = Color.fromHex("#E3F2FD");
  export const Blue100 = Color.fromHex("#BBDEFB");
  export const Blue200 = Color.fromHex("#90CAF9");
  export const Blue300 = Color.fromHex("#64B5F6");
  export const Blue400 = Color.fromHex("#42A5F5");
  export const Blue500 = Color.fromHex("#2196F3");
  export const Blue600 = Color.fromHex("#1E88E5");
  export const Blue700 = Color.fromHex("#1976D2");
  export const Blue800 = Color.fromHex("#1565C0");
  export const Blue900 = Color.fromHex("#0D47A1");

  // green
  export const Green50 = Color.fromHex("#E8F5E9");
  export const Green100 = Color.fromHex("#C8E6C9");
  export const Green200 = Color.fromHex("#A5D6A7");
  export const Green300 = Color.fromHex("#81C784");
  export const Green400 = Color.fromHex("#66BB6A");
  export const Green500 = Color.fromHex("#4CAF50");
  export const Green600 = Color.fromHex("#43A047");
  export const Green700 = Color.fromHex("#388E3C");
  export const Green800 = Color.fromHex("#2E7D32");
  export const Green900 = Color.fromHex("#1B5E20");

  // yellow
  export const Yellow50 = Color.fromHex("#FFFDE7");
  export const Yellow100 = Color.fromHex("#FFF9C4");
  export const Yellow200 = Color.fromHex("#FFF59D");
  export const Yellow300 = Color.fromHex("#FFF176");
  export const Yellow400 = Color.fromHex("#FFEE58");
  export const Yellow500 = Color.fromHex("#FFEB3B");
  export const Yellow600 = Color.fromHex("#FDD835");
  export const Yellow700 = Color.fromHex("#FBC02D");
  export const Yellow800 = Color.fromHex("#F9A825");
  export const Yellow900 = Color.fromHex("#F57F17");

  // orange
  export const Orange50 = Color.fromHex("#FFF3E0");
  export const Orange100 = Color.fromHex("#FFE0B2");
  export const Orange200 = Color.fromHex("#FFCC80");
  export const Orange300 = Color.fromHex("#FFB74D");
  export const Orange400 = Color.fromHex("#FFA726");
  export const Orange500 = Color.fromHex("#FF9800");
  export const Orange600 = Color.fromHex("#FB8C00");
  export const Orange700 = Color.fromHex("#F57C00");
  export const Orange800 = Color.fromHex("#EF6C00");
  export const Orange900 = Color.fromHex("#E65100");

  // gray
  export const Gray50 = Color.fromHex("#FAFAFA");
  export const Gray100 = Color.fromHex("#F5F5F5");
  export const Gray200 = Color.fromHex("#EEEEEE");
  export const Gray300 = Color.fromHex("#E0E0E0");
  export const Gray400 = Color.fromHex("#BDBDBD");
  export const Gray500 = Color.fromHex("#9E9E9E");
  export const Gray600 = Color.fromHex("#757575");
  export const Gray700 = Color.fromHex("#616161");
  export const Gray800 = Color.fromHex("#424242");
  export const Gray900 = Color.fromHex("#212121");
}

/** Default themes for the game */
namespace Theme {
  // text and fonts
  export type TextTypes = "Header" | "Subheading" | "Normal";
  export type TextSizes = 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 34 | 36;

  export const FontTypes: { [key in TextTypes]: Enum.Font } = {
    Header: Enum.Font.GothamBold,
    Subheading: Enum.Font.SourceSansBold,
    Normal: Enum.Font.SourceSans,
  };
  export const FontTypeSizes: { [key in TextTypes]: number } = {
    Header: 28,
    Subheading: 24,
    Normal: 20,
  };

  // default constraints
  export const RadiusDefaultCornerConstraint = 8;

  // paddings
  export const PaddingText = 15;
  export const PaddingList = 8;

  // main
  export const TransparencyShadow = 0.4;

  // alert
  export const WidthAlert = 450;

  // colors
  export const ColorBlack = new Color3(0, 0, 0);
  export const ColorWhite = new Color3(1, 1, 1);

  // card
  export const SizeCardShadow = 6;
  export const RadiusCardShadow = 0.04;
  export const PaddingCard = 15;
  export const ColorCard = ColorWhite;

  // icon buttons
  export const TransparencyIconButtonOverlay = 0.9;
  export const RadiusIconButtonExtendedOverlay = 20;

  // ripple
  export const TransparencyRippleOverlay = 0.7;

  // input textbox
  export const ColorBackgroundTextbox = MaterialColors.Gray300;
  export const ColorBackgroundTextboxDisabled = MaterialColors.Gray500;
  export const ColorForegroundTextbox = ColorBlack;

  export const ColorForegroundPlaceholderText = MaterialColors.Gray600;

  // icons
  export type TypesIcon =
    | "ArrowBottom"
    | "ArrowLeft"
    | "ArrowRight"
    | "ArrowTop"
    | "Checkmark"
    | "ChevronLeft"
    | "ChevronRight"
    | "Circle"
    | "Close"
    | "Error"
    | "ExpandLess"
    | "ExpandMore"
    | "StarOutline"
    | "StarFilled"
    | "Warning";

  export const DefaultSizeIcon = 30;

  export const ImageIcons: { [key in TypesIcon]: string } = {
    ArrowBottom: "rbxassetid://8079592986",
    ArrowLeft: "rbxassetid://8079592827",
    ArrowRight: "rbxassetid://8079592692",
    ArrowTop: "rbxassetid://8079592512",
    Checkmark: "rbxassetid://8079592235",
    ChevronLeft: "rbxassetid://8079591953",
    ChevronRight: "rbxassetid://8079591673",
    Circle: RobloxUtil.assetUrlWithId(602504628),
    Close: "rbxassetid://8079829038",
    Error: "rbxassetid://8079591449",
    ExpandLess: "rbxassetid://8079591142",
    ExpandMore: "rbxassetid://8079590903",
    StarOutline: "rbxassetid://8079590568",
    StarFilled: "rbxassetid://8079590367",
    Warning: "rbxassetid://8079590119",
  };

  // toggle switch
  export type TypesToggleSwitch = "Disabled" | "Secondary" | "Primary";
  export const ColorsToggleSwitchBackground: { [key in TypesToggleSwitch]: Color3 } = {
    Disabled: MaterialColors.Gray500,
    Primary: MaterialColors.Blue400,
    Secondary: MaterialColors.Gray500,
  };
  export const ColorsToggleSwitchInner: { [key in TypesToggleSwitch]: Color3 } = {
    Disabled: MaterialColors.Gray300,
    Primary: MaterialColors.Blue200,
    Secondary: MaterialColors.Gray100,
  };

  export const SizeToggleSwitchInnerCircle = 25;
  export const SizeToggleSwitchGap = 10;

  // button
  export type TypesButton = "Primary" | "Secondary" | "Outlined" | "Text";

  export const FontButton = Enum.Font.SourceSans;
  export const FontSizeButton = 20;

  export const TransparencyButtonHover = 0.85;

  export const ColorsButtonTypeHover: { [key in TypesButton]: Color3 } = {
    Primary: ColorWhite,
    Secondary: ColorBlack,
    Outlined: ColorBlack,
    Text: ColorBlack,
  };

  export const ColorsButtonType: { [key in TypesButton]: Color3 } = {
    Primary: MaterialColors.Blue200,
    Secondary: MaterialColors.Gray300,
    Outlined: MaterialColors.Gray300,
    Text: ColorWhite,
  };

  export const TextColorsButtonType: { [key in TypesButton]: Color3 } = {
    Primary: ColorBlack,
    Secondary: ColorBlack,
    Outlined: ColorBlack,
    Text: ColorBlack,
  };
}

export default Theme;

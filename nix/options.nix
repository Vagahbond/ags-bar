{lib, ...}: let
  hexColor = lib.types.strMatching "^\#([0-9A-Fa-f]{2}){3,4}$";
in {
  options.ags = {
    enable = lib.mkEnableOption "AGS";
    vars = {
      radius = lib.mkOption {
        description = "radius for angled elements of the bar";
        default = 0;
        example = 0;
        type = lib.types.int;
      };

      bg = lib.mkOption {
        description = "Background color for the bar";
        default = "#181818";
        example = "#181818";
        type = hexColor;
      };
      fg = lib.mkOption {
        description = "Font color for the bar";
        default = "#d8d8d8";
        example = "#181818";
        type = hexColor;
      };
      accent = lib.mkOption {
        description = "Accent color for the bar (used in separators)";
        default = "#ab4642";
        example = "#181818";
        type = hexColor;
      };
      good = lib.mkOption {
        description = "Color for something positive (used for a full battery)";
        default = "#a1b56c";
        example = "#181818";
        type = hexColor;
      };
      warning = lib.mkOption {
        description = "Color for some warning (used for battery level)";
        default = "#dc9656";
        example = "#181818";
        type = hexColor;
      };
      bad = lib.mkOption {
        description = "Color for some critical situation (used for very low battery level)";
        default = "#ab4642";
        example = "#181818";
        type = hexColor;
      };
    };
  };
}

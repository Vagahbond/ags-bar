{agsPackage}: ({
  lib,
  config,
  pkgs,
  ...
}: let
  generatedVars =
    pkgs.writeTextFile
    {
      name = "vars.scss";
      text = import ./vars.scss.nix {inherit config;};
    };
in {
  imports = [
    ./options.nix
  ];

  config = lib.mkIf config.ags.enable {
    environment.systemPackages = [
      (
        agsPackage.overrideAttrs (previousAttrs: {
          patchPhase = ''
            # rm ./vars.scss

            cp -L ${generatedVars} ./vars.scss
          '';
        })
      )
    ];
  };
})

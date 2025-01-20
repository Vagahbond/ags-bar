{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    ags.url = "github:aylur/ags";
  };

  outputs = {
    nixpkgs,
    ags,
    ...
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};

    extraAgsPackages = [
      ags.packages.${system}.hyprland
      ags.packages.${system}.mpris
      ags.packages.${system}.battery
      ags.packages.${system}.tray
    ];

    agsPackage = ags.lib.bundle {
      inherit pkgs;
      src = ./.;
      name = "ags_bar"; # name of executable
      entry = "app.ts";

      # additional libraries and executables to add to gjs' runtime
      extraPackages = extraAgsPackages;
    };
  in {
    nixosModules.default = (import ./nix/default.nix) {inherit agsPackage;};

    devShells.${system}.default =
      pkgs.mkShell
      {
        packages = [
          (ags.packages.${system}.default.override {
            extraPackages = extraAgsPackages;
          })
        ];

        buildInputs = [
          (ags.packages.${system}.default.override {
            extraPackages = extraAgsPackages;
          })
        ];
      };
  };
}

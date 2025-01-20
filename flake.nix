{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    ags.url = "github:aylur/ags";
  };

  outputs = {
    self,
    nixpkgs,
    ags,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};

    agsPackages = [
      ags.packages.${system}.hyprland
      ags.packages.${system}.mpris
      ags.packages.${system}.battery
      ags.packages.${system}.wireplumber
      ags.packages.${system}.network
      ags.packages.${system}.tray
    ];
  in {
    packages.${system}.default = ags.lib.bundle {
      inherit pkgs;
      src = ./.;
      name = "nix-shell"; # name of executable
      entry = "app.ts";

      # additional libraries and executables to add to gjs' runtime
      extraPackages = agsPackages;
    };

    devShells.${system}.default =
      pkgs.mkShell
      {
        packages = [
          (ags.packages.${system}.default.override {
            extraPackages = agsPackages;
          })
        ];

        buildInputs = [
          (ags.packages.${system}.default.override {
            extraPackages = agsPackages;
          })
        ];
      };
  };
}

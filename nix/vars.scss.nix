{config}: let
  inherit
    (config.ags.vars)
    bg
    fg
    accent
    good
    warning
    bad
    radius
    ;
in ''
  $bg: ${bg};
  $fg: ${fg};
  $accent: ${accent};
  $good: ${good};
  $warning: ${warning};
  $bad: ${bad};
  $radius: ${builtins.toString radius};

''

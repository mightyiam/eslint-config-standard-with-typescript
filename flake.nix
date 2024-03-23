{
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = {
    nixpkgs,
    flake-utils,
    self,
  }: let
    inherit
      (builtins)
      tryEval
      ;

    inherit
      (nixpkgs.lib)
      attrValues
      concatStringsSep
      filterAttrs
      hasPrefix
      isDerivation
      ;

    inherit
      (flake-utils.lib)
      eachDefaultSystem
      mkApp
      ;

    systemAgnosticOutputs = eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};

      inherit
        (pkgs)
        writeShellScript
        ;

      allRuntimes = attrValues (filterAttrs (name: pkg: hasPrefix "nodejs_" name && isDerivation (tryEval pkg).value) pkgs);

      testWithRuntime = runtime:
        writeShellScript "test-with-${runtime.version}" (
          let
            npm = "${runtime}/bin/npm";
          in ''
            ${npm} install
            ${npm} test
          ''
        );

      allTests = map testWithRuntime allRuntimes;

      test = writeShellScript "test" (pkgs.lib.traceVal (concatStringsSep "\n" allTests));
    in {
      devShells.default = pkgs.mkShell {packages = [pkgs.nodejs];};

      apps.test = mkApp {drv = test;};
    });
  in
    systemAgnosticOutputs;
}
